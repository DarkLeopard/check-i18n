import {chunk} from 'lodash';
import {
	BehaviorSubject,
	forkJoin,
	map,
	Observable,
	of,
} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {ISearchedChanks} from './interfaces/searched-chunks.interface';
import {Search} from './search.class';
import {TranslationKey} from './tranlation-key.class';
import {VisualLoader} from './visual-loader.class';

export class TranslationChunks {
	private searchedResultsBSubject: BehaviorSubject<ISearchedChanks> = new BehaviorSubject<ISearchedChanks>({
		founded: [],
		unfounded: [],
	});
	public searchedResults$: Observable<ISearchedChanks> = this.searchedResultsBSubject.asObservable();

	constructor(
		private chunkSize: number = 20,
		private search: Search,
	) {
	}

	private get searchedResults(): ISearchedChanks {
		return this.searchedResultsBSubject.value;
	}

	private set searchedResults(searchResults: ISearchedChanks) {
		this.searchedResultsBSubject.next(searchResults);
	}

	public combineChunks(chunks: ISearchedChanks[]): ISearchedChanks {
		return chunks.reduce<ISearchedChanks>(
			(acc: ISearchedChanks, chunk: ISearchedChanks) => {
				return {
					founded: [
						...acc.founded,
						...chunk.founded,
					],
					unfounded: [
						...acc.unfounded,
						...chunk.unfounded,
					],
				};
			},
			{founded: [], unfounded: []});
	}

	public searchChunks$(
		translationKeys: TranslationKey[],
		visualLoader?: VisualLoader,
	): Observable<ISearchedChanks> {
		const searchChunks: Observable<ISearchedChanks>[][] = this.createChunks(translationKeys);
		if (visualLoader) {
			visualLoader.createLoaderFn(searchChunks.length);
		}
		return this.recursSearchChunks$(searchChunks, visualLoader)
			.pipe(
				map((result: ISearchedChanks[]) => {
					return this.searchedResults = this.combineChunks(result);
				}),
			);
	}

	public searchCutUnfoundedKeys(visualLoader?: VisualLoader): Observable<ISearchedChanks> {
		const unfoundedCutKeys: TranslationKey[] = this.searchedResults
			.unfounded
			.map((value: TranslationKey) => value.cutValue());
		console.log(unfoundedCutKeys.map(v => v.value));

		const searchChunks: Observable<ISearchedChanks>[][] = this.createChunks(unfoundedCutKeys);

		if (visualLoader) {
			visualLoader.createLoaderFn(searchChunks.length);
		}

		return this.recursSearchChunks$(searchChunks, visualLoader)
			.pipe(
				map((result: ISearchedChanks[]) => {
					const combinedChunks: ISearchedChanks = this.combineChunks(result);
					const alreadyFoundedKeys: TranslationKey[] = this.searchedResults.founded;

					return this.searchedResults = {
						founded: [...alreadyFoundedKeys, ...combinedChunks.founded],
						unfounded: combinedChunks.unfounded,
					};
				}),
			);
	}

	private recursSearchChunks$(
		queryChunks: Observable<ISearchedChanks>[][],
		visualLoader?: VisualLoader,
		chunkCounter: number = 0,
		searchedChunks: ISearchedChanks[] = [],
	): Observable<ISearchedChanks[]> {
		return forkJoin(queryChunks[chunkCounter])
			.pipe(
				switchMap((foundedResults: ISearchedChanks[]) => {
					if (chunkCounter >= (queryChunks.length - 1)) {
						visualLoader?.incrementLoaderFn();
						return of([...searchedChunks, ...foundedResults]);
					} else {
						chunkCounter++;
						visualLoader?.incrementLoaderFn();
						searchedChunks.push(...foundedResults);
						return this.recursSearchChunks$(queryChunks, visualLoader, chunkCounter, searchedChunks);
					}
				}),
			);
	}

	private createChunks(
		translationKeys: TranslationKey[],
	): Observable<ISearchedChanks>[][] {
		return chunk(
			translationKeys
				.map((key: TranslationKey) => {
					// console.info(`Add to search key: ${key.value}`);
					return this.search.find$(key);
				}),
			this.chunkSize,
		);
	}
}
