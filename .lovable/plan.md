## Plano

### 1. Diminuir espaçamento entre logo e primeiro texto
- Arquivo: `src/routes/index.tsx`
- Alterar o `mt-16` (64px) da div do texto para um valor menor (ex: `mt-8` ou `mt-10`), reduzindo a distância entre a logo e o bloco de texto "Assuma o controle dos seus ganhos".

### 2. Restaurar cor original do "G" do Google
- Arquivo: `src/routes/index.tsx`
- Substituir o SVG monócromo (vermelho) do `GoogleIcon` pelo SVG oficial colorido do Google, com os 4 caminhos nas cores corretas:
  - Azul: `#4285F4`
  - Vermelho: `#EA4335`
  - Amarelo: `#FBBC05`
  - Verde: `#34A853`

Nenhuma outra alteração estrutural necessária.