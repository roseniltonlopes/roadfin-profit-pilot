import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Car, Banknote, KeyRound } from "lucide-react";
import { store, type Vehicle, fmtBRL } from "@/lib/roadfin-store";

export const Route = createFileRoute("/onboarding/veiculo")({
  component: VehicleOnboarding,
});

type Step = 0 | 1 | 2 | 3 | 4 | 5;

const profileDefaults: Record<Vehicle["profile"], Partial<Vehicle>> = {
  economic: { maintenancePerKm: 0.18, depreciationPerKm: 0.15, fuelConsumption: 12 },
  sedan: { maintenancePerKm: 0.22, depreciationPerKm: 0.2, fuelConsumption: 10 },
  suv: { maintenancePerKm: 0.3, depreciationPerKm: 0.28, fuelConsumption: 8 },
};

function VehicleOnboarding() {
  const [step, setStep] = useState<Step>(0);
  const [v, setV] = useState<Vehicle>({
    name: "",
    ownership: "own",
    profile: "economic",
    plate: "",
    dailyExpenses: 0,
    annualIpva: 0,
    annualInsurance: 0,
    monthlyPayment: 0,
    maintenancePerKm: 0.2,
    depreciationPerKm: 0.18,
    fuelConsumption: 11,
    fuelPrice: 6,
  });
  const navigate = useNavigate();

  const update = (patch: Partial<Vehicle>) => setV((p) => ({ ...p, ...patch }));
  const goNext = () => setStep((s) => (s + 1) as Step);
  const goBack = () => (step === 0 ? navigate({ to: "/" }) : setStep((s) => (s - 1) as Step));

  const costPerKm = v.maintenancePerKm + v.depreciationPerKm + (v.fuelConsumption > 0 ? v.fuelPrice / v.fuelConsumption : 0);
  const fixedPerDay = useMemo(
    () => (v.annualIpva / 12 + v.annualInsurance / 12 + v.monthlyPayment) / 22 + v.dailyExpenses,
    [v]
  );

  const finish = () => {
    store.setVehicle(v);
    navigate({ to: "/onboarding/meta" });
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col px-6 pb-10 pt-6 safe-top">
      <header className="flex items-center justify-between">
        <button onClick={goBack} className="grid h-10 w-10 place-items-center rounded-full surface shadow-card">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <ProgressDots total={6} current={step} />
        <div className="w-10" />
      </header>

      <div className="mt-8 flex-1">
        {step === 0 && (
          <StepShell title="Vou te ajudar a configurar seu veículo." subtitle="Para começar, qual o modelo ou nome dele?">
            <TextField label="Nome do veículo" value={v.name} onChange={(x) => update({ name: x })} placeholder="Ex: Onix do João" />
          </StepShell>
        )}

        {step === 1 && (
          <StepShell title="O veículo é..." subtitle="Precisamos saber como os custos mensais são distribuídos.">
            <Options
              value={v.ownership}
              onChange={(x) => update({ ownership: x as Vehicle["ownership"] })}
              options={[
                { value: "own", label: "Meu / Próprio", desc: "Já está quitado", icon: Car },
                { value: "financed", label: "Financiado", desc: "Possui parcelas mensais", icon: Banknote },
                { value: "rented", label: "Alugado", desc: "É um veículo de locadora", icon: KeyRound },
              ]}
            />
          </StepShell>
        )}

        {step === 2 && (
          <StepShell title="Qual o perfil desse veículo?" subtitle="Isso ajuda a calcular os custos médios sugeridos.">
            <Options
              value={v.profile}
              onChange={(x) => {
                const def = profileDefaults[x as Vehicle["profile"]];
                update({ profile: x as Vehicle["profile"], ...def });
              }}
              options={[
                { value: "economic", label: "Econômico", desc: "Compactos e populares" },
                { value: "sedan", label: "Sedã", desc: "Confortáveis e espaçosos" },
                { value: "suv", label: "SUV", desc: "Altos e robustos" },
              ]}
            />
          </StepShell>
        )}

        {step === 3 && (
          <StepShell title={`Legal! O ${v.name || "veículo"}.`} subtitle="Agora, qual a placa dele? (Padrão antigo ou Mercosul)">
            <TextField
              label="Placa"
              value={v.plate}
              onChange={(x) => update({ plate: x.toUpperCase() })}
              placeholder="ABC1D23"
            />
          </StepShell>
        )}

        {step === 4 && (
          <StepShell title="E os gastos fixos?" subtitle="Quase acabando. Qual a média desses gastos?">
            <div className="space-y-3">
              <NumberField label="Gastos diários (lavagem, alimentação...)" value={v.dailyExpenses} onChange={(x) => update({ dailyExpenses: x })} />
              <NumberField label="IPVA anual" value={v.annualIpva} onChange={(x) => update({ annualIpva: x })} />
              <NumberField label="Seguro anual" value={v.annualInsurance} onChange={(x) => update({ annualInsurance: x })} />
              {v.ownership !== "own" && (
                <NumberField label={v.ownership === "rented" ? "Aluguel mensal" : "Parcela mensal"} value={v.monthlyPayment} onChange={(x) => update({ monthlyPayment: x })} />
              )}
              <NumberField label="Manutenção por KM (R$)" value={v.maintenancePerKm} onChange={(x) => update({ maintenancePerKm: x })} step={0.01} />
              <NumberField label="Depreciação por KM (R$)" value={v.depreciationPerKm} onChange={(x) => update({ depreciationPerKm: x })} step={0.01} />
              <NumberField label="Consumo médio (KM/L)" value={v.fuelConsumption} onChange={(x) => update({ fuelConsumption: x })} step={0.1} />
              <NumberField label="Preço do combustível (R$/L)" value={v.fuelPrice} onChange={(x) => update({ fuelPrice: x })} step={0.01} />
            </div>
          </StepShell>
        )}

        {step === 5 && (
          <StepShell title="Tudo pronto!" subtitle={`Confira o resumo financeiro para o seu ${v.name}.`}>
            <div className="grid grid-cols-2 gap-3">
              <SummaryCard label="Custo / KM" value={fmtBRL(costPerKm)} highlight />
              <SummaryCard label="Fixo / Dia" value={fmtBRL(fixedPerDay)} highlight />
              <SummaryCard label="Placa" value={v.plate || "—"} />
              <SummaryCard label="Perfil" value={profileLabel(v.profile)} />
              <SummaryCard label="Manutenção / KM" value={fmtBRL(v.maintenancePerKm)} />
              <SummaryCard label="Depreciação / KM" value={fmtBRL(v.depreciationPerKm)} />
            </div>
          </StepShell>
        )}
      </div>

      <div className="pt-6">
        <button
          onClick={step === 5 ? finish : goNext}
          disabled={step === 0 && !v.name}
          className="flex h-[58px] w-full items-center justify-center gap-2 rounded-2xl bg-primary text-[15px] font-semibold text-primary-foreground shadow-elevated transition-transform active:scale-[0.99] disabled:opacity-50"
        >
          {step === 5 ? <>Concluir <Check className="h-5 w-5" /></> : <>Próximo <ArrowRight className="h-5 w-5" /></>}
        </button>
      </div>
    </main>
  );
}

