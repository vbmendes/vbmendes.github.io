#!/bin/sh
# Regera site/og.png — a imagem que aparece quando o link é compartilhado.
#
# O cartão é uma página (tools/og-card.html) fotografada a 1200x630, que é o
# formato que as redes esperam. Renderizar em vez de desenhar à mão significa
# que a imagem herda a fonte, a cor e a marca do próprio site: mexer no
# styles.css e rodar isto de novo mantém as duas coisas iguais.
#
# O cartão é copiado para a raiz só durante a renderização, porque precisa de um
# servidor para carregar as fontes sem esbarrar em CORS. Sai de lá no fim, e por
# isso não fica publicado junto com o site.

set -eu

RAIZ=$(cd "$(dirname "$0")/.." && pwd)
PORTA=${PORTA:-8123}
CHROME=${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}
TEMP="$RAIZ/_og-card.html"
SAIDA="$RAIZ/og.png"

if [ ! -x "$CHROME" ]; then
  echo "erro: Chrome não encontrado em '$CHROME'." >&2
  echo "      aponte outro com: CHROME=/caminho/para/chrome make og" >&2
  exit 1
fi

limpar() {
  [ -n "${SERVIDOR:-}" ] && kill "$SERVIDOR" 2>/dev/null || true
  rm -f "$TEMP"
}
trap limpar EXIT INT TERM

cp "$RAIZ/tools/og-card.html" "$TEMP"

(cd "$RAIZ" && exec python3 -m http.server "$PORTA" --bind 127.0.0.1) >/dev/null 2>&1 &
SERVIDOR=$!
sleep 1

"$CHROME" --headless=new --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=1 \
  --screenshot="$SAIDA" --window-size=1200,630 \
  "http://localhost:$PORTA/_og-card.html" >/dev/null 2>&1

echo "og.png regerado: $SAIDA"
