/* =========================================================
   animacoes.js — só o que as animações precisam de JavaScript.
   O "como se mexe" (tempo, distância, curva) está no fim do
   css/style.css, na seção 6. Aqui só dizemos "quando".
   ========================================================= */

// Respeita quem configurou o sistema para reduzir movimento
const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!semMovimento) {

  /* ---------- 1. Revelar ao rolar a página ---------- */
  // Elementos que aparecem conforme entram na tela
  const alvos = document.querySelectorAll(
    '.cabecalho-secao, #destaques .cartao, .faixa-escura h2, .faixa-escura .subtitulo, .bairro, ' +
    '.secao > h2, .passo, .cta, .rodape-colunas > *, .barra-filtros, .mapa, ' +
    '.ficha > div, .imovel-principal > section, .contato'
  );

  if ('IntersectionObserver' in window) {
    const observador = new IntersectionObserver((entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add('visivel');
        observador.unobserve(entrada.target); // anima uma vez só
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    alvos.forEach((alvo) => {
      // Irmãos entram em sequência: o 2º espera um pouco mais que o 1º, e assim por diante
      const posicao = Array.from(alvo.parentElement.children).indexOf(alvo);
      alvo.style.transitionDelay = Math.min(posicao, 4) * 90 + 'ms';
      alvo.classList.add('revelar');
      observador.observe(alvo);
      // Depois de aparecer, limpa tudo para o "hover" do elemento voltar ao normal
      alvo.addEventListener('transitionend', () => {
        if (!alvo.classList.contains('visivel')) return;
        alvo.style.transitionDelay = '';
        alvo.classList.remove('revelar', 'visivel');
      });
    });
  }

  /* ---------- 2. Desenhos que se traçam sozinhos ---------- */
  document.querySelectorAll('.hero-foto .arte, .galeria-principal .arte').forEach((desenho) => {
    Array.from(desenho.children).forEach((traco, indice) => {
      traco.setAttribute('pathLength', '1'); // faz todo traço "medir" 1, não importa o tamanho
      traco.style.animationDelay = 0.4 + indice * 0.12 + 's';
    });
    desenho.classList.add('desenhar');
  });

  /* ---------- 3. Coração que pula ao favoritar ---------- */
  document.addEventListener('click', (evento) => {
    const botao = evento.target.closest('.favorito');
    if (!botao) return;
    botao.classList.remove('pulsar');
    void botao.offsetWidth; // força o navegador a reiniciar a animação
    botao.classList.add('pulsar');
  });
}
