/* ============================================================
   vbmendes.dev — comportamento da moldura das páginas de palestra
   Arquivo gerado: sai junto com os slides, do mesmo lugar que os
   produz. Editar aqui não adianta — a próxima publicação de uma
   palestra sobrescreve.

   O reveal.js cuida da navegação. Aqui só existe o que ele não
   traz: sumir com a moldura quando o mouse para, e o botão de
   tela cheia (o reveal tem o atalho F, mas nenhum botão).
   ============================================================ */

(function () {
  'use strict';

  var OCIOSO = 3000;   // igual ao hideCursorTime, para cursor e moldura sumirem juntos
  var raiz = document.documentElement;
  var indice = document.querySelector('.indice');
  var relogio;

  /* --- sumir com a moldura ---------------------------------------------
     Só onde existe ponteiro. No toque não há `mousemove` para trazer a
     moldura de volta: ela sumiria aos 3s e não voltaria mais. */
  var temPonteiro = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  function segurando() {
    // Com o índice aberto, esconder tira da frente o que está sendo usado.
    if (indice && indice.hasAttribute('open')) return true;

    // Só foco de teclado segura a moldura — daí `:focus-visible` e não
    // `:focus`. O foco que sobra de um clique não é alguém navegando pelos
    // botões, é o botão que acabou de ser usado: ele fica focado e, com
    // `:focus`, a moldura nunca mais sumiria. Era o que acontecia ao entrar em
    // tela cheia, que só se faz clicando.
    return !!document.querySelector(
      '.voltar:focus-visible, .tela-cheia:focus-visible, ' +
      '.indice summary:focus-visible, .indice a:focus-visible, ' +
      '.reveal .controls button:focus-visible'
    );
  }

  function esconde() {
    if (segurando()) return acorda();
    raiz.classList.add('sem-moldura');
  }

  function acorda() {
    raiz.classList.remove('sem-moldura');
    clearTimeout(relogio);
    if (temPonteiro) relogio = setTimeout(esconde, OCIOSO);
  }

  if (temPonteiro) {
    // Só eventos de ponteiro: quem navega pelo teclado pediu para a moldura
    // sair da frente, e trazê-la de volta a cada seta seria o oposto disso.
    ['mousemove', 'mousedown', 'wheel'].forEach(function (evento) {
      document.addEventListener(evento, acorda, { passive: true });
    });
    document.addEventListener('focusin', acorda);
    acorda();
  }

  /* --- tela cheia -------------------------------------------------------
     O reveal só sabe entrar (o hook .enter-fullscreen não tem volta), então
     o botão é nosso. O alvo é o mesmo que ele usa — é o elemento que o
     .reveal-viewport:fullscreen do reveal.css espera encontrar. */
  var botao = document.querySelector('.tela-cheia');

  function alvo() {
    var vp = window.Reveal && Reveal.getViewportElement && Reveal.getViewportElement();
    return (vp && vp.parentElement) || document.documentElement;
  }

  /* No iPhone não há Fullscreen API de elemento em navegador nenhum — nem no
     Safari. Corre por fora que o iOS 17.4 teria resolvido; aquilo era beta e
     iPad, e no iPhone o WebKit 212934 continua aberto. Testado no aparelho:
     `requestFullscreen` e `webkitRequestFullscreen` são ambos indefinidos.

     Ainda assim quem decide é a detecção, e não o sistema: o mesmo código roda
     no desktop e no Android, onde a API existe, e um dia o iPhone entra nessa
     lista sem ninguém precisar mexer aqui. */
  var temAPI = !!(document.documentElement.requestFullscreen ||
                  document.documentElement.webkitRequestFullscreen);

  /* A dica de como chegar perto da tela cheia num iPhone.

     Nenhum navegador do iPhone faz fullscreen de elemento — nem o Safari, ao
     contrário do que a documentação de fora sugere. O que sobra são duas
     coisas, e nenhuma delas é descobrível sozinha:

     1. arrastar para cima, e o navegador recolhe a própria barra. É o que o
        modo imersivo destravou, mas depende de um gesto que ninguém adivinha
        estar disponível numa página que até agora não rolava;
     2. instalar na tela de início, onde não sobra barra nenhuma.

     A dica fala do gesto sempre, e da instalação só onde ela é possível: o
     Chrome do iPhone não instala nada, e mandar a pessoa trocar de navegador
     no meio de uma apresentação é pedir mais do que a dica vale.

     Aparece depois do toque no botão, nunca antes: só aí a pessoa demonstrou
     querer tela cheia. */
  var ehIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  var podeInstalar = ehIOS && !/CriOS|FxiOS|EdgiOS/.test(navigator.userAgent);
  var dica;

  function mostraDica() {
    if (dica || !ehIOS) return;

    dica = document.createElement('div');
    dica.className = 'dica';

    var gesto = document.createElement('span');
    gesto.className = 'dica-linha';
    gesto.textContent = 'Arraste para cima para esconder a barra';
    dica.appendChild(gesto);

    if (podeInstalar) {
      var instalar = document.createElement('span');
      instalar.className = 'dica-linha dica-instalar';
      instalar.textContent = 'Sem barra nenhuma: Compartilhar → Tela de Início';
      dica.appendChild(instalar);
    }

    document.body.appendChild(dica);
    // Sai sozinha: é uma dica oferecida, não um banner para conviver com o
    // slide. Quem quiser de novo toca no botão de novo.
    setTimeout(function () {
      if (!dica) return;
      dica.remove();
      dica = null;
    }, 7000);
  }

  /* --- modo imersivo ----------------------------------------------------
     Onde não há Fullscreen API, o botão faz duas coisas: some com a nossa
     moldura e destrava a rolagem, que é o que faz o navegador recolher a
     barra dele. O CSS cuida do `touch-action` e do `overflow`; aqui só entra
     o espaçador, porque ele é curso de rolagem e não conteúdo — não teria
     sentido estar no HTML publicado.

     O `scrollTo(0, 1)` tira a página do topo já de saída: o iOS só começa a
     recolher a barra depois do primeiro pixel rolado, e sair do zero sozinho
     deixa o primeiro arrasto valer inteiro. */
  var respiro;

  function entraImersivo() {
    if (respiro) return;
    respiro = document.createElement('div');
    respiro.className = 'respiro';
    respiro.setAttribute('aria-hidden', 'true');
    document.body.appendChild(respiro);
    window.scrollTo(0, 1);
  }

  function saiImersivo() {
    if (!respiro) return;
    respiro.remove();
    respiro = null;
    window.scrollTo(0, 0);
  }

  if (botao) {
    botao.addEventListener('click', function () {
      // Sem API, o botão faz o máximo que a página controla: recolhe a moldura
      // do navegador junto com a nossa, e aponta o caminho para onde a tela
      // cheia existe de fato.
      if (!temAPI) {
        var imersivo = raiz.classList.toggle('imersivo');
        raiz.classList.toggle('em-tela-cheia', imersivo);
        botao.setAttribute('aria-pressed', imersivo ? 'true' : 'false');
        botao.setAttribute('title', imersivo ? 'Mostrar a moldura' : 'Esconder a moldura');
        if (imersivo) { entraImersivo(); mostraDica(); } else { saiImersivo(); }
        return;
      }
      if (document.fullscreenElement || document.webkitFullscreenElement) {
        (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      } else {
        var e = alvo();
        (e.requestFullscreen || e.webkitRequestFullscreen).call(e);
      }
    });

    // O estado também muda por Esc e pelo atalho F do reveal, então o rótulo
    // acompanha o evento, nunca o clique.
    ['fullscreenchange', 'webkitfullscreenchange'].forEach(function (evento) {
      document.addEventListener(evento, function () {
        var cheia = !!(document.fullscreenElement || document.webkitFullscreenElement);
        raiz.classList.toggle('em-tela-cheia', cheia);
        botao.setAttribute('aria-pressed', cheia ? 'true' : 'false');
        botao.setAttribute('title', cheia ? 'Sair da tela cheia (Esc)' : 'Tela cheia (F)');
      });
    });

    if (!temAPI) botao.setAttribute('title', 'Esconder a moldura');
  }

  /* --- índice ----------------------------------------------------------- */
  if (indice) {
    indice.querySelectorAll('a').forEach(function (a) {
      // Navegou: o painel sai da frente do slide que a pessoa acabou de pedir.
      a.addEventListener('click', function () { indice.removeAttribute('open'); });
    });
    // Fechar ao clicar fora, senão ele fica aberto por cima da apresentação.
    document.addEventListener('click', function (ev) {
      if (indice.hasAttribute('open') && !indice.contains(ev.target)) {
        indice.removeAttribute('open');
      }
    });
    indice.addEventListener('toggle', acorda);
  }
})();
