// Sistema de status financeiro (semáforo) — funções puras de classificação.
import type { WorkLog, Goal } from "./roadfin-store";

export type FinancialStatus = "positive" | "warning" | "negative" | "neutral";

/** Classifica margem de lucro: ≥20% positive, 5–20% warning, <5% negative. */
export function getMarginStatus(marginPct: number | null | undefined): FinancialStatus {
  if (marginPct == null || !isFinite(marginPct)) return "neutral";
  if (marginPct >= 20) return "positive";
  if (marginPct >= 5) return "warning";
  return "negative";
}

/** Classifica o resultado de um log de jornada (dia). */
export function getDayStatus(log?: Pick<WorkLog, "netProfit" | "profitMargin"> | null): FinancialStatus {
  if (!log) return "neutral";
  if (log.netProfit <= 0) return "negative";
  return getMarginStatus(log.profitMargin);
}

/**
 * Classifica progresso da meta mensal contra o ritmo esperado do mês.
 * - progresso ≥ ritmo esperado → positive
 * - 70–100% do ritmo → warning
 * - <70% do ritmo → negative
 */
export function getGoalStatus(
  progressPct: number,
  expectedPct: number,
): FinancialStatus {
  if (expectedPct <= 0) return "neutral";
  const ratio = progressPct / expectedPct;
  if (ratio >= 1) return "positive";
  if (ratio >= 0.7) return "warning";
  return "negative";
}

/** Classifica o lucro do dia agregado a partir dos logs do dia. */
export function getProfitStatus(netProfit: number, grossRevenue: number): FinancialStatus {
  if (grossRevenue <= 0 && netProfit === 0) return "neutral";
  if (netProfit <= 0) return "negative";
  const margin = grossRevenue > 0 ? (netProfit / grossRevenue) * 100 : 0;
  return getMarginStatus(margin);
}

/** Ritmo esperado da meta no dia atual do mês (0–100). */
export function expectedMonthProgressPct(now: Date = new Date()): number {
  const day = now.getDate();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  return (day / lastDay) * 100;
}

export function hasGoal(goal: Goal | null | undefined): goal is Goal {
  return !!goal && goal.monthlyProfitGoal > 0;
}
