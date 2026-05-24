import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { store, computeLog, fmtBRL, type Vehicle } from "@/lib/roadfin-store";
import { getProfitStatus } from "@/lib/status";
import { StatusBadge, statusBgClass } from "@/components/roadfin/StatusBadge";
import { NumberField, StepShell, TextField } from "../routes/onboarding.veiculo";

export const Route = createFileRoute("/app/registrar")({
  component: RegisterFlow,
});

function RegisterFlow() {
  const vehicle = store.getVehicle();
  const goal = store.getGoal();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [uber, setUber] = useState(0);
  const [app99, setApp99] = useState(0);
  const [other, setOther] = useState(0);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [km, setKm] = useState(0);
  const [consumption, setConsumption] = useState(vehicle?.fuelConsumption ?? 11);
  const [price, setPrice] = useState(vehicle?.fuelPrice ?? 6);

  const total = uber + app99 + other;
  const hours = useMemo(() => calcHours(start, end), [start, end]);

  const result = useMemo(() => {
    if (!vehicle) return null;
    return computeLog({
      uber, app99, other, hours, km,
      fuelConsumption: consumption, fuelPrice: price,
      vehicle, goal,
    });
  }, [uber, app99, other, hours, km, consumption, price, vehicle, goal]);

  if (!vehicle) {
    return (
      <main className="px-5 pt-6 safe-top">
        <EmptyState />
      </main>
    );
  }

  const save = () => {
    if (!result) return;
    store.addLog({
      id: crypto.randomUUID(),
      date,
      startTime: start,
      endTime: end,
      ...result,
    });
    navigate({ to: "/app/resultados" });
  };

  return (
    <main className="px-5 pt-6 safe-top">
      <header className="flex items-center justify-between">
        <button
          onClick={() => (step === 0 ? navigate({ to: "/app" }) : setStep((s) => s - 1))}
          className="grid h-10 w-10 place-items-center rounded-full surface shadow-card"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={`h-1.5 rounded-full transition-all ${i === step ? "w-6 bg-primary" : i < step ? "w-1.5 bg-primary/60" : "w-1.5 bg-border"}`} />
          ))}
        </div>
        <div className="w-10" />
      </header>

      <div className="mt-8">
        {step === 0 && (
          <StepShell title="Quanto você faturou hoje?" subtitle="Insira os ganhos brutos de cada aplicativo e gorjetas.">
            <div className="space-y-3">
              <NumberField label="Uber" value={uber} onChange={setUber} step={1} />
              <NumberField label="99" value={app99} onChange={setApp99} step={1} />
              <NumberField label="Gorjetas / Outros" value={other} onChange={setOther} step={1} />
              <div className="mt-4 rounded-2xl bg-primary/10 p-4 ring-1 ring-primary/30">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">Total bruto</p>
                <p className="mt-1 text-[24px] font-bold text-primary">{fmtBRL(total)}</p>
              </div>
            </div>
          </StepShell>
        )}

        {step === 1 && (
          <StepShell title="Horários da Jornada" subtitle="Quando você começou e quando terminou?">
            <div className="space-y-3">
              <TimeField label="Início" value={start} onChange={setStart} />
              <TimeField label="Término" value={end} onChange={setEnd} />
              <TextField label="Data" value={date} onChange={setDate} />
              {hours > 0 && (
                <p className="text-[13px] text-muted-foreground">Total: <span className="font-semibold text-foreground">{hours.toFixed(1)}h</span></p>
              )}
            </div>
          </StepShell>
        )}

        {step === 2 && (
          <StepShell title="E a quilometragem?" subtitle="Quantos KM o carro rodou nessa jornada?">
            <NumberField label="KM rodados" value={km} onChange={setKm} step={1} />
          </StepShell>
        )}

        {step === 3 && (
          <StepShell title="Consumo e Combustível" subtitle="Confirme as médias para calcularmos seu lucro real.">
            <div className="space-y-3">
              <NumberField label="KM por Litro" value={consumption} onChange={setConsumption} step={0.1} />
              <NumberField label="Preço R$/L" value={price} onChange={setPrice} step={0.01} />
            </div>
          </StepShell>
        )}

        {step === 4 && result && (
          <ResultStep result={result} vehicle={vehicle} onSave={save} onDiscard={() => navigate({ to: "/app" })} />
        )}
      </div>

      {step < 4 && (
        <div className="mt-8">
          <button
            onClick={() => setStep((s) => s + 1)}
            className="flex h-[58px] w-full items-center justify-center gap-2 rounded-2xl bg-primary text-[15px] font-semibold text-primary-foreground shadow-elevated transition-transform active:scale-[0.99]"
          >
            Próximo <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </main>
  );
}

