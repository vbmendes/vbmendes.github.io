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
