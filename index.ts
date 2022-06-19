import {Program} from './src/program.class';

enum PropsEnum {
	I18nPath = '--i18nDir=',
	FindInDir = '--findDir=',
	CutKeys = '--cutKeys=',
	ReplacePlural = '--replacePlural=',
	ReverseSearch = '--reverseSearch=',
}

const CONSOLE_PROPS: string[] = process.argv;
const translationUrl: string | undefined = getProp(PropsEnum.I18nPath);
const whereToFindDir: string | undefined = getProp(PropsEnum.FindInDir);
const cutKeys: boolean = getProp(PropsEnum.CutKeys) === 'true' || false;
const replacePlural: boolean = getProp(PropsEnum.ReplacePlural) === 'true' || false;
const reverseSearch: string | undefined = getProp(PropsEnum.ReverseSearch);

// check required params
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

const program: Program = new Program({
	fileNameRegexp: /^.*\.ts$|^.*\.html$/,
	chunkSize: 20, // if U have problem => read README.md
	translationPath: translationUrl,
	whereToFindDir: whereToFindDir,
	cutKeys: cutKeys,
	replacePlural: replacePlural,
});

if (reverseSearch === 'only') {
	program.reverseSearch();
} else {
	program.directSearch(reverseSearch === 'true');
}






