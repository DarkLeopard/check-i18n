import {appendFile} from 'fs';
import {now} from 'lodash';
import {
	finalize,
	of,
	switchMap,
	take,
} from 'rxjs';
import {ICookedResult} from './interfaces/cooked-results.interface';
import {ISearchedChanks} from './interfaces/searched-chunks.interface';
import {Search} from './search.class';
import {TranslationKey} from './tranlation-key.class';
import {TranslationChunks} from './translation-chunks.class';
import {Translation} from './translation.class';
import {VisualLoader} from './visual-loader.class';

interface ProgramConfig {
	translationPath: string;
	chunkSize: number;
	fileNameRegexp: RegExp;
	whereToFindDir: string;
	cutKeys: boolean;
	replacePlural: boolean;
}

export class Program {
	private readonly translation: Translation;
	private readonly chunkSize: number;
	private readonly fileNameRegexp: RegExp;
	private readonly whereToFindDir: string;
	private readonly cutKeys: boolean;
	private readonly startTime: number = now();
	private readonly replacePlural: boolean;

	constructor(
		private readonly config: ProgramConfig,
	) {
		this.translation = new Translation(config.translationPath);
		this.chunkSize = config.chunkSize;
		this.fileNameRegexp = config.fileNameRegexp;
		this.whereToFindDir = config.whereToFindDir;
		this.cutKeys = config.cutKeys;
		this.replacePlural = config.replacePlural;
	}

	public init(): void {
		this.translation.init()
			.subscribe(() => {
				const visualLoaderGeneral: VisualLoader = new VisualLoader(`Search translation keys`);

				const chunksArray: TranslationChunks = new TranslationChunks(
					this.chunkSize,
					new Search(this.whereToFindDir, this.fileNameRegexp),
					this.replacePlural,
				);
				chunksArray.searchChunks$(
					this.translation.keys,
					visualLoaderGeneral,
				)
					.subscribe(
						undefined,
						(err: unknown) => {
							console.error(err);
						},
						() => {
							visualLoaderGeneral.stop();
						},
					);

				chunksArray.searchedResults$
					.pipe(
						take(1),
						switchMap((searchedChunks: ISearchedChanks) => {
							if (this.cutKeys) {
								const visualLoaderCut: VisualLoader = new VisualLoader(
									`Repeat search for check unfounded cut keys`,
								);

								return chunksArray.searchCutUnfoundedKeys(visualLoaderCut)
									.pipe(
										finalize(() => {
											// return to normal state
											// not necessary, but was in old realisation
											[...searchedChunks.founded, ...searchedChunks.unfounded]
												.filter((key: TranslationKey) => key.isCut)
												.forEach((key: TranslationKey) => key.uncutValue());

											visualLoaderCut.stop();
										}),
									);
							} else {
								return of(searchedChunks);
							}
						}),
					)
					.subscribe((searchedChunks: ISearchedChanks) => {
						this.saveLocalJSON(this.prepareProgramResult(searchedChunks));
					});
			});

	}

	private prepareProgramResult(searchedChunks: ISearchedChanks, isKeysCut: boolean = this.cutKeys): ICookedResult {
		return {
			foundedKeys: {
				keys: searchedChunks.founded.map((key: TranslationKey) => key.rawValue),
				amount: searchedChunks.founded.length,
			},
			unfoundedKeys: {
				keys: searchedChunks.unfounded.map((key: TranslationKey) => key.rawValue),
				amount: searchedChunks.unfounded.length,
			},
		};
	}

	private saveLocalJSON(data: ICookedResult): void {
		const file: string = `./i18n-report_${this.startTime}.json`;
		appendFile(
			file,
			JSON.stringify(data, undefined, 2),
			{encoding: 'utf8'},
			(error: NodeJS.ErrnoException | null) => {
				if (error) {
					throw error;
				}
				console.info(`${file} was created`);
			});
	}
}