function TimeField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-[58px] w-full rounded-2xl bg-input px-5 text-[16px] font-medium outline-none focus:ring-2 focus:ring-primary"
      />
    </label>
  );
}

function calcHours(start: string, end: string) {
  if (!start || !end) return 0;
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  let mins = eh * 60 + em - (sh * 60 + sm);
  if (mins < 0) mins += 24 * 60;
  return mins / 60;
}

function ResultStep({ result, onSave, onDiscard }: { result: ReturnType<typeof computeLog>; vehicle: Vehicle; onSave: () => void; onDiscard: () => void }) {
  return (
    <div>
      <h1 className="text-[26px] font-bold tracking-tight">Seu Lucro Real</h1>
      <p className="mt-1 text-[14px] text-muted-foreground">A matemática não mente.</p>

      <div className="mt-6 rounded-3xl bg-primary p-6 text-primary-foreground shadow-elevated">
        <p className="text-[11px] font-semibold uppercase tracking-wider opacity-80">Lucro líquido real</p>
        <p className="mt-2 text-[40px] font-bold tracking-tight">{fmtBRL(result.netProfit)}</p>
        <p className="mt-1 text-[13px] opacity-80">Margem de {result.profitMargin.toFixed(1)}%</p>
      </div>

      <div className="mt-4 space-y-3">
        <Row label="Faturamento bruto" value={fmtBRL(result.grossRevenue)} />
        <Row label="Custos variáveis" value={`- ${fmtBRL(result.fuelCost + result.maintenanceCost + result.depreciationCost)}`} negative />
        <Row label="Custos fixos do dia" value={`- ${fmtBRL(result.fixedDailyCost)}`} negative />
        <Row label="Ganho por hora" value={fmtBRL(result.profitPerHour)} />
        <Row label="Ganho por KM" value={fmtBRL(result.profitPerKm)} />
      </div>

      <div className="mt-8 space-y-3">
        <button onClick={onSave} className="flex h-[58px] w-full items-center justify-center gap-2 rounded-2xl bg-primary text-[15px] font-semibold text-primary-foreground shadow-elevated active:scale-[0.99]">
          <Check className="h-5 w-5" /> Salvar no Histórico
        </button>
        <button onClick={onDiscard} className="flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl text-[14px] font-semibold text-muted-foreground">
          <X className="h-4 w-4" /> Descartar Lançamento
        </button>
      </div>
    </div>
  );
}

function Row({ label, value, negative }: { label: string; value: string; negative?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-2xl surface px-4 py-4 shadow-card">
      <span className="text-[14px] text-muted-foreground">{label}</span>
      <span className={`text-[15px] font-bold ${negative ? "text-destructive" : ""}`}>{value}</span>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mt-20 rounded-3xl surface p-6 text-center shadow-card">
      <p className="text-[15px] font-semibold">Cadastre seu veículo primeiro</p>
      <p className="mt-2 text-[13px] text-muted-foreground">
        Precisamos dos custos para calcular seu lucro real.
      </p>
      <Link to="/onboarding/veiculo" className="mt-5 inline-flex h-12 items-center justify-center rounded-2xl bg-primary px-6 text-[14px] font-semibold text-primary-foreground">
        Cadastrar veículo
      </Link>
    </div>
  );
}
