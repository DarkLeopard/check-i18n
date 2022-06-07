import {appendFile} from 'fs';
import {now} from 'lodash';
import {
	finalize,
	of,
	switchMap,
	take,
} from 'rxjs';
import {ICookedResult} from './src/interfaces/cooked-results.interface';
import {ISearchedChanks} from './src/interfaces/searched-chunks.interface';
import {Search} from './src/search.class';
import {TranslationKey} from './src/tranlation-key.class';
import {
	CreateLoaderFnType,
	IncrementLoaderFnType,
	TranslationChunks,
} from './src/translation-chunks.class';
import {Translation} from './src/translation.class';
import {VisualLoader} from './src/visual-loader.class';

enum PropsEnum {
	I18nPath = '--i18nDir=',
	FindInDir = '--findDir=',
	CutKeys = '--cutKeys=',
}

const CONSOLE_PROPS: string[] = process.argv;
const translationUrl: string | undefined = getProp(PropsEnum.I18nPath);
const whereToFindDir: string | undefined = getProp(PropsEnum.FindInDir);
const cutKeys: boolean = getProp(PropsEnum.CutKeys) === 'true' || false;

if (!whereToFindDir || !translationUrl) {
	throw new Error('Required params not set!');
}

function getProp(commandArgument: PropsEnum): string | undefined {
	const propRegExp: RegExp = new RegExp(`${commandArgument}`);
	const foundedProp: string | undefined = CONSOLE_PROPS.find((prop: string) => propRegExp.test(prop));
	if (!!foundedProp) {
		return foundedProp
			.replace(propRegExp, '')
			.replace(/('|")*/g, '');
	} else {
		return undefined;
	}
}

// general opt
const WHERE_TO_FIND_DIR: string = whereToFindDir;
const CUT_RESEARCH_KEYS: boolean = cutKeys;

// system opt
const EXCLUDED_KEYS: string[] = [];
const CHUNK_SIZE: number = 20; // if U have problem => read README.md
const FILE_NAME_REGEXP: RegExp = /.*\.ts$|.*\.html$/;
const START_TIME: number = now();

const translation: Translation = new Translation(translationUrl);

translation.init()
	.subscribe(() => {
		const visualLoaderGeneral: VisualLoader = new VisualLoader(
			`Search translation keys`,
		);
		const createLoaderFn: CreateLoaderFnType = (chunksNumber: number) =>
			visualLoaderGeneral.initChunksBar(chunksNumber);
		const incrementLoaderFn: IncrementLoaderFnType = () =>
			visualLoaderGeneral.incrementChunks();

		const chunksArray: TranslationChunks = new TranslationChunks(
			CHUNK_SIZE,
			new Search(WHERE_TO_FIND_DIR, FILE_NAME_REGEXP),
		);
		chunksArray.searchChunks$(
			translation.keys,
			EXCLUDED_KEYS,
			createLoaderFn,
			incrementLoaderFn,
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
					if (CUT_RESEARCH_KEYS) {
						const visualLoaderCut: VisualLoader = new VisualLoader(
							`Research unfounded cut keys`,
						);
						const createLoaderFn: CreateLoaderFnType = (chunksNumber: number) =>
							visualLoaderCut.initChunksBar(chunksNumber);
						const incrementLoaderFn: IncrementLoaderFnType = () =>
							visualLoaderCut.incrementChunks();

						return chunksArray.researchCutUnfoundedKeys(createLoaderFn, incrementLoaderFn)
							.pipe(
								finalize(() => visualLoaderCut.stop()),
							);
					} else {
						return of(searchedChunks);
					}
				}),
			)
			.subscribe((searchedChunks: ISearchedChanks) => {
				saveLocalJSON(prepareProgramResult(searchedChunks));
			});
	});

function prepareProgramResult(searchedChunks: ISearchedChanks): ICookedResult {
	const cutKeys: TranslationKey[] = CUT_RESEARCH_KEYS
		? [...searchedChunks.founded, ...searchedChunks.unfounded].filter((key: TranslationKey) => key.isCut)
		: [];
	if (CUT_RESEARCH_KEYS) {
		cutKeys.forEach((key: TranslationKey) => key.uncutValue());
	}
	return {
		foundedKeys: {
			keys: searchedChunks.founded.map((key: TranslationKey) => key.value),
			amount: searchedChunks.founded.length,
		},
		unfoundedKeys: {
			keys: searchedChunks.unfounded.map((key: TranslationKey) => key.value),
			amount: searchedChunks.unfounded.length,
		},
		specialReport: {
			cutKeys: {
				keys: cutKeys.map((key: TranslationKey) => key.value),
				amount: cutKeys.length,
			},
		},
		excludedKeys: {
			manually: EXCLUDED_KEYS,
		},
	};
}

function saveLocalJSON(data: ICookedResult): void {
	const file: string = `./reports/i18n-report_${START_TIME}.json`;
	appendFile(
		file,
		JSON.stringify(data),
		{encoding: 'utf8'},
		(error: NodeJS.ErrnoException | null) => {
			if (error) {
				throw error;
			}
			console.info(`${file} was created`);
		});
}
