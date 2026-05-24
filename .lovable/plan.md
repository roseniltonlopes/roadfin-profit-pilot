
## Objetivo

Substituir a logo atual (ícone verde + texto "RoadFin") pela logo oficial enviada (carro estilizado preto/verde + wordmark "RoadFin") em todo o app.

## Passos

1. **Copiar a imagem** de `user-uploads://ChatGPT_Image_24_de_mai._de_2026_15_56_31.png` para `src/assets/roadfin-logo.png`.

2. **Gerar variante para tema escuro**: a logo enviada tem o texto "Road" em preto, que ficaria invisível no fundo dark (`#100F0D`). Vou gerar uma versão com "Road" em branco/claro (`src/assets/roadfin-logo-dark.png`) usando edição de imagem, mantendo o carro e "Fin" no verde da marca.

3. **Refatorar `src/components/roadfin/Logo.tsx`**:
   - Remover o SVG inline atual.
   - Importar as duas variantes (light e dark).
   - Renderizar `<img>` com troca automática via classe `dark:` do Tailwind (uma versão escondida no light, outra no dark).
   - Manter a prop `size` (controlando altura) e `withWordmark` (quando `false`, exibir uma versão recortada apenas do ícone — vou usar a logo completa em tamanho compacto, já que ícone e wordmark formam um conjunto coeso).
   - Ajustar proporções: a imagem é horizontal (~3:2), então `width` será derivado da altura mantendo aspect-ratio.

4. **Verificar pontos de uso** (já mapeados):
   - `src/routes/index.tsx` (landing) — logo grande (size 56)
   - `src/routes/app.index.tsx` (Hoje) — logo no header (size 36)
   - `src/routes/assinatura.tsx` — apenas ícone (`withWordmark={false}`, size 32)

   Como o componente continua com a mesma API, nenhuma alteração nos consumidores é necessária.

## Detalhes técnicos

- Imagem importada via ES6 do `src/assets/` (bundling otimizado pelo Vite).
- Sem alterações em design tokens nem em estilos globais.
- A landing tem logo centralizada com bom respiro — a nova logo (formato horizontal) cabe bem no espaço atual.
