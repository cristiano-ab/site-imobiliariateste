/* =========================================================
   site.js — o comportamento das páginas.
   Cada bloco só roda se o elemento daquela página existir,
   por isso o mesmo arquivo serve para as três páginas.
   ========================================================= */

/* ---------- Favoritos: um único "ouvinte" para todos os corações ---------- */
document.addEventListener('click', (evento) => {
  const botao = evento.target.closest('[data-favorito]');
  if (!botao) return;
  const salvo = alternarFavorito(Number(botao.dataset.favorito));
  botao.setAttribute('aria-pressed', salvo);
});

// Corações que já estão escritos no HTML (página do imóvel)
document.querySelectorAll('[data-favorito]').forEach((botao) => {
  botao.setAttribute('aria-pressed', lerFavoritos().includes(Number(botao.dataset.favorito)));
});

/* ---------- HOME: imóveis em destaque ---------- */
const destaques = document.querySelector('#destaques');
if (destaques) {
  const escolhidos = [1, 7, 3]; // ids dos imóveis que aparecem na home
  destaques.innerHTML = escolhidos
    .map((id) => IMOVEIS.find((imovel) => imovel.id === id))
    .map(cartaoImovel)
    .join('');
}

/* ---------- HOME: busca (Comprar / Alugar) ---------- */
const busca = document.querySelector('#busca');
if (busca) {
  const campoModo = busca.querySelector('input[name="modo"]');
  const rotuloValor = busca.querySelector('label[for="q-valor"]');
  const selectValor = busca.querySelector('#q-valor');
  const faixas = {
    comprar: ['Sem limite', 'R$ 300 mil', 'R$ 500 mil', 'R$ 800 mil', 'R$ 1,2 milhão', 'R$ 2 milhões'],
    alugar: ['Sem limite', 'R$ 1.500', 'R$ 2.500', 'R$ 4.000', 'R$ 6.000', 'R$ 10.000']
  };

  function escolherModo(modo) {
    campoModo.value = modo;
    busca.querySelectorAll('[data-modo]').forEach((botao) => {
      botao.setAttribute('aria-pressed', botao.dataset.modo === modo);
    });
    rotuloValor.textContent = modo === 'alugar' ? 'Aluguel até' : 'Valor até';
    selectValor.innerHTML = faixas[modo].map((faixa) => `<option>${faixa}</option>`).join('');
  }

  busca.querySelectorAll('[data-modo]').forEach((botao) => {
    botao.addEventListener('click', () => escolherModo(botao.dataset.modo));
  });
  escolherModo('comprar');
  // Ao clicar em "Buscar imóveis", o formulário abre imoveis.html?modo=...&tipo=...
}

/* ---------- LISTA: filtros e ordenação ---------- */
const lista = document.querySelector('#lista');
if (lista) {
  // Lê o que veio da busca da home pelo endereço (ex.: imoveis.html?modo=alugar&tipo=Casa)
  const parametros = new URLSearchParams(window.location.search);
  const tiposValidos = ['Todos', 'Apartamento', 'Casa', 'Cobertura'];
  const estado = {
    modo: parametros.get('modo') === 'alugar' ? 'alugar' : 'comprar',
    tipo: tiposValidos.includes(parametros.get('tipo')) ? parametros.get('tipo') : 'Todos',
    ordem: 'menor'
  };

  const titulo = document.querySelector('#titulo-lista');
  const contagem = document.querySelector('#contagem');
  const vazio = document.querySelector('#vazio');

  function desenharLista() {
    let imoveis = IMOVEIS.filter((imovel) =>
      imovel.modo === estado.modo && (estado.tipo === 'Todos' || imovel.tipo === estado.tipo));

    imoveis.sort((a, b) => {
      if (estado.ordem === 'maior') return b.preco - a.preco;
      if (estado.ordem === 'area') return b.area - a.area;
      return a.preco - b.preco;
    });

    lista.innerHTML = imoveis.map(cartaoImovel).join('');
    vazio.hidden = imoveis.length > 0;
    titulo.textContent = estado.modo === 'alugar' ? 'Imóveis para alugar' : 'Imóveis à venda';
    contagem.textContent = imoveis.length === 1 ? '1 imóvel encontrado' : imoveis.length + ' imóveis encontrados';

    document.querySelectorAll('[data-modo]').forEach((botao) => {
      botao.setAttribute('aria-pressed', botao.dataset.modo === estado.modo);
    });
    document.querySelectorAll('[data-tipo]').forEach((botao) => {
      botao.setAttribute('aria-pressed', botao.dataset.tipo === estado.tipo);
    });
  }

  document.querySelectorAll('[data-modo]').forEach((botao) => {
    botao.addEventListener('click', () => { estado.modo = botao.dataset.modo; desenharLista(); });
  });
  document.querySelectorAll('[data-tipo]').forEach((botao) => {
    botao.addEventListener('click', () => { estado.tipo = botao.dataset.tipo; desenharLista(); });
  });
  document.querySelector('#ordem').addEventListener('change', (evento) => {
    estado.ordem = evento.target.value;
    desenharLista();
  });

  desenharLista();
}

