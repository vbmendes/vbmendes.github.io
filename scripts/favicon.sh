#!/bin/sh
# Regera favicon.ico a partir de favicon.svg.
#
# O .ico existe para navegador antigo e para o Windows; quem entende SVG usa o
# favicon.svg direto. Ele carrega 16, 32, 48 e 64 px — em tela retina a aba usa
# o raster de 32.
#
# São dois passos porque nenhuma ferramenta do sistema faz os dois: o Chrome
# rasteriza o SVG preservando transparência (--default-background-color=00000000),
# e o pillow empacota os quatro tamanhos num .ico. O pillow vem por uv, sem
# instalar nada de forma permanente.

set -eu

RAIZ=$(cd "$(dirname "$0")/.." && pwd)
PORTA=${PORTA:-8124}
CHROME=${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}
TEMP="$RAIZ/_favicon-card.html"
PNG=$(mktemp -t favicon).png
SAIDA="$RAIZ/favicon.ico"

if [ ! -x "$CHROME" ]; then
  echo "erro: Chrome não encontrado em '$CHROME'." >&2
  echo "      aponte outro com: CHROME=/caminho/para/chrome make favicon" >&2
  exit 1
fi

if ! command -v uv >/dev/null 2>&1; then
  echo "erro: uv não encontrado — é ele que traz o pillow." >&2
  echo "      instale em https://docs.astral.sh/uv/ ou gere o .ico à mão." >&2
  exit 1
fi

limpar() {
  [ -n "${SERVIDOR:-}" ] && kill "$SERVIDOR" 2>/dev/null || true
  rm -f "$TEMP" "$PNG"
}
trap limpar EXIT INT TERM

cp "$RAIZ/tools/favicon-card.html" "$TEMP"

(cd "$RAIZ" && exec python3 -m http.server "$PORTA" --bind 127.0.0.1) >/dev/null 2>&1 &
SERVIDOR=$!
sleep 1

"$CHROME" --headless=new --disable-gpu --hide-scrollbars \
  --default-background-color=00000000 --force-device-scale-factor=1 \
  --screenshot="$PNG" --window-size=512,512 \
  "http://localhost:$PORTA/_favicon-card.html" >/dev/null 2>&1

uv run --quiet --with pillow python - "$PNG" "$SAIDA" <<'PY'
import sys
from PIL import Image
origem, destino = sys.argv[1], sys.argv[2]
Image.open(origem).convert("RGBA").save(
    destino, format="ICO", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
PY

echo "favicon.ico regerado: $SAIDA"
