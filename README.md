# Pátio Imóveis — site de estudo

Site de uma imobiliária fictícia, feito para estudar o fluxo **design → código → GitHub**.
É um site estático: só HTML, CSS e JavaScript, sem instalação e sem servidor.

## Como abrir

Baixe os arquivos e abra `index.html` no navegador. Só isso.

## Estrutura

| Arquivo | O que é |
| --- | --- |
| `index.html` | Home: abertura, busca, destaques, bairros, como funciona, chamada para anunciar |
| `imoveis.html` | Lista de imóveis com filtros (comprar/alugar, tipo) e ordenação |
| `imovel.html` | Página de um imóvel: galeria, ficha, simulador de financiamento, pedido de visita |
| `css/style.css` | Todo o visual. As cores ficam nas variáveis do topo (`:root`) |
| `js/dados.js` | A lista de imóveis e a função que monta o cartão de cada um |
| `js/site.js` | O comportamento: busca, filtros, favoritos, simulador, formulário |
| `js/animacoes.js` | Quando as animações acontecem (o visual delas fica na seção 6 do CSS) |

## O que é de exemplo

- Os imóveis, preços e bairros são inventados.
- `[TELEFONE]`, `[E-MAIL]`, `CRECI [NÚMERO]` e afins são campos para preencher.
- As fotos são blocos provisórios com desenhos. Para usar fotos reais, crie uma pasta `img/` e troque os blocos `.foto` por `<img>`.
- O mapa é um desenho. O formulário de visita não envia nada.
- A página `imovel.html` mostra sempre o mesmo imóvel.

## Publicar com o GitHub Pages

No repositório: **Settings → Pages → Source: Deploy from a branch → Branch: main / (root) → Save**.
Em um ou dois minutos o site fica disponível em `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`.

## Ideias de exercício

1. Trocar a cor `--destaque` no `css/style.css` e ver o site inteiro mudar.
2. Adicionar um imóvel novo na lista do `js/dados.js`.
3. Criar uma página `sobre.html` reaproveitando o cabeçalho e o rodapé.
