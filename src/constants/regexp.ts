export const QUOTES_REGEXP_STR: string = '(\'|\"|\`)';
export const PLURAL_CODE_REGEXP_STR: string = '_%ending%';
export const PLURAL_ENDINGS: string[] = ['_one', '_many', '_other'];
export const PLURAL_TRANSLATION_REGEXP: RegExp = new RegExp(`(${PLURAL_ENDINGS[0]}|${PLURAL_ENDINGS[1]}|${PLURAL_ENDINGS[2]})$`)
