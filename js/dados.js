/* =========================================================
   dados.js — os imóveis do site e a função que desenha o cartão.
   Num site real, esta lista viria de um banco de dados ou de
   um painel administrativo. Aqui ela é fixa, para estudo.
   ========================================================= */

// Lista de imóveis (dados de exemplo, inventados).
// modo: 'comprar' ou 'alugar' · arte: qual desenho usar na foto provisória
const IMOVEIS = [
  { id: 1, modo: 'comprar', tipo: 'Casa', arte: 'casa', cor: '', preco: 685000, titulo: 'Casa térrea com quintal e edícula', bairro: 'Jardim das Acácias', quartos: 3, vagas: 2, area: 180 },
  { id: 2, modo: 'comprar', tipo: 'Apartamento', arte: 'predio', cor: 'ceu', preco: 420000, titulo: 'Apartamento de 2 quartos com varanda', bairro: 'Centro', quartos: 2, vagas: 1, area: 68 },
  { id: 3, modo: 'comprar', tipo: 'Casa', arte: 'moderna', cor: 'areia', preco: 1240000, titulo: 'Casa contemporânea em condomínio', bairro: 'Alto da Serra', quartos: 4, vagas: 3, area: 310 },
  { id: 4, modo: 'comprar', tipo: 'Cobertura', arte: 'predio', cor: 'areia', preco: 980000, titulo: 'Cobertura duplex com terraço', bairro: 'Vila Aurora', quartos: 3, vagas: 2, area: 164 },
  { id: 5, modo: 'comprar', tipo: 'Apartamento', arte: 'predio', cor: '', preco: 355000, titulo: 'Apartamento compacto perto do parque', bairro: 'Vila Aurora', quartos: 1, vagas: 1, area: 44 },
  { id: 6, modo: 'comprar', tipo: 'Casa', arte: 'casa', cor: 'ceu', preco: 540000, titulo: 'Sobrado reformado de esquina', bairro: 'Centro', quartos: 3, vagas: 1, area: 132 },
  { id: 7, modo: 'alugar', tipo: 'Apartamento', arte: 'predio', cor: 'ceu', preco: 3200, titulo: 'Apartamento mobiliado de 2 quartos', bairro: 'Centro', quartos: 2, vagas: 1, area: 72 },
  { id: 8, modo: 'alugar', tipo: 'Casa', arte: 'casa', cor: '', preco: 4800, titulo: 'Casa com jardim e churrasqueira', bairro: 'Jardim das Acácias', quartos: 3, vagas: 2, area: 150 },
  { id: 9, modo: 'alugar', tipo: 'Apartamento', arte: 'predio', cor: 'areia', preco: 1900, titulo: 'Studio com lavanderia no prédio', bairro: 'Vila Aurora', quartos: 1, vagas: 0, area: 32 },
  { id: 10, modo: 'alugar', tipo: 'Cobertura', arte: 'moderna', cor: '', preco: 7500, titulo: 'Cobertura com vista aberta', bairro: 'Alto da Serra', quartos: 3, vagas: 2, area: 140 }
];

// Desenhos usados no lugar das fotos (SVG). Quando houver fotos reais,
// basta trocar a chamada de desenhoDaFoto() por uma tag <img>.
const ARTES = {
  casa: '<path d="M0 222h400"/><path d="M90 222V132l80-60 80 60v90"/><path d="M250 152h72v70"/><path d="M150 222v-52h40v52"/><rect x="108" y="146" width="28" height="28"/><rect x="270" y="172" width="34" height="26"/><path d="M356 222v-42"/><circle cx="356" cy="160" r="22"/>',
  predio: '<path d="M0 222h400"/><path d="M130 222V40h140v182"/><path class="janelas" d="M152 72h96M152 106h96M152 140h96M152 174h96"/><path d="M270 222V112h72v110"/><path d="M58 222v-82h72"/><path d="M188 222v-22h24v22"/>',
  moderna: '<path d="M0 222h400"/><path d="M60 222V122h120"/><path d="M40 122h140"/><path d="M180 222V82h140v140"/><path d="M165 82h170"/><path d="M82 222v-78h76v78M120 144v78"/><rect x="205" y="104" width="90" height="44"/><path d="M250 104v44"/><path d="M362 222v-58"/><path d="M362 112c-18 14-18 40 0 54 18-14 18-40 0-54z"/>'
};

function desenhoDaFoto(arte) {
  return '<svg class="arte" viewBox="0 0 400 240" preserveAspectRatio="xMidYMax meet" aria-hidden="true">' + ARTES[arte] + '</svg>';
}

// "685000" vira "R$ 685.000"; aluguel ganha "/mês"
function formatarPreco(imovel) {
  const valor = 'R$ ' + imovel.preco.toLocaleString('pt-BR');
  return imovel.modo === 'alugar' ? valor + '/mês' : valor;
}

/* ---------- Favoritos (ficam salvos no navegador do visitante) ---------- */
function lerFavoritos() {
  try {
    return JSON.parse(localStorage.getItem('patio-favoritos')) || [];
  } catch (erro) {
    return []; // navegação privada ou armazenamento bloqueado: segue sem favoritos
  }
}

function alternarFavorito(id) {
  let favoritos = lerFavoritos();
  if (favoritos.includes(id)) {
    favoritos = favoritos.filter((item) => item !== id);
  } else {
    favoritos.push(id);
  }
  try {
    localStorage.setItem('patio-favoritos', JSON.stringify(favoritos));
  } catch (erro) { /* sem armazenamento: o coração só vale até recarregar */ }
  return favoritos.includes(id);
}

/* ---------- Cartão de imóvel: devolve o HTML de um cartão ---------- */
function cartaoImovel(imovel) {
  const favorito = lerFavoritos().includes(imovel.id);
  const quartos = imovel.quartos === 1 ? '1 quarto' : imovel.quartos + ' quartos';
  const vagas = imovel.vagas === 0 ? 'Sem vaga' : imovel.vagas === 1 ? '1 vaga' : imovel.vagas + ' vagas';
  return `
    <article class="cartao">
      <div class="foto ${imovel.cor}">
        ${desenhoDaFoto(imovel.arte)}
        <span class="etiqueta">${imovel.modo === 'alugar' ? 'Aluguel' : 'Venda'}</span>
        <button type="button" class="favorito" data-favorito="${imovel.id}" aria-pressed="${favorito}" aria-label="Salvar nos favoritos">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>
        </button>
      </div>
      <div class="cartao-corpo">
        <div class="preco">${formatarPreco(imovel)}</div>
        <a class="cartao-titulo" href="imovel.html">${imovel.titulo}</a>
        <div class="cartao-local">${imovel.tipo} · ${imovel.bairro}</div>
        <div class="cartao-dados"><span>${quartos}</span><span>${vagas}</span><span>${imovel.area} m²</span></div>
      </div>
    </article>`;
}
