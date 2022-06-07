"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Translation = void 0;
const https_1 = require("https");
const rxjs_1 = require("rxjs");
const tranlation_key_class_1 = require("./tranlation-key.class");
class Translation {
    constructor(translationPath) {
        this.translationPath = translationPath;
        this.translationKeys = [];
    }
    get keys() {
        return this.translationKeys;
    }
    init() {
        return this.getTranslations$(this.translationPath)
            .pipe((0, rxjs_1.tap)((translation) => {
            this.translationKeys = this.getTranslationKeysFromObj(translation);
        }));
    }
    getTranslationKeysFromObj(translation) {
        const result = [];
        for (const key0 in translation) {
            if (typeof translation[key0] !== 'string') {
                this.getTranslationKeysFromObj(translation[key0]).forEach((key1) => {
                    result.push(new tranlation_key_class_1.TranslationKey(`${key0}.${(key1.value)}`));
                });
            }
            else {
                result.push(new tranlation_key_class_1.TranslationKey(key0));
            }
        }
        return result;
    }
    getTranslations$(url) {
        return new rxjs_1.Observable((subscriber) => {
            (0, https_1.get)(url, (incomingMessage) => {
                incomingMessage.setEncoding('utf8');
                const dataChunks = [];
                incomingMessage
                    .on('data', (dataChunk) => {
                    dataChunks.push(dataChunk);
                })
                    .on('end', () => {
                    const translation = JSON.parse(dataChunks.join(''));
                    subscriber.next(translation);
                    subscriber.complete();
                })
                    .on('error', function () {
                    throw new Error('Failed to make an translation request');
                });
            });
        });
    }
}
exports.Translation = Translation;
//# sourceMappingURL=translation.class.js.map