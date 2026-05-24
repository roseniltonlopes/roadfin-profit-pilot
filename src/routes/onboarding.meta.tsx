import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { store, fmtBRL, type Goal } from "@/lib/roadfin-store";
import { NumberField, StepShell } from "./onboarding.veiculo";

export const Route = createFileRoute("/onboarding/meta")({
  component: GoalOnboarding,
});

function GoalOnboarding() {
  const [step, setStep] = useState(0);
  const [g, setG] = useState<Goal>({
    monthlyProfitGoal: 0,
    workDaysPerMonth: 22,
    hoursPerDay: 8,
    kmPerDay: 200,
  });
  const navigate = useNavigate();

  const required = useMemo(() => {
    const daily = g.workDaysPerMonth > 0 ? g.monthlyProfitGoal / g.workDaysPerMonth : 0;
    const hourly = g.hoursPerDay > 0 ? daily / g.hoursPerDay : 0;
    const perKm = g.kmPerDay > 0 ? daily / g.kmPerDay : 0;
    return { daily, hourly, perKm };
  }, [g]);

  const finish = () => {
    store.setGoal(g);
    navigate({ to: "/app" });
  };

  const goBack = () => (step === 0 ? navigate({ to: "/onboarding/veiculo" }) : setStep((s) => s - 1));

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col px-6 pb-10 pt-6 safe-top">
      <header className="flex items-center justify-between">
        <button onClick={goBack} className="grid h-10 w-10 place-items-center rounded-full surface shadow-card">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={`h-1.5 rounded-full transition-all ${i === step ? "w-6 bg-primary" : i < step ? "w-1.5 bg-primary/60" : "w-1.5 bg-border"}`} />
          ))}
        </div>
        <div className="w-10" />
      </header>

      <div className="mt-8 flex-1">
        {step === 0 && (
          <StepShell title="Qual seu objetivo de Lucro Real?" subtitle="Quanto você deseja levar pra casa no mês, já descontando todos os gastos e depreciação?">
            <NumberField label="Meta mensal (R$)" value={g.monthlyProfitGoal} onChange={(x) => setG({ ...g, monthlyProfitGoal: x })} step={100} />
          </StepShell>
        )}
        {step === 1 && (
          <StepShell title={`${fmtBRL(g.monthlyProfitGoal)} por mês.`} subtitle="Em quantos dias você pretende rodar?">
            <NumberField label="Dias no mês" value={g.workDaysPerMonth} onChange={(x) => setG({ ...g, workDaysPerMonth: x })} />
          </StepShell>
        )}
        {step === 2 && (
          <StepShell title="Qual sua jornada diária?" subtitle="Quantas horas você pretende ficar online?">
            <NumberField label="Horas / dia" value={g.hoursPerDay} onChange={(x) => setG({ ...g, hoursPerDay: x })} />
          </StepShell>
        )}
        {step === 3 && (
          <StepShell title="E a quilometragem?" subtitle="Quantos KM você costuma rodar nessas horas?">
            <NumberField label="KM / dia" value={g.kmPerDay} onChange={(x) => setG({ ...g, kmPerDay: x })} />
            <p className="mt-3 text-[13px] text-muted-foreground">~{g.hoursPerDay > 0 ? (g.kmPerDay / g.hoursPerDay).toFixed(1) : 0} km/h média</p>
          </StepShell>
        )}
        {step === 4 && (
          <StepShell title="Sua estratégia" subtitle="Veja o que precisa faturar para bater sua meta.">
            <div className="space-y-3">
              <div className="rounded-2xl bg-primary p-5 text-primary-foreground shadow-elevated">
                <p className="text-[11px] font-semibold uppercase tracking-wider opacity-80">Dinheiro no seu bolso</p>
                <p className="mt-1 text-[32px] font-bold tracking-tight">{fmtBRL(g.monthlyProfitGoal)}</p>
              </div>
              <div className="rounded-2xl surface p-5 shadow-card">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Faturamento diário necessário</p>
                <p className="mt-1 text-[24px] font-bold">{fmtBRL(required.daily)}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl surface p-4 shadow-card">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Por hora</p>
                  <p className="mt-1 text-[18px] font-bold">{fmtBRL(required.hourly)}</p>
                </div>
                <div className="rounded-2xl surface p-4 shadow-card">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Por KM</p>
                  <p className="mt-1 text-[18px] font-bold">{fmtBRL(required.perKm)}</p>
                </div>
              </div>
            </div>
          </StepShell>
        )}
      </div>

      <div className="pt-6">
        <button
          onClick={step === 4 ? finish : () => setStep((s) => s + 1)}
          disabled={step === 0 && g.monthlyProfitGoal <= 0}
          className="flex h-[58px] w-full items-center justify-center gap-2 rounded-2xl bg-primary text-[15px] font-semibold text-primary-foreground shadow-elevated transition-transform active:scale-[0.99] disabled:opacity-50"
        >
          {step === 4 ? <>Salvar Plano <Check className="h-5 w-5" /></> : <>Próximo <ArrowRight className="h-5 w-5" /></>}
        </button>
      </div>
    </main>
  );
}
