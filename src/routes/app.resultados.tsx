import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { store, fmtBRL, usePersisted, type Goal } from "@/lib/roadfin-store";
import { ChevronDown, TrendingUp } from "lucide-react";
import { getProfitStatus, getGoalStatus, getMarginStatus, getDayStatus, expectedMonthProgressPct } from "@/lib/status";
import { StatusBadge, StatusDot, statusBgClass } from "@/components/roadfin/StatusBadge";

export const Route = createFileRoute("/app/resultados")({
  component: ResultsPage,
});

type Filter = "all" | "week" | "month";

function ResultsPage() {
  const [filter, setFilter] = useState<Filter>("month");
  const [goal] = usePersisted<Goal | null>("roadfin.goal", null);
  const logs = store.getLogs();

  const filtered = useMemo(() => {
    if (filter === "all") return logs;
    const now = new Date();
    if (filter === "week") {
      const weekAgo = new Date(now); weekAgo.setDate(now.getDate() - 7);
      return logs.filter((l) => new Date(l.date) >= weekAgo);
    }
    return logs.filter((l) => {
      const d = new Date(l.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
  }, [logs, filter]);

  const totals = filtered.reduce(
    (acc, l) => ({
      profit: acc.profit + l.netProfit,
      gross: acc.gross + l.grossRevenue,
      hours: acc.hours + l.hoursWorked,
      km: acc.km + l.kmDriven,
      expenses: acc.expenses + l.fuelCost + l.maintenanceCost + l.depreciationCost + l.fixedDailyCost,
    }),
    { profit: 0, gross: 0, hours: 0, km: 0, expenses: 0 },
  );
  const margin = totals.gross > 0 ? (totals.profit / totals.gross) * 100 : 0;
  const perHour = totals.hours > 0 ? totals.profit / totals.hours : 0;
  const perKm = totals.km > 0 ? totals.profit / totals.km : 0;

  const monthlyGoal = goal?.monthlyProfitGoal ?? 0;
  const monthProfit = logs
    .filter((l) => {
      const d = new Date(l.date);
      const n = new Date();
      return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
    })
    .reduce((s, l) => s + l.netProfit, 0);
  const pct = monthlyGoal > 0 ? Math.min(100, (monthProfit / monthlyGoal) * 100) : 0;
  const daysLeft = endOfMonth().getDate() - new Date().getDate();
  const onTrack = pct >= (1 - daysLeft / 30) * 100;

  return (
    <main className="px-5 pt-6 safe-top">
      <h1 className="text-[24px] font-bold tracking-tight">Resultados</h1>

      <div className="mt-5 inline-flex rounded-2xl bg-muted p-1">
        {(["all", "week", "month"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-xl px-4 py-2 text-[13px] font-semibold transition ${filter === f ? "bg-background text-foreground shadow-card" : "text-muted-foreground"}`}
          >
            {f === "all" ? "Geral" : f === "week" ? "Semana" : "Mês"}
          </button>
        ))}
      </div>

      <section className="mt-5 rounded-3xl bg-primary p-6 text-primary-foreground shadow-elevated">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider">
          <TrendingUp className="h-3 w-3" /> Resultado de lucro real
        </span>
        <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider opacity-80">Lucro Real</p>
        <p className="mt-1 text-[40px] font-bold tracking-tight">{fmtBRL(totals.profit)}</p>
      </section>

      <section className="mt-5 grid grid-cols-2 gap-3">
        <Kpi label="Horas trabalhadas" value={`${totals.hours.toFixed(1)}h`} />
        <Kpi label="Ganho / hora" value={fmtBRL(perHour)} />
        <Kpi label="Margem de lucro" value={`${margin.toFixed(1)}%`} />
        <Kpi label="Ganho / KM" value={fmtBRL(perKm)} />
      </section>

      {monthlyGoal > 0 && (
        <section className="mt-5 rounded-3xl surface p-5 shadow-card">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-semibold text-muted-foreground">Objetivo mensal</p>
            <p className="text-[13px] font-bold text-primary">{pct.toFixed(0)}%</p>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Lucrado</p>
              <p className="text-[20px] font-bold">{fmtBRL(monthProfit)}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Restante</p>
              <p className="text-[20px] font-bold">{fmtBRL(Math.max(0, monthlyGoal - monthProfit))}</p>
            </div>
          </div>
          <p className="mt-3 text-[13px] text-muted-foreground">
            {daysLeft} dias restantes. {onTrack ? "Você está no ritmo certo. 👏" : "Hora de acelerar. 🚀"}
          </p>
        </section>
      )}

      <Expandable title="Total despesas" value={fmtBRL(totals.expenses)}>
        <Row label="Combustível" value={fmtBRL(filtered.reduce((s, l) => s + l.fuelCost, 0))} />
        <Row label="Manutenção" value={fmtBRL(filtered.reduce((s, l) => s + l.maintenanceCost, 0))} />
        <Row label="Depreciação" value={fmtBRL(filtered.reduce((s, l) => s + l.depreciationCost, 0))} />
        <Row label="Custos fixos" value={fmtBRL(filtered.reduce((s, l) => s + l.fixedDailyCost, 0))} />
      </Expandable>

      <Expandable title="Registros" value={`${filtered.length}`}>
        {filtered.length === 0 && <p className="px-1 py-3 text-[13px] text-muted-foreground">Nenhum registro neste período.</p>}
        {filtered.map((l) => (
          <div key={l.id} className="flex items-center justify-between py-3">
            <div>
              <p className="text-[14px] font-semibold">{new Date(l.date).toLocaleDateString("pt-BR")}</p>
              <p className="text-[12px] text-muted-foreground">{l.hoursWorked.toFixed(1)}h · {l.kmDriven} km</p>
            </div>
            <p className="text-[15px] font-bold text-primary">{fmtBRL(l.netProfit)}</p>
          </div>
        ))}
      </Expandable>
    </main>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl surface p-4 shadow-card">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-2 text-[20px] font-bold">{value}</p>
    </div>
  );
}

function Expandable({ title, value, children }: { title: string; value: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <section className="mt-3 rounded-3xl surface p-5 shadow-card">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between">
        <p className="text-[14px] font-semibold">{title}</p>
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-bold">{value}</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </button>
      {open && <div className="mt-3 divide-y divide-border">{children}</div>}
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-[13px] text-muted-foreground">{label}</span>
      <span className="text-[14px] font-semibold">{value}</span>
    </div>
  );
}

function endOfMonth() {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth() + 1, 0);
}
