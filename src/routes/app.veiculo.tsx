import { createFileRoute, Link } from "@tanstack/react-router";
import { usePersisted, type Vehicle, store } from "@/lib/roadfin-store";
import { Car, AlertCircle, Plus } from "lucide-react";

export const Route = createFileRoute("/app/veiculo")({
  component: VehiclePage,
});

function VehiclePage() {
  const [vehicle] = usePersisted<Vehicle | null>("roadfin.vehicle", null);
  const logsCount = store.getLogs().length;

  return (
    <main className="px-5 pt-6 safe-top">
      <h1 className="text-[24px] font-bold tracking-tight">Veículo</h1>

      {!vehicle ? (
        <div className="mt-5 rounded-3xl bg-accent/40 p-5 ring-1 ring-primary/20">
          <div className="flex gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary">
              <AlertCircle className="h-5 w-5" />
            </span>
            <p className="flex-1 text-[14px] text-foreground">
              Cadastre seu veículo com os custos fixos. O app usará seu desempenho histórico para calcular sua margem de lucro real.
            </p>
          </div>
        </div>
      ) : (
        <article className="mt-5 rounded-3xl surface p-5 shadow-card">
          <div className="flex items-center gap-4">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-elevated">
              <Car className="h-6 w-6" />
            </span>
            <div className="flex-1">
              <p className="text-[16px] font-bold">{vehicle.name}</p>
              <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-semibold text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Em uso
              </span>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <Detail label="Perfil" value={profileLabel(vehicle.profile)} />
            <Detail label="Tipo" value={ownershipLabel(vehicle.ownership)} />
            <Detail label="Placa" value={vehicle.plate || "—"} />
            <Detail label="Registros" value={`${logsCount}`} />
          </div>
        </article>
      )}

      <Link
        to="/onboarding/veiculo"
        className="mt-5 flex h-[58px] w-full items-center justify-center gap-2 rounded-2xl bg-primary text-[15px] font-semibold text-primary-foreground shadow-elevated active:scale-[0.99]"
      >
        <Plus className="h-5 w-5" /> Cadastrar Novo Veículo
      </Link>
    </main>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-muted p-3">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 text-[14px] font-bold">{value}</p>
    </div>
  );
}

function profileLabel(p: Vehicle["profile"]) {
  return p === "economic" ? "Econômico" : p === "sedan" ? "Sedã" : "SUV";
}
function ownershipLabel(o: Vehicle["ownership"]) {
  return o === "own" ? "Próprio" : o === "financed" ? "Financiado" : "Alugado";
}
