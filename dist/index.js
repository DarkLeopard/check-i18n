"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const lodash_1 = require("lodash");
const rxjs_1 = require("rxjs");
const search_class_1 = require("./src/search.class");
const translation_chunks_class_1 = require("./src/translation-chunks.class");
const translation_class_1 = require("./src/translation.class");
const visual_loader_class_1 = require("./src/visual-loader.class");
var PropsEnum;
(function (PropsEnum) {
    PropsEnum["I18nPath"] = "--i18nDir=";
    PropsEnum["FindInDir"] = "--findDir=";
    PropsEnum["CutKeys"] = "--cutKeys=";
})(PropsEnum || (PropsEnum = {}));
const CONSOLE_PROPS = process.argv;
const translationUrl = getProp(PropsEnum.I18nPath);
const whereToFindDir = getProp(PropsEnum.FindInDir);
const cutKeys = getProp(PropsEnum.CutKeys) === 'true' || false;
if (!whereToFindDir || !translationUrl) {
    throw new Error('Required params not set!');
}
function getProp(commandArgument) {
    const propRegExp = new RegExp(`${commandArgument}`);
    const foundedProp = CONSOLE_PROPS.find((prop) => propRegExp.test(prop));
    if (!!foundedProp) {
        return foundedProp
            .replace(propRegExp, '')
            .replace(/('|")*/g, '');
    }
    else {
        return undefined;
    }
}
// general opt
const WHERE_TO_FIND_DIR = whereToFindDir;
const CUT_RESEARCH_KEYS = cutKeys;
// system opt
const EXCLUDED_KEYS = [];
const CHUNK_SIZE = 20; // if U have problem => read README.md
const FILE_NAME_REGEXP = /.*\.ts$|.*\.html$/;
const START_TIME = (0, lodash_1.now)();
const translation = new translation_class_1.Translation(translationUrl);
translation.init()
    .subscribe(() => {
    const visualLoaderGeneral = new visual_loader_class_1.VisualLoader(`Search translation keys`);
    const createLoaderFn = (chunksNumber) => visualLoaderGeneral.initChunksBar(chunksNumber);
    const incrementLoaderFn = () => visualLoaderGeneral.incrementChunks();
    const chunksArray = new translation_chunks_class_1.TranslationChunks(CHUNK_SIZE, new search_class_1.Search(WHERE_TO_FIND_DIR, FILE_NAME_REGEXP));
    chunksArray.searchChunks$(translation.keys, EXCLUDED_KEYS, createLoaderFn, incrementLoaderFn)
        .subscribe(undefined, (err) => {
        console.error(err);
    }, () => {
        visualLoaderGeneral.stop();
    });
    chunksArray.searchedResults$
        .pipe((0, rxjs_1.take)(1), (0, rxjs_1.switchMap)((searchedChunks) => {
        if (CUT_RESEARCH_KEYS) {
            const visualLoaderCut = new visual_loader_class_1.VisualLoader(`Research unfounded cut keys`);
            const createLoaderFn = (chunksNumber) => visualLoaderCut.initChunksBar(chunksNumber);
            const incrementLoaderFn = () => visualLoaderCut.incrementChunks();
            return chunksArray.researchCutUnfoundedKeys(createLoaderFn, incrementLoaderFn)
                .pipe((0, rxjs_1.finalize)(() => visualLoaderCut.stop()));
        }
        else {
            return (0, rxjs_1.of)(searchedChunks);
        }
    }))
        .subscribe((searchedChunks) => {
        saveLocalJSON(prepareProgramResult(searchedChunks));
    });
});
function prepareProgramResult(searchedChunks) {
    const cutKeys = CUT_RESEARCH_KEYS
        ? [...searchedChunks.founded, ...searchedChunks.unfounded].filter((key) => key.isCut)
        : [];
    if (CUT_RESEARCH_KEYS) {
        cutKeys.forEach((key) => key.uncutValue());
    }
    return {
        foundedKeys: {
            keys: searchedChunks.founded.map((key) => key.value),
            amount: searchedChunks.founded.length,
        },
        unfoundedKeys: {
            keys: searchedChunks.unfounded.map((key) => key.value),
            amount: searchedChunks.unfounded.length,
        },
        specialReport: {
            cutKeys: {
                keys: cutKeys.map((key) => key.value),
                amount: cutKeys.length,
            },
        },
        excludedKeys: {
            manually: EXCLUDED_KEYS,
        },
    };
}
function saveLocalJSON(data) {
    const file = `./reports/i18n-report_${START_TIME}.json`;
    (0, fs_1.appendFile)(file, JSON.stringify(data), { encoding: 'utf8' }, (error) => {
        if (error) {
            throw error;
        }
        console.info(`${file} was created`);
    });
}
//# sourceMappingURL=index.js.map