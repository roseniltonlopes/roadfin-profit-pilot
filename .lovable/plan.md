## Aumentar a presença da logo RoadFin

### O que vamos fazer

A logo atual está pequena e sem destaque. Vamos transformá-la em um elemento visual de impacto em todas as telas.

### Mudanças

1. **Landing page (`/`):**
   - Aumentar a altura da logo de `56px` para `96px` (~70% maior).
   - Adicionar um efeito de brilho sutil (`drop-shadow`) com a cor primária `#63D72A` ao redor da logo para criar um halo de presença.
   - Adicionar uma microanimação de entrada (scale-in suave) para a logo aparecer com impacto ao carregar a página.

2. **Header do app (`/app/`):**
   - Aumentar a altura da logo de `36px` para `52px` (~45% maior).
   - Manter a pílula clara no modo escuro para legibilidade.

3. **Logo component (`Logo.tsx`):**
   - Aceitar uma prop opcional `impact?: boolean` que, quando true, aplica o efeito de brilho/glow na cor primária.
   - O glow será feito via `filter: drop-shadow(...)` inline ou classe utilitária, sem criar tokens novos.

### Resultado esperado
Logo grande, visível, com um brilho verde sutil que chama atenção sem ser agressivo. Presença de marca inesquecível na primeira impressão.
