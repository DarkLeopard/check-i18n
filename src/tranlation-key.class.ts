const QUOTES_REGEXP_STR: string = '(\'|\"|\`)';

export class TranslationKey {
	private paths: string[] = [];

	/** Realisation without get raw value for results cos classes used. That can affect those classes in memory. */
	private readonly rawValue: string;

	#isCut: boolean = false;

	constructor(
		public value: string,
	) {
		this.rawValue = value;
	}

	public get isCut(): boolean {
		return this.#isCut;
	}

	private set isCut(value: boolean) {
		this.#isCut = value;
	}

	public get isFounded(): boolean {
		return this.paths.length > 0;
	}

	public get isUnfounded(): boolean {
		return this.paths.length === 0;
	}

	public get keyRegExp(): RegExp {
		let value: string = this.value;
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

	public setPath(path: string): TranslationKey {
		this.paths.push(path);
		return this;
	}

	/** Realisation without get raw value for results cos classes used. That can affect those classes in memory. */
	public cutValue(value: string = this.value): this {
		let newValue: string = value;
		if (!this.isCut) {
			newValue = this.deleteLastSegment(newValue);
			if (this.hasNumberAtEnd(newValue)) {
				newValue = this.deleteLastSegment(newValue);
			}
			this.changeValue(`${newValue}.`); // add dot for cutted values
			this.isCut = true;
			return this;
		} else {
			throw new Error('DEV_ERROR: Value must be uncutted');
		}
	}

	/** Realisation without get raw value for results cos classes used. That can affect those classes in memory. */
	public uncutValue(): this {
		if (this.isCut) {
			this.value = this.rawValue;
			this.isCut = false;
			return this;
		} else {
			throw new Error('DEV_ERROR: Value must be cutted');
		}
	}

	public isExcluded(excludeKeys: string[]): true | string {
		const keyRegExp: RegExp = new RegExp(`^${QUOTES_REGEXP_STR}${this.value}[A-Za-z0-9\._-]{0,60}${QUOTES_REGEXP_STR}`);
		return excludeKeys.some((excludedKey: string) => excludedKey.match(keyRegExp)) || this.value;
	}

	private hasNumberAtEnd(value: string): boolean {
		const valueArr: string[] = value.split('.');
		const numberRexExp: RegExp = new RegExp('^\d$');
		return numberRexExp.test(valueArr[valueArr.length - 1]);
	}

	private deleteLastSegment(value: string): string {
		const valueArr: string[] = value.split('.');
		// check more when one segment
		if (valueArr.length > 1) {
			valueArr.pop();
			return valueArr.slice(0, valueArr.length - 1).join('.');
		} else {
			return value;
		}
	}

	private changeValue(value: string): TranslationKey {
		this.value = value;
		return this;
	}
}
