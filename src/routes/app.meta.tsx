import { createFileRoute, Link } from "@tanstack/react-router";
import { usePersisted, type Goal, fmtBRL, store } from "@/lib/roadfin-store";
import { Target, Pencil } from "lucide-react";
import { getGoalStatus, expectedMonthProgressPct } from "@/lib/status";
import { StatusBadge } from "@/components/roadfin/StatusBadge";

export const Route = createFileRoute("/app/meta")({
  component: GoalPage,
});

function GoalPage() {
  const [goal] = usePersisted<Goal | null>("roadfin.goal", null);

  if (!goal) {
    return (
      <main className="px-5 pt-6 safe-top">
        <h1 className="text-[24px] font-bold tracking-tight">Meta</h1>
        <div className="mt-8 rounded-3xl surface p-6 text-center shadow-card">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Target className="h-6 w-6" />
          </span>
          <p className="mt-4 text-[15px] font-semibold">Defina sua meta de lucro</p>
          <p className="mt-2 text-[13px] text-muted-foreground">Vamos calcular o quanto você precisa faturar por dia, hora e KM.</p>
          <Link to="/onboarding/meta" className="mt-5 inline-flex h-12 items-center justify-center rounded-2xl bg-primary px-6 text-[14px] font-semibold text-primary-foreground">
            Definir meta
          </Link>
        </div>
      </main>
    );
  }

  const dailyRevenue = goal.workDaysPerMonth > 0 ? goal.monthlyProfitGoal / goal.workDaysPerMonth : 0;
  const hourly = goal.hoursPerDay > 0 ? dailyRevenue / goal.hoursPerDay : 0;
  const perKm = goal.kmPerDay > 0 ? dailyRevenue / goal.kmPerDay : 0;

  return (
    <main className="px-5 pt-6 safe-top">
      <header className="flex items-center justify-between">
        <h1 className="text-[24px] font-bold tracking-tight">Meta</h1>
        <Link to="/onboarding/meta" className="grid h-10 w-10 place-items-center rounded-full surface shadow-card">
          <Pencil className="h-4 w-4" />
        </Link>
      </header>

      {(() => {
        const monthProfit = store.getLogs()
          .filter((l) => {
            const d = new Date(l.date);
            const n = new Date();
            return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
          })
          .reduce((s, l) => s + l.netProfit, 0);
        const pct = goal.monthlyProfitGoal > 0 ? (monthProfit / goal.monthlyProfitGoal) * 100 : 0;
        const goalStatus = getGoalStatus(pct, expectedMonthProgressPct());
        return (
          <section className="mt-5 rounded-3xl bg-primary p-6 text-primary-foreground shadow-elevated">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-wider opacity-80">Dinheiro no seu bolso</p>
              <StatusBadge status={goalStatus} className="bg-white/15 text-current" />
            </div>
            <p className="mt-2 text-[40px] font-bold tracking-tight">{fmtBRL(goal.monthlyProfitGoal)}</p>
            <p className="mt-1 text-[13px] opacity-80">por mês · {pct.toFixed(0)}% atingido</p>
          </section>
        );
      })()}

      <section className="mt-5 rounded-3xl surface p-5 shadow-card">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Faturamento diário necessário</p>
        <p className="mt-1 text-[24px] font-bold">{fmtBRL(dailyRevenue)}</p>
      </section>

      <section className="mt-3 grid grid-cols-2 gap-3">
        <div className="rounded-2xl surface p-4 shadow-card">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Por hora</p>
          <p className="mt-1 text-[20px] font-bold">{fmtBRL(hourly)}</p>
        </div>
        <div className="rounded-2xl surface p-4 shadow-card">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Por KM</p>
          <p className="mt-1 text-[20px] font-bold">{fmtBRL(perKm)}</p>
        </div>
      </section>

      <section className="mt-3 grid grid-cols-3 gap-3">
        <Stat label="Dias / mês" value={`${goal.workDaysPerMonth}`} />
        <Stat label="Horas / dia" value={`${goal.hoursPerDay}h`} />
        <Stat label="KM / dia" value={`${goal.kmPerDay}`} />
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl surface p-4 text-center shadow-card">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 text-[16px] font-bold">{value}</p>
    </div>
  );
}
