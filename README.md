# site — página índice de vbmendes.dev

Substitui o `linktr.ee/vbmendes`: uma página só, estática, sem build e sem JavaScript.
Abrir `index.html` num servidor já é o site inteiro.

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
único JavaScript da página.

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

- `CNAME` fixa o domínio em `www.vbmendes.dev`. Ele precisa continuar existindo — sem o
  arquivo, o domínio se perde na próxima publicação.
- `vbmendes.dev` (sem `www`) redireciona para `www`. Quem faz isso é o próprio Pages,
  desde que o apex tenha os registros A apontando para ele.
- `.nojekyll` desliga o Jekyll. Sem ele o Pages tenta processar a pasta e ignora arquivos
  começados por `_`.

`Makefile`, `scripts/` e `tools/` também ficam publicados, já que o Pages serve a raiz
inteira. São inofensivos e ninguém os referencia — o preço de não ter etapa de build.

As metatags de compartilhamento no `index.html` carregam URLs absolutas fixas em
`https://www.vbmendes.dev/`. Trocar de domínio é trocá-las junto, e o `CNAME`.
