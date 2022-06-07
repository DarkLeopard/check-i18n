"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslationChunks = void 0;
const lodash_1 = require("lodash");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
class TranslationChunks {
    constructor(chunkSize = 20, search) {
        this.chunkSize = chunkSize;
        this.search = search;
        this.searchedResultsBSubject = new rxjs_1.BehaviorSubject({
            founded: [],
            unfounded: [],
        });
        this.searchedResults$ = this.searchedResultsBSubject.asObservable();
    }
    get searchedResults() {
        return this.searchedResultsBSubject.value;
    }
    set searchedResults(searchResults) {
        this.searchedResultsBSubject.next(searchResults);
    }
    combineChunks(chunks) {
        return chunks.reduce((acc, chunk) => {
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
        }, { founded: [], unfounded: [] });
    }
    searchChunks$(translationKeys, excludedKeys, createLoaderFn = () => undefined, incrementLoaderFn = () => undefined) {
        const searchChunks = this.createChunks(translationKeys, excludedKeys);
        if (createLoaderFn) {
            createLoaderFn(searchChunks.length);
        }
        return this.recursSearchChunks$(searchChunks, incrementLoaderFn)
            .pipe((0, rxjs_1.map)((result) => {
            return this.searchedResults = this.combineChunks(result);
        }));
    }
    researchCutUnfoundedKeys(createLoaderFn = () => undefined, incrementLoaderFn = () => undefined) {
        const unfoundedKeys = this.searchedResults.unfounded;
        const unfoundedCutKeys = unfoundedKeys.map((value) => value.cutValue());
        const searchChunks = this.createChunks(unfoundedCutKeys);
        if (createLoaderFn) {
            createLoaderFn(searchChunks.length);
        }
        return this.recursSearchChunks$(searchChunks, incrementLoaderFn)
            .pipe((0, rxjs_1.map)((result) => {
            const combinedChunks = this.combineChunks(result);
            const alreadyFoundedKeys = this.searchedResults.founded;
            return this.searchedResults = {
                founded: [...alreadyFoundedKeys, ...combinedChunks.founded],
                unfounded: combinedChunks.unfounded,
            };
        }));
    }
    recursSearchChunks$(queryChunks, incrementLoaderFn, chunkCounter = 0, searchedChunks = []) {
        return (0, rxjs_1.forkJoin)(queryChunks[chunkCounter])
            .pipe((0, operators_1.switchMap)((foundedResults) => {
            if (chunkCounter >= (queryChunks.length - 1)) {
                incrementLoaderFn();
                return (0, rxjs_1.of)([...searchedChunks, ...foundedResults]);
            }
            else {
                chunkCounter++;
                incrementLoaderFn();
                searchedChunks.push(...foundedResults);
                return this.recursSearchChunks$(queryChunks, incrementLoaderFn, chunkCounter, searchedChunks);
            }
        }));
    }
    createChunks(translationKeys, excludedKeys = []) {
        return (0, lodash_1.chunk)(translationKeys
            // filter excluded key from user
            .filter((key) => excludedKeys.length > 0 ? key.isExcluded(excludedKeys) : true)
            .map((key) => {
            // console.info(`Add to search key: ${key.value}`);
            return this.search.find$(key);
        }), this.chunkSize);
    }
}
exports.TranslationChunks = TranslationChunks;
//# sourceMappingURL=translation-chunks.class.js.map