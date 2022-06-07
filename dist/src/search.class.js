"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Search = void 0;
const fs_1 = require("fs");
const lodash_1 = require("lodash");
const path_1 = require("path");
const rxjs_1 = require("rxjs");
class Search {
    constructor(whereToFindDir, fileExt) {
        this.paths = [];
        this.filesContent = {};
        if (!(0, fs_1.existsSync)(whereToFindDir)) {
            throw new Error(`Specified directory: "${whereToFindDir}" does not exist`);
        }
        this.paths = this.getFilesPathsInDirectory(whereToFindDir, fileExt);
    }
    find$(translationKey) {
        return new rxjs_1.Observable((observer) => {
            observer.next(this.getSearchedChunks(translationKey));
            observer.complete();
        });
    }
    getSearchedChunks(key) {
        const searchResults = this.searchPatternInDirectory(key.keyRegExp, key);
        const uniqByFc = (key) => !!key.value;
        const founded = (0, lodash_1.uniqBy)(searchResults.filter((key) => key.isFounded), uniqByFc);
        const unfounded = (0, lodash_1.uniqBy)(searchResults.filter((key) => key.isUnfounded), uniqByFc)
            .filter((unfounded) => !founded.some((founded) => founded.value === unfounded.value));
        return {
            founded: founded,
            unfounded: unfounded,
        };
    }
    searchPatternInDirectory(pattern, key) {
        return this.paths
            .map((path) => {
            const fileContent = this.filesContent[path] || (0, fs_1.readFileSync)(path, { encoding: 'utf8' });
            this.filesContent[path] = fileContent;
            if (pattern.test(fileContent)) {
                // console.info(`${key.value} was found in file: ${path}`);
                return key.setPath(path);
            }
            else {
                // console.info(`${key} was NOT found in file: ${path}`);
                return key;
            }
        });
    }
    getFilesPathsInDirectory(dir, ext) {
        if (!(0, fs_1.existsSync)(dir)) {
            console.error(`Specified directory: ${dir} does not exist`);
            return [];
        }
        let files = [];
        (0, fs_1.readdirSync)(dir)
            .forEach((file) => {
            const filePath = (0, path_1.join)(String(dir), file);
            const stat = (0, fs_1.lstatSync)(filePath);
            // If we hit a directory, apply our function to that dir. If we hit a file, add it to the array of files.
            if (stat.isDirectory()) {
                const nestedFiles = this.getFilesPathsInDirectory(filePath, ext);
                files = files.concat(nestedFiles);
            }
            else if (ext.test((0, path_1.basename)(file))) {
                files.push(filePath);
            }
        });
        return files;
    }
}
exports.Search = Search;
//# sourceMappingURL=search.class.js.map