"use strict";
var _TranslationKey_isCut;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslationKey = void 0;
const tslib_1 = require("tslib");
const QUOTES_REGEXP_STR = '(\'|\"|\`)';
class TranslationKey {
    constructor(value) {
        this.value = value;
        this.paths = [];
        _TranslationKey_isCut.set(this, false);
        this.rawValue = value;
    }
    get isCut() {
        return tslib_1.__classPrivateFieldGet(this, _TranslationKey_isCut, "f");
    }
    set isCut(value) {
        tslib_1.__classPrivateFieldSet(this, _TranslationKey_isCut, value, "f");
    }
    get isFounded() {
        return this.paths.length > 0;
    }
    get isUnfounded() {
        return this.paths.length === 0;
    }
    get keyRegExp() {
        let value = this.value;
        switch (true) {
            case this.hasNumberAtEnd(value):
                value = this.deleteLastSegment(value);
                if (this.hasNumberAtEnd(value)) { // second time cos have can some translations like that case
                    value = this.deleteLastSegment(value);
                }
            case true: // replace dots for regExp
                value = value.replace(/\./, '\\.');
            case true: // add quotes
                value = `${QUOTES_REGEXP_STR}${value}${QUOTES_REGEXP_STR}`;
        }
        return new RegExp(value);
    }
    setPath(path) {
        this.paths.push(path);
        return this;
    }
    /** Realisation without get raw value for results cos classes used. That can affect those classes in memory. */
    cutValue(value = this.value) {
        let newValue = value;
        if (!this.isCut) {
            newValue = this.deleteLastSegment(newValue);
            if (this.hasNumberAtEnd(newValue)) {
                newValue = this.deleteLastSegment(newValue);
            }
            this.changeValue(`${newValue}.`); // add dot for cutted values
            this.isCut = true;
            return this;
        }
        else {
            throw new Error('DEV_ERROR: Value must be uncutted');
        }
    }
    /** Realisation without get raw value for results cos classes used. That can affect those classes in memory. */
    uncutValue() {
        if (this.isCut) {
            this.value = this.rawValue;
            this.isCut = false;
            return this;
        }
        else {
            throw new Error('DEV_ERROR: Value must be cutted');
        }
    }
    isExcluded(excludeKeys) {
        const keyRegExp = new RegExp(`^${QUOTES_REGEXP_STR}${this.value}[A-Za-z0-9\._-]{0,60}${QUOTES_REGEXP_STR}`);
        return excludeKeys.some((excludedKey) => excludedKey.match(keyRegExp)) || this.value;
    }
    hasNumberAtEnd(value) {
        const valueArr = value.split('.');
        const numberRexExp = new RegExp('^\d$');
        return numberRexExp.test(valueArr[valueArr.length - 1]);
    }
    deleteLastSegment(value) {
        const valueArr = value.split('.');
        // check more when one segment
        if (valueArr.length > 1) {
            valueArr.pop();
            return valueArr.slice(0, valueArr.length - 1).join('.');
        }
        else {
            return value;
        }
    }
    changeValue(value) {
        this.value = value;
        return this;
    }
}
exports.TranslationKey = TranslationKey;
_TranslationKey_isCut = new WeakMap();
//# sourceMappingURL=tranlation-key.class.js.map