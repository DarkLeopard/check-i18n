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

export type CreateLoaderFnType = (chunksNumber: number) => void;
export type IncrementLoaderFnType = () => void;

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
		excludedKeys: string[],
		createLoaderFn: CreateLoaderFnType = () => undefined,
		incrementLoaderFn: IncrementLoaderFnType = () => undefined,
	): Observable<ISearchedChanks> {
		const searchChunks: Observable<ISearchedChanks>[][] = this.createChunks(translationKeys, excludedKeys);
		if (createLoaderFn) {
			createLoaderFn(searchChunks.length);
		}
		return this.recursSearchChunks$(searchChunks, incrementLoaderFn)
			.pipe(
				map((result: ISearchedChanks[]) => {
					return this.searchedResults = this.combineChunks(result);
				}),
			);
	}

	public researchCutUnfoundedKeys(
		createLoaderFn: CreateLoaderFnType = () => undefined,
		incrementLoaderFn: IncrementLoaderFnType = () => undefined,
	): Observable<ISearchedChanks> {
		const unfoundedKeys: TranslationKey[] = this.searchedResults.unfounded;
		const unfoundedCutKeys: TranslationKey[] = unfoundedKeys.map((value: TranslationKey) => value.cutValue());

		const searchChunks: Observable<ISearchedChanks>[][] = this.createChunks(unfoundedCutKeys);

		if (createLoaderFn) {
			createLoaderFn(searchChunks.length);
		}

		return this.recursSearchChunks$(searchChunks, incrementLoaderFn)
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
		incrementLoaderFn: IncrementLoaderFnType,
		chunkCounter: number = 0,
		searchedChunks: ISearchedChanks[] = [],
	): Observable<ISearchedChanks[]> {
		return forkJoin(queryChunks[chunkCounter])
			.pipe(
				switchMap((foundedResults: ISearchedChanks[]) => {
					if (chunkCounter >= (queryChunks.length - 1)) {
						incrementLoaderFn();
						return of([...searchedChunks, ...foundedResults]);
					} else {
						chunkCounter++;
						incrementLoaderFn();
						searchedChunks.push(...foundedResults);
						return this.recursSearchChunks$(queryChunks, incrementLoaderFn, chunkCounter, searchedChunks);
					}
				}),
			);
	}

	private createChunks(
		translationKeys: TranslationKey[],
		excludedKeys: string[] = [],
	): Observable<ISearchedChanks>[][] {
		return chunk(
			translationKeys
				// filter excluded key from user
				.filter((key: TranslationKey) => excludedKeys.length > 0 ? key.isExcluded(excludedKeys) : true)
				.map((key: TranslationKey) => {
					// console.info(`Add to search key: ${key.value}`);
					return this.search.find$(key);
				}),
			this.chunkSize,
		);
	}
}
