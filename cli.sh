for i in "$@"; do
  case $i in
    -f=*|--i18ndir=*)
      I18NDIR="${i#*=}"
      shift # past argument=value
      ;;
    -d=*|--finddir=*)
      FINDDIR="${i#*=}"
      shift # past argument=value
      ;;
    --cutkeys=*)
      CUTKEYS="${i#*=}"
      shift # past argument=value
      ;;
    --replaceplural=*)
          REPLACEPLURAL="${i#*=}"
          shift # past argument=value
          ;;
    --reversesearch=*)
          REVERSESEARCH="${i#*=}"
          shift # past argument=value
          ;;
    --default)
      DEFAULT=YES
      shift # past argument with no value
      ;;
    -*|--*)
      echo "Unknown option $i"
      exit 1
      ;;
    *)
      ;;
  esac
done

echo "Find in directory: $FINDDIR"
echo "Path of i18n JSON file: $I18NDIR"
echo "Cut keys (second iteration): $CUTKEYS"
echo "Use plural matcher: $REPLACEPLURAL"
echo "Reverse search keys: $REVERSESEARCH"

if [[ -n $1 ]]; then
    echo "Last line of file specified as non-opt/last argument:"
    tail -1 "$1"
fi

SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]:-$0}"; )" &> /dev/null && pwd 2> /dev/null; )";

node $SCRIPT_DIR/dist/index.js --findDir=$FINDDIR --i18nDir=$I18NDIR --cutKeys=$CUTKEYS --replacePlural=$REPLACEPLURAL --reverseSearch=$REVERSESEARCH

