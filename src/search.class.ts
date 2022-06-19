import {
	BigIntStats,
	existsSync,
	lstatSync,
	PathLike,
	readdirSync,
	readFileSync,
	Stats,
} from 'fs';
import {
	Dictionary,
	uniqBy,
} from 'lodash';
import {
	basename,
	join,
} from 'path';
import {
	Observable,
	Subscriber,
} from 'rxjs';
import {
	PLURAL_CODE_REGEXP_STR,
	PLURAL_ENDINGS,
	QUOTES_REGEXP_STR,
} from './constants/regexp';
import {ISearchedChanks} from './interfaces/searched-chunks.interface';
import {TranslationKey} from './tranlation-key.class';

export class Search {
	private paths: string[] = [];
	private filesContent: Dictionary<string> = {};

	constructor(
		whereToFindDir: PathLike,
		fileExt: RegExp,
	) {
		if (!existsSync(whereToFindDir)) {
			throw new Error(`Specified directory: "${whereToFindDir}" does not exist`);
		}
		this.paths = this.getFilesPathsInDirectory(whereToFindDir, fileExt);
	}

	public find$(translationKey: TranslationKey): Observable<ISearchedChanks> {
		return new Observable<ISearchedChanks>(
			(observer: Subscriber<ISearchedChanks>) => {
				observer.next(this.getSearchedChunks(translationKey));
				observer.complete();
			});
	}

	public searchPatternInPaths(replacePlural: boolean): TranslationKey[] {
		const rawVar: string = `[a-zA-Z\\-_%\\.1-9]`;
		const keyStaticWithQoutes: string = `(${QUOTES_REGEXP_STR}${rawVar}{1,120}${QUOTES_REGEXP_STR})`;
		const dynamicKey: string = `(${keyStaticWithQoutes}\\s?\\+\\s?${rawVar}{1,30})`;
		const key: string = `(${keyStaticWithQoutes}|${dynamicKey})`;
		const html: string = `${key}\\s?\\|\\s?translate`;
		const tsInstant: string = `\\.instant\\(${key}\\)`;
		const tsStream: string = `\\.stream\\(${key}\\)`;
		const pattern: RegExp = new RegExp(`${html}|${tsInstant}|${tsStream}`, 'gm');

		return this.paths
			.reduce<string[]>((acc: string[], path: string) => {
				const fileContent: string | undefined = this.filesContent[path] || readFileSync(path, {encoding: 'utf8'});
				this.filesContent[path] = fileContent;
				const searchResults: RegExpMatchArray = [];

				for (const match of fileContent.matchAll(pattern)) {
					searchResults.push(match[0]);
				}

				if (searchResults.length > 0) {
					return [...acc, ...searchResults];
				} else {
					return acc;
				}
			}, [])
			// clear keys
			.map((key: string) => (key.match(keyStaticWithQoutes) as RegExpMatchArray)[0])
			// delete quotes
			.map((key: string) => key.substring(1, key.length - 1))
			// replace plural and create translation key
			.reduce<TranslationKey[]>((acc: TranslationKey[], key: string) => {
				if (replacePlural && new RegExp(PLURAL_CODE_REGEXP_STR).test(key)) {
					const keyWithoutPruralCode: string = key.replace(PLURAL_CODE_REGEXP_STR, '');
					return [
						...acc,
						...PLURAL_ENDINGS
							.map((ending: string) => new TranslationKey(keyWithoutPruralCode + ending)),
					];
				} else {
					return [...acc, new TranslationKey(key)];
				}
			}, []);
	}

	private getSearchedChunks(key: TranslationKey): ISearchedChanks {
		const searchResults: TranslationKey[] = this.searchKeyInPaths(key);

		const uniqByFc: (key: TranslationKey) => boolean = (key: TranslationKey) => !!key.value;

		const founded: TranslationKey[] = uniqBy(searchResults.filter((key: TranslationKey) => key.isFounded), uniqByFc);
		const unfounded: TranslationKey[] = uniqBy(searchResults.filter((key: TranslationKey) => key.isUnfounded), uniqByFc)
			.filter((unfounded: TranslationKey) =>
				!founded.some((founded: TranslationKey) => founded.value === unfounded.value));

		return {
			founded: founded,
			unfounded: unfounded,
		};
	}

	private searchKeyInPaths(key: TranslationKey): TranslationKey[] {
		return this.paths
			.map((path: string) => {
				const fileContent: string | undefined = this.filesContent[path] || readFileSync(path, {encoding: 'utf8'});
				this.filesContent[path] = fileContent;

				if (key.regExp.test(fileContent)) {
					// console.info(`${key.value} was found in file: ${path}`);
					return key.setPath(path);
				} else {
					return key;
				}
			});
	}

	private getFilesPathsInDirectory(dir: PathLike, ext: RegExp): string[] {
		if (!existsSync(dir)) {
			console.error(`Specified directory: ${dir} does not exist`);
			return [];
		}

		let files: string[] = [];
		readdirSync(dir)
			.forEach((file: string) => {
				const filePath: string = join(String(dir), file);
				const stat: Stats | BigIntStats = lstatSync(filePath);

				// If we hit a directory, apply our function to that dir. If we hit a file, add it to the array of files.
				if (stat.isDirectory()) {
					const nestedFiles: string[] = this.getFilesPathsInDirectory(filePath, ext);
					files = files.concat(nestedFiles);
				} else if (ext.test(basename(file))) {
					files.push(filePath);
				}
			});
		return files;
	}
}
