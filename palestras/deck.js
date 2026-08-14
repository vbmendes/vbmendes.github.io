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
    // Com o índice aberto, ou com o foco dentro da moldura, esconder tira da
    // frente justamente o que a pessoa está usando.
    if (indice && indice.hasAttribute('open')) return true;
    var foco = document.activeElement;
    return !!(foco && foco.closest && foco.closest('.voltar, .tela-cheia, .indice, .reveal .controls'));
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

  if (botao) {
    botao.addEventListener('click', function () {
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

    // Safari em iOS não tem Fullscreen API em elemento: sem isso o botão
    // ficaria ali sem fazer nada.
    if (!(document.documentElement.requestFullscreen ||
          document.documentElement.webkitRequestFullscreen)) {
      botao.hidden = true;
    }
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
