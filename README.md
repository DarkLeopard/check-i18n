[![npm](https://img.shields.io/npm/v/check-i18n)](https://www.npmjs.com/package/check-i18n)

# Check translations script

Script get translations by http/http/local path and compare
with local directory. Script has reverse mode (see in Documentation).

Attantion! Deep translation chain keys give better result.

Check include:
* static translations like `"obj.key.key1..."`
* dynamic translations (`"obj.key." + value`)
  * translations with number at end will be cut automatically (deep = 2)
  * use command with `--cutkeys=true` to cut translations (tail) and add dot to end for unfounded keys at first iteration (number at end will be cut automatically; deep = 1)
* use command with `--replaceplural=true` to use special replace function for plural translations (discription in Documentation)

Optimised for Unix and Windows.

## How to use

* `-f` or `--i18ndir` - string - path to lang JSON files (http/https or local)
* `-d` or `--finddir` - string - where to find directory
* `--cutkeys` - boolean - repeat search for cut translations
* `--replaceplural` - boolean - replace plural keys (see below)
* `--reversesearch` - `only` or boolean:
  * `only` - start only reverse searching (see in Documentation)
  * boolean - start reverse search at end of main script

Use `check-i18n -d=[value] -f=[value]`.

Example: `check-i18n -d=./libs -f=https://site.ru/api/v1/translations`

At the end of process file with results will be in folder.
File name will have timestamp attributes.

## Documentation

### Reverse search

Command will search keys in code and compare with translation JSON.

Command can be used alone (without direct searching).

Check cases ([ngx-translate](https://github.com/ngx-translate/core)):
* pipe (`key | translate`)
* method `.instant(key)`
* method `.stream(key)`

Cases inqlude:
* dynamic translations (with dot at end in code; like `key.`; deep for JSON = 1)
* plural translations (if use `--replaceplural` command)

### Replace plural translations command

Special function for depricated case in some projects.

Don't add this approach to writing code to your project.

It's not best practice!

Special function what replace keys values from lang JSON file
with ending `/(_one|_many|_other)$/` to `%ending%` before find key
in directory.

## Known issues

### Progress was stopped at chunk
Problem was founded with [CLI-Progress](https://www.npmjs.com/package/cli-progress#options-1). 
Process was stopped at 358 chunk (chunkSize was 5).
When I changed chunkSize to 20, problem was resolved.

Case with not rendered cliProgress wasn't checked.
Maybe it was max size for chunks or unfixed render problem.

## Feedback

If you have troubles You can use GitHub issues.

---

Licence - Apache-2.0

2020 Barabanov Sergey Konstantinovich 
