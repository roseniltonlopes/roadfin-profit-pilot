## Objetivo

Ativar os três botões da tela `/app` que hoje são apenas visuais (sem `onClick`).

---

## 1. Iniciar Turno — timer no card "Hoje"

**Persistência (em `src/lib/roadfin-store.ts`):**
- Nova chave `roadfin.shift` guardando `{ startedAt: string } | null`.
- Helpers: `store.getShift()`, `store.startShift()`, `store.endShift()`.

**UI em `src/routes/app.index.tsx`:**
- O `ActionCard` "Iniciar Turno" vira um botão real:
  - Sem turno ativo → texto "Iniciar Turno", ao clicar grava `startedAt = now`.
  - Com turno ativo → vira "Encerrar Turno" (ícone `Square`, accent vermelho via `bg-status-negative-soft`).
- No card "Lucro real de hoje", quando há turno ativo, mostra um chip com o tempo decorrido `HH:MM:SS` atualizado a cada 1s via `setInterval` em `useEffect`.
- Ao encerrar, redireciona para `/app/registrar?hours=<decimal>` (pré-preencher horas, opcional — apenas se já existir esse parâmetro lá; caso contrário, só limpa o estado).

---

## 2. Folga / Manutenção — modal de escolha

**Novo componente** `src/components/roadfin/DayOffModal.tsx`:
- Usa `Dialog` do shadcn já presente no projeto.
- Duas opções grandes lado a lado:
  - **Folga** → grava um `WorkLog` do dia atual com receitas zeradas e `kmDriven=0, hoursWorked=0` (apenas custos fixos do dia computados via `computeLog`). Mensagem de confirmação.
  - **Manutenção** → mostra um campo numérico ("Valor gasto R$"); ao confirmar, grava um `WorkLog` com receita 0, km 0, e o valor entra como `otherRevenue` negativo (ou novo campo `extraCost` adicionado ao input do `computeLog`). Para manter o store simples, será somado como custo extra empurrando para `dailyExpenses` daquele log.

No `app.index.tsx`, o `ActionCard` "Folga / Manutenção" abre esse modal.

---

## 3. Calculadora — modal de preço sugerido

**Novo componente** `src/components/roadfin/PriceCalculatorModal.tsx`:
- `Dialog` com inputs:
  - KM da corrida
  - Tempo estimado (min)
  - Margem alvo (% — default 30)
- Calcula:
  - `custo = (km / fuelConsumption) * fuelPrice + km * (maintenancePerKm + depreciationPerKm)`
  - `precoSugerido = custo / (1 - margem/100)`
- Mostra cartão de resultado com custo, preço sugerido e lucro estimado, colorido via `StatusBadge`.
- Se não houver `vehicle` cadastrado, exibe CTA para `/app/perfil` (ou rota equivalente de veículo).
- Não persiste nada.

No `app.index.tsx`, o `ActionCard` "Calculadora" abre esse modal.

---

## Arquivos afetados

- `src/lib/roadfin-store.ts` — adicionar shift helpers.
- `src/routes/app.index.tsx` — handlers, estado dos modais, timer.
- `src/components/roadfin/DayOffModal.tsx` (novo).
- `src/components/roadfin/PriceCalculatorModal.tsx` (novo).

Sem mudanças nas demais rotas e sem alterações de design tokens.
