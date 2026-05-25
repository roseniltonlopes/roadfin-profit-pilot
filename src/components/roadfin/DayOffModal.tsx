import { useState } from "react";
import { CalendarOff, Wrench } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { store, computeLog, fmtBRL } from "@/lib/roadfin-store";
import { toast } from "sonner";

type Mode = "choose" | "maintenance" | "done";

export function DayOffModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [mode, setMode] = useState<Mode>("choose");
  const [cost, setCost] = useState("");

  function reset() {
    setMode("choose");
    setCost("");
  }

  function buildBaseLog(extraCost = 0) {
    const vehicle = store.getVehicle();
    if (!vehicle) {
      toast.error("Cadastre seu veículo antes de registrar.");
      return null;
    }
    const goal = store.getGoal();
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10);
    const computed = computeLog({
      uber: 0,
      app99: 0,
      other: 0,
      hours: 0,
      km: 0,
      fuelConsumption: vehicle.fuelConsumption,
      fuelPrice: vehicle.fuelPrice,
      vehicle: { ...vehicle, dailyExpenses: vehicle.dailyExpenses + extraCost },
      goal,
    });
    return {
      id: crypto.randomUUID(),
      date: dateStr,
      startTime: "--:--",
      endTime: "--:--",
      ...computed,
    };
  }

  function handleFolga() {
    const log = buildBaseLog(0);
    if (!log) return;
    store.addLog(log);
    toast.success(`Folga registrada. Custos do dia: ${fmtBRL(log.fixedDailyCost)}`);
    onOpenChange(false);
    setTimeout(reset, 200);
  }

  function handleMaintenance() {
    const value = parseFloat(cost.replace(",", "."));
    if (!Number.isFinite(value) || value <= 0) {
      toast.error("Informe um valor válido.");
      return;
    }
    const log = buildBaseLog(value);
    if (!log) return;
    store.addLog(log);
    toast.success(`Manutenção de ${fmtBRL(value)} registrada.`);
    onOpenChange(false);
    setTimeout(reset, 200);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) setTimeout(reset, 200); }}>
      <DialogContent className="max-w-sm rounded-3xl">
        <DialogHeader>
          <DialogTitle>{mode === "maintenance" ? "Manutenção" : "Folga ou Manutenção?"}</DialogTitle>
          <DialogDescription>
            {mode === "maintenance"
              ? "Informe quanto você gastou hoje com manutenção."
              : "Escolha o que aconteceu hoje."}
          </DialogDescription>
        </DialogHeader>

        {mode === "choose" && (
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleFolga}
              className="flex flex-col items-start gap-2 rounded-2xl border border-border bg-card p-4 text-left transition-transform active:scale-[0.98]"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-muted">
                <CalendarOff className="h-5 w-5" />
              </span>
              <div className="font-semibold text-[15px]">Folga</div>
              <p className="text-[12px] text-muted-foreground">Não trabalhei hoje. Registrar custos fixos do dia.</p>
            </button>
            <button
              onClick={() => setMode("maintenance")}
              className="flex flex-col items-start gap-2 rounded-2xl border border-border bg-card p-4 text-left transition-transform active:scale-[0.98]"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-muted">
                <Wrench className="h-5 w-5" />
              </span>
              <div className="font-semibold text-[15px]">Manutenção</div>
              <p className="text-[12px] text-muted-foreground">Carro parado para reparo. Lançar custo extra.</p>
            </button>
          </div>
        )}

        {mode === "maintenance" && (
          <div className="space-y-3 pt-2">
            <label className="block">
              <span className="mb-1 block text-[12px] font-medium text-muted-foreground">Valor gasto (R$)</span>
              <input
                type="number"
                inputMode="decimal"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                placeholder="0,00"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-[16px] outline-none focus:ring-2 focus:ring-primary/30"
                autoFocus
              />
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setMode("choose")}
                className="flex-1 rounded-xl border border-border py-3 text-[14px] font-medium"
              >
                Voltar
              </button>
              <button
                onClick={handleMaintenance}
                className="flex-1 rounded-xl bg-foreground py-3 text-[14px] font-semibold text-background"
              >
                Registrar
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