/* ---------- IMÓVEL: simulador de financiamento ---------- */
const simulador = document.querySelector('#simulador');
if (simulador) {
  const PRECO = Number(simulador.dataset.preco);
  const entrada = simulador.querySelector('#sim-entrada');
  const prazo = simulador.querySelector('#sim-prazo');
  const taxa = simulador.querySelector('#sim-taxa');
  const reais = (valor) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

  // Faz o número "correr" do valor antigo até o novo, em vez de trocar de uma vez
  const campoParcela = simulador.querySelector('#sim-parcela');
  const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let parcelaAtual = null;
  let animacao = null;

  function mostrarParcela(nova) {
    cancelAnimationFrame(animacao);
    if (parcelaAtual === null || semMovimento) {
      parcelaAtual = nova;
      campoParcela.textContent = reais(nova);
      return;
    }
    const inicial = parcelaAtual;
    const comeco = performance.now();
    const duracao = 350; // milissegundos
    function passo(agora) {
      const progresso = Math.min((agora - comeco) / duracao, 1);
      const suave = 1 - Math.pow(1 - progresso, 3); // desacelera no final
      parcelaAtual = inicial + (nova - inicial) * suave;
      campoParcela.textContent = reais(parcelaAtual);
      if (progresso < 1) animacao = requestAnimationFrame(passo);
    }
    animacao = requestAnimationFrame(passo);
  }

  function calcular() {
    const valorEntrada = PRECO * Number(entrada.value) / 100;
    const financiado = PRECO - valorEntrada;
    const meses = Number(prazo.value) * 12;
    const jurosAno = Math.max(0, parseFloat(taxa.value.replace(',', '.')) || 0);
    // Converte juros ao ano em juros ao mês e aplica a fórmula da Tabela Price
    const jurosMes = Math.pow(1 + jurosAno / 100, 1 / 12) - 1;
    const parcela = jurosMes > 0
      ? financiado * jurosMes / (1 - Math.pow(1 + jurosMes, -meses))
      : financiado / meses;

    simulador.querySelector('#sim-entrada-valor').textContent = entrada.value + '% · ' + reais(valorEntrada);
    simulador.querySelector('#sim-prazo-valor').textContent = prazo.value + ' anos';
    mostrarParcela(parcela);
    simulador.querySelector('#sim-financiado').textContent = reais(financiado);
  }

  [entrada, prazo, taxa].forEach((campo) => campo.addEventListener('input', calcular));
  calcular();
}

/* ---------- IMÓVEL: formulário de visita (demonstração) ---------- */
const formVisita = document.querySelector('#form-visita');
if (formVisita) {
  const confirmacao = document.querySelector('#confirmacao');
  formVisita.addEventListener('submit', (evento) => {
    evento.preventDefault(); // num site real, aqui os dados seriam enviados a um servidor
    formVisita.hidden = true;
    confirmacao.hidden = false;
  });
  document.querySelector('#novo-pedido').addEventListener('click', () => {
    formVisita.reset();
    formVisita.hidden = false;
    confirmacao.hidden = true;
  });
}
