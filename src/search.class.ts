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

	private getSearchedChunks(key: TranslationKey): ISearchedChanks {
		const searchResults: TranslationKey[] = this.searchPatternInDirectory(key);

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

	private searchPatternInDirectory(
		key: TranslationKey,
	): TranslationKey[] {
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
