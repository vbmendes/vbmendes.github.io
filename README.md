# site — página índice de vbmendes.dev

Substitui o `linktr.ee/vbmendes`: uma página só, estática, sem build e sem JavaScript.
Abrir `index.html` num servidor já é o site inteiro.

```sh
make dev              # sobe em http://localhost:8000 e abre o navegador
make dev PORT=3000    # noutra porta
make serve            # sem abrir o navegador
```

Os alvos ficam no `Makefile` da raiz; `make` sozinho lista todos. Por baixo é só
`python3 -m http.server` dentro desta pasta — nada além do que já vem no macOS.

Servidor é necessário porque os caminhos são absolutos (`/styles.css`, `/fonts/...`) —
abrir o arquivo direto pelo `file://` não carrega o CSS.

## Onde mexer

| o quê | onde |
|---|---|
| links, textos, ordem das palestras | `index.html` |
| cor, tipo, espaçamento | `styles.css`, no bloco `:root` |
| ícones das redes | `<defs>` no topo do `index.html` |
| foto de fundo | `.foto` no `styles.css`, arquivo em `photos/` |
| retrato do perfil | `.retrato` no `styles.css`, arquivo em `photos/` |
| imagem de compartilhamento | `tools/og-card.html` + `make og` |

Os ícones são um sprite SVG único no começo do HTML, referenciado por `<use>`. Para
adicionar uma rede, acrescente um `<symbol id="i-nome">` e um `<a>` em `.redes`.

## Identidade

Cor e tipo saem da skill `identidade-visual` — `references/cor.md` é a fonte de verdade,
e os tokens do `:root` são a transcrição direta dela. Petróleo é a voz padrão da página:
handle, kickers das palestras, foco, hover. Âmbar aparece **uma vez só**, no selo da
newsletter, que é o único item que não é palestra. Cada polo troca de degrau no tema
escuro, porque a mesma tinta não serve nos dois fundos.

A marca é o `logo/svg/marca-monocromatica.svg` embutido no HTML: usa `currentColor` e
acompanha o tema sozinha.

## A foto de fundo

Entra pela direita, atravessa por baixo dos cartões e some antes de chegar no texto. São
duas máscaras que se cruzam: uma apaga para a esquerda, outra apaga em cima e embaixo, para
não brigar com o cabeçalho nem com o rodapé. Os cartões são opacos — é por isso que a foto
parece passar por baixo deles em vez de sobre.

Vale em qualquer largura: no celular ela vira uma faixa estreita na borda direita, quase
toda coberta pelos cartões. A opacidade é .5 nos dois temas.

O texto continua legível porque quase todo ele mora em cartão opaco. O que fica direto no
fundo — nome, bio, rótulos das seções, rodapé — está na coluna central, onde a máscara
horizontal já apagou a foto. Mexer na máscara é o que arrisca essa conta, mais do que mexer
na opacidade. Quem pede mais contraste ao sistema não vê a foto.

O arquivo em `photos/` é uma redução para 1600px do original em `../photos/`. Se trocar a
foto, reduza também: o original tem 3707px e 4MB, que é peso demais para um enfeite.

Está em `background-image`, não em `<img>`, e vale manter assim se um dia voltar a existir
uma faixa de largura em que ela não aparece: `<img>` baixa o arquivo mesmo sob
`display:none`, `background-image` não.

## O retrato

Fica entre o `@vbmendes` e a bio — abaixo do nome, sem separar o nome do handle, que leem
como uma coisa só. É círculo para ecoar o arco da marca; para retângulo arredondado, mexa
só no `border-radius` de `.retrato`.

O arquivo em `photos/` é o original de 1611px reduzido para 480, que cobre os 208px de
exibição em tela retina. Se aumentar o `width` de `.retrato`, regere o arquivo junto: a
regra é servir o dobro do tamanho de exibição.

## Favicon

`favicon.svg` e `favicon.ico` são a marca em petróleo com contorno em papel, sobre fundo
transparente — a fonte é `logo/svg/icone-favicon-contorno.svg`.

O contorno é o que faz a marca sobreviver em aba escura, onde `#00636B` sozinho quase
some. Está em 15 (3 unidades de cada lado): 13 deixa mais discreto, e de 17 para cima o
halo fecha os vazios internos a 16px e a marca vira mancha. Mudar é trocar um número no
SVG e regerar o `.ico`.

O `.ico` carrega 16, 32, 48 e 64 px. Em tela retina a aba usa o raster de 32, que é onde o
contorno aparece melhor.

O `apple-touch-icon-180.png` fica fora dessa regra e continua com fundo: o iOS achata
transparência em preto. Os ícones do manifesto (192 e 512) também seguem como estavam.

Para regerar os rasters a partir do SVG:

```sh
make serve                                    # o Chrome precisa buscar por http
chrome --headless=new --default-background-color=00000000 \
  --screenshot=fav.png --window-size=512,512 file://.../cartao-do-favicon.html
uv run --with pillow python -c "from PIL import Image; \
  Image.open('fav.png').convert('RGBA').save('site/favicon.ico', \
  sizes=[(16,16),(32,32),(48,48),(64,64)])"
```

## Tema claro e escuro

Segue o sistema operacional, via `prefers-color-scheme`. Não há botão de troca — seria o
único JavaScript da página.

## Fontes

`fonts/` tem cópias de Poppins e JetBrains Mono em `.ttf`, porque o site precisa servir os
arquivos. Convertê-las para `woff2` corta algo em torno de 60% do peso e é a otimização
mais óbvia se a página começar a pesar.

## Publicar

São arquivos estáticos: qualquer host serve (GitHub Pages, Cloudflare Pages, Netlify).
Apontar o serviço para esta pasta basta — não há passo de build.

Antes de publicar, confira o `og.png` e as URLs absolutas nas metatags do `index.html`:
estão fixas em `https://vbmendes.dev/`.
