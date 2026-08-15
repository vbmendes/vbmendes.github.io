# site — página índice de vbmendes.dev

Substitui o `linktr.ee/vbmendes`: estático, sem build, sem package manager. A página
índice — `index.html` — não tem uma linha de JavaScript. As páginas de palestra em
`palestras/` são a exceção e rodam reveal.js; ver [Palestras](#palestras).

```sh
make dev              # sobe em http://localhost:8000 e abre o navegador
make dev PORT=3000    # noutra porta
make serve            # sem abrir o navegador
```

`make` sozinho lista todos os alvos. Por baixo é só `python3 -m http.server` nesta pasta —
nada além do que já vem no macOS.

Servidor é necessário porque os caminhos são absolutos (`/styles.css`, `/fonts/...`) —
abrir o arquivo direto pelo `file://` não carrega o CSS.

## Onde mexer

| o quê | onde |
|---|---|
| links, textos, ordem das palestras | `index.html` |
| slides de uma palestra | nada aqui — é saída gerada, ver [Palestras](#palestras) |
| cor, tipo, espaçamento | `styles.css`, no bloco `:root` |
| ícones das redes | `<defs>` no topo do `index.html` |
| foto de fundo | `.foto` no `styles.css`, arquivo em `photos/` |
| retrato do perfil | `.retrato` no `styles.css`, arquivo em `photos/` |
| imagem de compartilhamento | `tools/og-card.html` + `make og` |
| favicon | `favicon.svg`, e `make favicon` para o `.ico` |

Os ícones são um sprite SVG único no começo do HTML, referenciado por `<use>`. Para
adicionar uma rede, acrescente um `<symbol id="i-nome">` e um `<a>` em `.redes`.

## Identidade

A paleta tem dois polos, cada um com um degrau para fundo claro e outro para fundo escuro.
Trocar o degrau errado quebra o contraste, então eles andam junto com o tema:

| papel | fundo claro | fundo escuro |
|---|---|---|
| Petróleo | `#00636B` | `#3BBFB2` |
| Âmbar | `#A56A00` | `#F0A93A` |

Neutros: tinta `#101418`, papel `#FAF9F7`. Os tokens do `:root` são exatamente isso.

A divisão é semântica. Petróleo é a voz padrão da página — handle, kickers das palestras,
foco, hover. Âmbar é o contraponto e aparece **uma vez só**, no selo da newsletter, que é o
único item que não é palestra. Cor é sinalização, nunca corpo de texto: o texto é tinta ou
papel.

A marca está embutida como SVG no próprio `index.html`, desenhada com `currentColor` para
acompanhar o tema sozinha.

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

O arquivo em `photos/` é uma redução para 1600px — o original de 3707px pesa 4MB, demais
para um enfeite. Ao trocar a foto, reduza junto:

```sh
sips -s format jpeg -s formatOptions 68 --resampleWidth 1600 \
  original.jpg --out photos/nome.jpg
```

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

`favicon.svg` é a fonte: a marca em petróleo com contorno em papel, sobre fundo
transparente. O `.ico` sai dele.

O contorno é o que faz a marca sobreviver em aba escura, onde `#00636B` sozinho quase
some. Está em 15 (3 unidades de cada lado): 13 deixa mais discreto, e de 17 para cima o
halo fecha os vazios internos a 16px e a marca vira mancha. Mudar é trocar esse número no
SVG e rodar `make favicon`.

O `.ico` carrega 16, 32, 48 e 64 px. Em tela retina a aba usa o raster de 32, que é onde o
contorno aparece melhor.

O `apple-touch-icon-180.png` fica fora dessa regra e continua com fundo: o iOS achata
transparência em preto. Os ícones do manifesto (192 e 512) também seguem como estavam.

`make favicon` regera o `.ico`. São dois passos porque nenhuma ferramenta do sistema faz os
dois: o Chrome rasteriza o SVG preservando transparência, e o pillow — trazido pelo `uv`,
sem instalar nada de forma permanente — empacota os quatro tamanhos.

## Tema claro e escuro

Segue o sistema operacional, via `prefers-color-scheme`. Não há botão de troca — seria o
único JavaScript da página índice, e ela continua sem nenhum.

Nas páginas de palestra o esquema vale só para a moldura — botões, índice, letterbox. Os
slides são imagem: o tema deles foi decidido na hora de gerar e não muda com o do sistema.

## Palestras

Cada palestra é uma pasta em `palestras/<evento>-<ano>/`. É o único lugar do site com
subpágina, e o único com JavaScript.

**Os slides são HTML, não imagem.** Cada um é uma caixa de 1920x1080 com texto de
verdade — selecionável, buscável, legível por leitor de tela — que o reveal.js escala
para a janela. As imagens que aparecem neles são só a arte.

```
palestras/
├── deck.css                    a moldura, compartilhada por todas
├── deck.js                     idem — sumiço da moldura e tela cheia
├── camadas.css                 declara a ordem da cascata e importa as folhas
├── cola.css                    impede o reveal de mandar no que é do slide
├── tokens.css                  cor, tipo e layout do slide
├── vendor/reveal-6.0.1/        reveal.js, reveal.css, reset.css, LICENSE
└── rogadx-2026/
    ├── index.html
    ├── og.jpg
    ├── rogadx-2026.pdf          o deck inteiro, oferecido pelo chip "PDF"
    └── assets/                  a arte usada nos slides, em WebP
```

**A ordem da cascata é `camadas.css`, e não é decoração.** `reveal`, depois `cola`,
depois `slide`. Sem camada as regras empatam em especificidade — `.reveal .slide img` e
`.arte img` são ambas (0,2,1) — e quem carrega por último ganha, o que já fez a arte
sair sangrando sem recuo nem borda. O `deck.css` fica fora de camada de propósito: a
moldura é do site, não do slide, e as duas não disputam seletor.

O PDF é a maior coisa do repositório — 18 MB, uma imagem sem perda por página. Ele
existe porque a página o oferece por link, e sai na mesma passada dos slides para que
download e tela nunca discordem. O chip mostra o peso no rótulo. Já a arte dos slides
cabe em 2,3 MB: cada imagem é servida uma vez, mesmo aparecendo em cinco slides.

**Tudo aqui é gerado.** `index.html`, as folhas de estilo e o `assets/` saem de uma
ferramenta fora deste repositório, a partir do roteiro da palestra, e são escritos direto
aqui — esta pasta é o único lugar onde eles existem. Editar qualquer um deles à mão
funciona até a próxima publicação, que sobrescreve. O que se edita aqui é o card em
`index.html` da raiz, que aponta para a rota.

Republicar uma palestra reescreve `assets/` inteiro, para que uma imagem tirada do
roteiro não fique órfã sendo servida. O resto da pasta é preservado.

**A moldura sai de cena sozinha.** Três segundos de mouse parado e some tudo que não é
slide — o link de volta, o índice, o botão de tela cheia, as setas, a barra de progresso e
a numeração. O primeiro movimento do mouse traz de volta. O cursor acompanha, via o
`hideInactiveCursor` do próprio reveal. Só vale onde existe ponteiro: no toque não há
`mousemove` para desfazer, então lá a moldura fica.

**Tela cheia** tem botão no canto e o atalho `F`, que é do reveal. `Esc` sai — dos dois.

**reveal.js entra versionado à mão**, porque o site não tem package manager. São três
arquivos de `reveal.js@6.0.1`, 184 KB no total: `reveal.js` (build UMD, roda em
`<script src>` sem bundler), `reveal.css` e `reset.css`. Nenhum plugin e nenhum tema — o
slide traz o próprio CSS, e a moldura é o `deck.css`. A versão está no nome da pasta de
propósito: atualizar é criar a pasta da versão nova e apontar o gerador para ela, nunca
sobrescrever por baixo de uma página no ar.

A licença é MIT e pede o aviso de copyright junto com o código redistribuído — mesma regra
das fontes. Por isso `vendor/reveal-6.0.1/LICENSE` existe e não pode sair dali.

A arte não carrega de uma vez: cada `<img>` do slide leva `loading="lazy"`, e fora do
slide corrente o reveal deixa tudo em `display:none`, que é o que faz o navegador segurar
o download até a hora. As fontes vêm de `/fonts`, servidas para o site inteiro — as
páginas de palestra não guardam cópia.

## Fontes

`fonts/` tem cópias de Poppins e JetBrains Mono em `.ttf`, porque o site precisa servir os
arquivos. Convertê-las para `woff2` corta algo em torno de 60% do peso e é a otimização
mais óbvia se a página começar a pesar.

As duas são licenciadas em SIL Open Font License 1.1 — uso comercial liberado, self-hosting
liberado. A licença pede uma coisa em troca: **toda cópia redistribuída carrega o texto da
licença e o aviso de copyright**. Publicar os `.ttf` neste repositório e servi-los por HTTP
é redistribuir, então `OFL-Poppins.txt` e `OFL-JetBrainsMono.txt` vivem ao lado dos
binários e não podem sair dali.

| fonte | copyright | licença |
|---|---|---|
| Poppins | 2020 The Poppins Project Authors | `fonts/OFL-Poppins.txt` |
| JetBrains Mono | 2020 The JetBrains Mono Project Authors | `fonts/OFL-JetBrainsMono.txt` |

Se um dia as fontes virarem `woff2`, ou se entrar uma família nova, o arquivo de licença
correspondente vem junto — e o aviso de copyright tem que bater com o build que está sendo
servido, não com o de outra versão da mesma fonte.

Texto convertido em curvas dentro de um SVG não entra nessa regra: contorno de glifo é
parte do documento, não é distribuir a fonte.

## Publicar

O GitHub Pages serve a raiz deste repositório na branch `main`. Não há workflow nem passo
de build: o que está aqui é o que vai para o ar, e um `git push` publica.

- `CNAME` fixa o domínio no apex, `vbmendes.dev`. Ele precisa continuar existindo — sem o
  arquivo, o domínio se perde na próxima publicação.
- `www.vbmendes.dev` redireciona para o apex. Quem faz isso é o próprio Pages, desde que o
  `www` tenha o CNAME apontando para `vbmendes.github.io`.
- **Pendência:** as URLs absolutas do HTML (canonical, `og:url`, `og:image`) ainda dizem
  `https://www.vbmendes.dev/`, que é o lado que redireciona. Funciona, mas cada
  compartilhamento passa por um 301 e o canonical aponta para uma URL que não é a final.
  Alinhar as duas coisas é trocar `www.vbmendes.dev` por `vbmendes.dev` no `index.html`,
  no `tools/og-card.html` e no gerador das páginas de palestra.
- `.nojekyll` desliga o Jekyll. Sem ele o Pages tenta processar a pasta e ignora arquivos
  começados por `_`.

`Makefile`, `scripts/` e `tools/` também ficam publicados, já que o Pages serve a raiz
inteira. São inofensivos e ninguém os referencia — o preço de não ter etapa de build.

As metatags de compartilhamento no `index.html` carregam URLs absolutas fixas em
`https://www.vbmendes.dev/`. Trocar de domínio é trocá-las junto, e o `CNAME`.
