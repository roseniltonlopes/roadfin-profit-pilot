import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Play, Square, Calculator, CalendarOff, Plus, Sparkles, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/roadfin/ThemeToggle";
import { Logo } from "@/components/roadfin/Logo";
import { usePersisted, type User, type Shift, fmtBRL, store } from "@/lib/roadfin-store";
import { getProfitStatus } from "@/lib/status";
import { StatusBadge, statusBgClass } from "@/components/roadfin/StatusBadge";
import { DayOffModal } from "@/components/roadfin/DayOffModal";
import { PriceCalculatorModal } from "@/components/roadfin/PriceCalculatorModal";

export const Route = createFileRoute("/app/")({
  component: TodayPage,
});


function TodayPage() {
  const [user] = usePersisted<User | null>("roadfin.user", null);
  const [shift, setShift] = usePersisted<Shift | null>("roadfin.shift", null);
  const [dayOffOpen, setDayOffOpen] = useState(false);
  const [calcOpen, setCalcOpen] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!shift) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [shift]);

  const greeting = greetingFor(new Date());
  const today = new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" });

  const trialDaysLeft = (() => {
    if (!user?.trialStartedAt) return 7;
    const elapsed = (Date.now() - new Date(user.trialStartedAt).getTime()) / (1000 * 60 * 60 * 24);
    return Math.max(0, Math.ceil(7 - elapsed));
  })();

  const logsToday = store.getLogs().filter((l) => l.date === new Date().toISOString().slice(0, 10));
  const todayProfit = logsToday.reduce((s, l) => s + l.netProfit, 0);
  const todayGross = logsToday.reduce((s, l) => s + l.grossRevenue, 0);
  const dayStatus = logsToday.length === 0 ? "neutral" : getProfitStatus(todayProfit, todayGross);
  const dayMessages: Record<typeof dayStatus, string> = {

    positive: "Você está no ritmo certo. 👏",
    warning: "Atenção: margem apertada hoje.",
    negative: "Hoje fechou no prejuízo. Vamos analisar.",
    neutral: "Lance sua primeira jornada para ver o resultado.",
  };

  return (
    <main className="px-5 pt-6 safe-top">
      <header className="flex items-center justify-between">
        <Logo size={52} />
        <div className="flex items-center gap-2">
          <button className="grid h-10 w-10 place-items-center rounded-full surface shadow-card">
            <Bell className="h-5 w-5" />
          </button>
          <ThemeToggle />
        </div>
      </header>

      <section className="mt-7">
        <h1 className="text-[26px] font-bold leading-tight tracking-tight">
          {greeting}, {user?.name || "Motorista"}! 👋
        </h1>
        <p className="mt-1 text-[13px] capitalize text-muted-foreground">{today}</p>
      </section>

      {trialDaysLeft > 0 && trialDaysLeft <= 7 && (
        <Link
          to="/assinatura"
          className="mt-5 flex items-center justify-between rounded-2xl bg-foreground p-4 text-background shadow-elevated"
        >
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider opacity-70">Modo de Teste</p>
              <p className="text-sm font-semibold">{trialDaysLeft} dias restantes</p>
            </div>
          </div>
          <span className="rounded-full bg-primary px-3 py-1.5 text-[12px] font-semibold text-primary-foreground">
            Assinar
          </span>
        </Link>
      )}

      <section className={`mt-5 rounded-3xl p-6 shadow-elevated ${statusBgClass(dayStatus)}`}>
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-wider opacity-80">Lucro real de hoje</p>
          <StatusBadge status={dayStatus} className="bg-white/15 text-current" showIcon />
        </div>
        <p className="mt-2 text-[40px] font-bold leading-none tracking-tight">{fmtBRL(todayProfit)}</p>
        <p className="mt-2 text-[13px] opacity-80">{dayMessages[dayStatus]}</p>
        {shift && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-[12px] font-semibold">
            <Clock className="h-3.5 w-3.5" />
            Turno: {formatElapsed(now - new Date(shift.startedAt).getTime())}
          </div>
        )}
      </section>

      <section className="mt-5 space-y-3">
        <ActionCard
          icon={shift ? Square : Play}
          title={shift ? "Encerrar Turno" : "Iniciar Turno"}
          desc={shift ? "Finalizar e ir para o registro de ganhos." : "Inicie e monitore seu tempo em tempo real."}
          accent
          danger={!!shift}
          onClick={() => {
            if (shift) {
              setShift(null);
              window.location.href = "/app/registrar";
            } else {
              store.startShift();
              setShift({ startedAt: new Date().toISOString() });
            }
          }}
        />
        <div className="grid grid-cols-2 gap-3">
          <ActionCard icon={CalendarOff} title="Folga / Manutenção" desc="Registrar dia sem trabalho" small onClick={() => setDayOffOpen(true)} />
          <ActionCard icon={Calculator} title="Calculadora" desc="Corrida particular" small onClick={() => setCalcOpen(true)} />
        </div>
      </section>

      <Link
        to="/app/registrar"
        className="mt-6 flex h-[60px] w-full items-center justify-center gap-2 rounded-2xl bg-foreground text-background text-[15px] font-semibold shadow-elevated transition-transform active:scale-[0.99]"
      >
        <Plus className="h-5 w-5" strokeWidth={2.5} />
        Lançar Ganhos
      </Link>

      <DayOffModal open={dayOffOpen} onOpenChange={setDayOffOpen} />
      <PriceCalculatorModal open={calcOpen} onOpenChange={setCalcOpen} />
    </main>
  );
}

function formatElapsed(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = String(Math.floor(total / 3600)).padStart(2, "0");
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}


function greetingFor(d: Date) {
  const h = d.getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

function ActionCard({ icon: Icon, title, desc, accent, small }: { icon: typeof Play; title: string; desc: string; accent?: boolean; small?: boolean }) {
  return (
    <button
      className={`flex w-full items-start gap-3 rounded-3xl p-5 text-left shadow-card transition-transform active:scale-[0.99] ${accent ? "surface ring-1 ring-primary/30" : "surface"} ${small ? "p-4" : ""}`}
    >
      <span className={`grid place-items-center rounded-2xl ${accent ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"} ${small ? "h-10 w-10" : "h-12 w-12"}`}>
        <Icon className={small ? "h-5 w-5" : "h-5 w-5"} />
      </span>
      <div className="flex-1">
        <div className={`font-semibold ${small ? "text-[14px]" : "text-[16px]"}`}>{title}</div>
        <p className={`mt-0.5 text-muted-foreground ${small ? "text-[12px]" : "text-[13px]"}`}>{desc}</p>
      </div>
    </button>
  );
}
