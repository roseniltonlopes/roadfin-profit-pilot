## Sistema visual de status financeiro (semáforo)

Implementar uma linguagem visual unificada baseada em semáforo (verde / amarelo / vermelho / cinza) em todo o RoadFin, mantendo o visual premium e minimalista.

### 1. Tokens de cor (src/styles.css)

Adicionar tokens semânticos de status, em `oklch`, para light e dark mode:

- `--status-positive` / `--status-positive-foreground` / `--status-positive-soft` (verde — já é a `--primary`, mas exposto como `status-positive` para deixar a intenção explícita)
- `--status-warning` / `--status-warning-foreground` / `--status-warning-soft` (amarelo `#F5B93F`)
- `--status-negative` / `--status-negative-foreground` / `--status-negative-soft` (vermelho `#EF4444`)
- `--status-neutral` / `--status-neutral-foreground` / `--status-neutral-soft` (cinza `#6B7280`)

Cada cor terá uma variante "soft" (background suave ~ 12% alpha) usada em chips/badges, e uma variante sólida para textos/ícones. Registrar no `@theme inline` como `--color-status-*` para gerar utilitários Tailwind (`bg-status-positive`, `text-status-warning`, etc.).

### 2. Helper de classificação (src/lib/status.ts — novo)

Função pura que recebe contexto financeiro e devolve um status:

```ts
export type FinancialStatus = "positive" | "warning" | "negative" | "neutral";

getProfitStatus(netProfit, grossRevenue)        // margem
getGoalStatus(progressPct, daysElapsedPct)      // ritmo da meta
getMarginStatus(marginPct)                       // >20% verde, 5-20% amarelo, <5% vermelho, sem dados cinza
getDayStatus(log)                                // dia bom/atenção/prejuízo
```

Regras de classificação (resumo):
- **Lucro do dia**: >0 e margem ≥ 20% = positive; >0 e margem 5–20% = warning; ≤0 = negative; sem log = neutral.
- **Meta mensal**: progresso ≥ ritmo esperado = positive; entre 70–100% do ritmo = warning; <70% = negative; sem meta = neutral.
- **Margem geral**: ≥20% positive; 5–20% warning; <5% negative.

### 3. Componente `<StatusBadge />` (src/components/roadfin/StatusBadge.tsx — novo)

Chip pequeno e refinado (rounded-full, soft background + texto sólido + ícone opcional `lucide-react`). Variantes pelas 4 cores. Tamanhos `sm` / `md`.

### 4. Aplicação nas telas

- **app/index (Hoje)** — card "Lucro real de hoje" muda de cor (verde / amarelo / vermelho / neutro) conforme `getDayStatus`. Texto secundário ajusta a mensagem.
- **app/resultados** — card grande de "Lucro Real" colorido conforme status; barra de progresso da meta com cor de `getGoalStatus`; KPI "Margem de lucro" com `StatusBadge`.
- **app/meta** — card "Dinheiro no seu bolso" mantém destaque, mas indicador adicional de ritmo (badge) usando `getGoalStatus`.
- **app/registrar** — ao computar preview do log, mostrar `StatusBadge` do resultado.
- **Listagem de registros (resultados expandable)** — pequeno dot colorido por log (`getDayStatus`).

### 5. Critério de "não regredir o visual"

- Cards principais continuam usando `bg-primary` quando o status é positive (verde já é a cor primária). Apenas trocamos para `bg-status-warning` / `bg-status-negative` / `bg-status-neutral` quando o status muda.
- Sem cores hard-coded em componentes — tudo via tokens.
- Dark mode coberto com o mesmo conjunto de tokens.

### Arquivos afetados

- `src/styles.css` (tokens)
- `src/lib/status.ts` (novo)
- `src/components/roadfin/StatusBadge.tsx` (novo)
- `src/routes/app.index.tsx`
- `src/routes/app.resultados.tsx`
- `src/routes/app.meta.tsx`
- `src/routes/app.registrar.tsx`

Nenhuma alteração em lógica de negócio/cálculo — apenas leitura dos valores existentes para colorir a UI.
