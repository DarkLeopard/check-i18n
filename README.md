# Check translations script

Script get translations by URL and compare (one way) with local directory.

Check include:
* dynamic translations
  * translations with number at end will be cut automatically (deep = 2)
  * use command (`-c`) to cut translations (tail) and add dot to end for unfounded keys at first iteration
    * number at end will be cut automatically (deep = 1)

Optimised for Unix and Windows.

## How to use

* `-f link_string` - path to lang JSON files
* `-d path_string` - where to find directory
* `-c boolean` - research cut translations

Use `check-i18n -d [value] -f [value] -c [value]`.

Example: `check-i18n -d ./libs -f https://site.ru/api/v1/translations -c true`

At the end of process file with results will be in folder.
File name will have timestamp attributes.

## Known issues

### Progress was stopped at chunk
Problem was founded with [CLI-Progress](https://www.npmjs.com/package/cli-progress#options-1). 
Process was stopped at 358 chunk (chunkSize was 5).
When I changed chunkSize to 20, problem was resolved.

Case with not rendered cliProgress wasn't checked.
Maybe it was max size for chunks or unfixed render problem.

## Feedback

If you have troubles You can contact me at`darkleopard3@ya.ru`.

---

Licence - Apache-2.0

2020 Barabanov Sergey Konstantinovich 
