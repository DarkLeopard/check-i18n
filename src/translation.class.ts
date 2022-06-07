import {IncomingMessage} from 'http';
import {get} from 'https';
import {
	Observable,
	Subscriber,
	tap,
} from 'rxjs';
import {TranslationKey} from './tranlation-key.class';

interface IRawTranslation {
	[key: string]: IRawTranslation | string;
}

export class Translation {
	private translationKeys: TranslationKey[] = [];

	constructor(
		private translationPath: string,
	) {
	}

	public get keys(): TranslationKey[] {
		return this.translationKeys;
	}

	public init(): Observable<unknown> {
		return this.getTranslations$(this.translationPath)
			.pipe(
				tap((translation: IRawTranslation) => {
					this.translationKeys = this.getTranslationKeysFromObj(translation);
				}),
			);
	}

	private getTranslationKeysFromObj(translation: IRawTranslation): TranslationKey[] {
		const result: TranslationKey[] = [];
		for (const key0 in translation) {
			if (typeof translation[key0] !== 'string') {
				this.getTranslationKeysFromObj(translation[key0] as IRawTranslation).forEach((key1: TranslationKey) => {
					result.push(new TranslationKey(`${key0}.${(key1.value)}`));
				});
			} else {
				result.push(new TranslationKey(key0));
			}
		}
		return result;
	}

	private getTranslations$(url: string): Observable<IRawTranslation> {
		return new Observable<IRawTranslation>((subscriber: Subscriber<IRawTranslation>) => {
			get(url, (incomingMessage: IncomingMessage) => {
				incomingMessage.setEncoding('utf8');
				const dataChunks: string[] = [];
				incomingMessage
					.on('data', (dataChunk: string) => {
						dataChunks.push(dataChunk);
					})
					.on('end', () => {
						const translation: IRawTranslation = JSON.parse(dataChunks.join(''));
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
