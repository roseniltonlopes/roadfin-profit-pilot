import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { store, fmtBRL } from "@/lib/roadfin-store";

export function PriceCalculatorModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const vehicle = store.getVehicle();
  const [km, setKm] = useState("");
  const [min, setMin] = useState("");
  const [margin, setMargin] = useState("30");

  const result = useMemo(() => {
    if (!vehicle) return null;
    const k = parseFloat(km.replace(",", ".")) || 0;
    const m = parseFloat(margin.replace(",", ".")) || 0;
    if (k <= 0) return null;
    const fuel = vehicle.fuelConsumption > 0 ? (k / vehicle.fuelConsumption) * vehicle.fuelPrice : 0;
    const wear = k * (vehicle.maintenancePerKm + vehicle.depreciationPerKm);
    const cost = fuel + wear;
    const denom = 1 - m / 100;
    const suggested = denom > 0 ? cost / denom : cost;
    const profit = suggested - cost;
    return { cost, suggested, profit };
  }, [km, margin, vehicle]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-3xl">
        <DialogHeader>
          <DialogTitle>Calculadora de corrida</DialogTitle>
          <DialogDescription>Preço sugerido para corridas particulares.</DialogDescription>
        </DialogHeader>

        {!vehicle ? (
          <div className="space-y-3 pt-2 text-center">
            <p className="text-sm text-muted-foreground">Cadastre seu veículo para calcular o preço.</p>
            <Link
              to="/app/veiculo"
              onClick={() => onOpenChange(false)}
              className="inline-block rounded-xl bg-foreground px-4 py-2.5 text-[14px] font-semibold text-background"
            >
              Cadastrar veículo
            </Link>
          </div>
        ) : (
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <Field label="KM da corrida" value={km} onChange={setKm} placeholder="0" />
              <Field label="Tempo (min)" value={min} onChange={setMin} placeholder="0" />
            </div>
            <Field label="Margem alvo (%)" value={margin} onChange={setMargin} placeholder="30" />

            {result && (
              <div className="mt-2 rounded-2xl bg-status-positive-soft p-4 text-status-positive">
                <p className="text-[11px] font-semibold uppercase tracking-wider opacity-80">Preço sugerido</p>
                <p className="mt-1 text-[32px] font-bold leading-none">{fmtBRL(result.suggested)}</p>
                <div className="mt-3 flex justify-between text-[12px] opacity-90">
                  <span>Custo estimado: {fmtBRL(result.cost)}</span>
                  <span>Lucro: {fmtBRL(result.profit)}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[12px] font-medium text-muted-foreground">{label}</span>
      <input
        type="number"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-[15px] outline-none focus:ring-2 focus:ring-primary/30"
      />
    </label>
  );
}