function profileLabel(p: Vehicle["profile"]) {
  return p === "economic" ? "Econômico" : p === "sedan" ? "Sedã" : "SUV";
}

function ProgressDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 rounded-full transition-all ${i === current ? "w-6 bg-primary" : i < current ? "w-1.5 bg-primary/60" : "w-1.5 bg-border"}`}
        />
      ))}
    </div>
  );
}

export function StepShell({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div>
      <h1 className="text-[26px] font-bold leading-tight tracking-tight">{title}</h1>
      {subtitle && <p className="mt-2 text-[15px] text-muted-foreground">{subtitle}</p>}
      <div className="mt-8">{children}</div>
    </div>
  );
}

export function TextField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-[58px] w-full rounded-2xl bg-input px-5 text-[16px] font-medium outline-none transition focus:ring-2 focus:ring-primary"
      />
    </label>
  );
}

export function NumberField({ label, value, onChange, step = 1 }: { label: string; value: number; onChange: (v: number) => void; step?: number }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <input
        type="number"
        inputMode="decimal"
        step={step}
        value={value || ""}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        placeholder="0"
        className="h-[58px] w-full rounded-2xl bg-input px-5 text-[16px] font-medium outline-none transition focus:ring-2 focus:ring-primary"
      />
    </label>
  );
}

function Options<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: { value: T; label: string; desc: string; icon?: typeof Car }[] }) {
  return (
    <div className="space-y-3">
      {options.map((o) => {
        const active = o.value === value;
        const Icon = o.icon;
        return (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={`flex w-full items-center gap-4 rounded-2xl border-2 px-4 py-4 text-left transition-all ${active ? "border-primary bg-accent/50" : "border-transparent surface shadow-card"}`}
          >
            {Icon && (
              <span className={`grid h-11 w-11 place-items-center rounded-xl ${active ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                <Icon className="h-5 w-5" />
              </span>
            )}
            <div className="flex-1">
              <div className="text-[15px] font-semibold">{o.label}</div>
              <div className="text-[13px] text-muted-foreground">{o.desc}</div>
            </div>
            <span className={`grid h-6 w-6 place-items-center rounded-full border-2 ${active ? "border-primary bg-primary" : "border-border"}`}>
              {active && <Check className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={3} />}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function SummaryCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl p-4 shadow-card ${highlight ? "bg-primary/10 ring-1 ring-primary/30" : "surface"}`}>
      <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-2 text-[18px] font-bold ${highlight ? "text-primary" : ""}`}>{value}</div>
    </div>
  );
}
