while getopts f:d:c: flag; do
  case "${flag}" in
  d) dir=${OPTARG} ;;
  f) i18n=${OPTARG} ;;
  c) cut=${OPTARG} ;;
  esac
done

echo "Find in directory: $dir"
echo "Path of i18n JSON file: $i18n"
echo "Cut keys (second iteration): $cut"

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]:-$0}")" &>/dev/null && pwd 2>/dev/null)"

node $SCRIPT_DIR/dist/index.js --findDir=$dir --i18nDir=$i18n --cutKeys=$cut
