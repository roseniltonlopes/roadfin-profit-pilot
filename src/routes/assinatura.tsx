import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Check, Sparkles } from "lucide-react";
import { Logo } from "@/components/roadfin/Logo";

export const Route = createFileRoute("/assinatura")({
  component: SubscriptionPage,
});

const benefits = [
  "Cálculo completo de lucro real",
  "Metas inteligentes",
  "Histórico ilimitado",
  "Insights financeiros",
  "Exportação de relatórios",
  "Tema dark premium",
  "Controle de múltiplos veículos",
];

function SubscriptionPage() {
  const navigate = useNavigate();

  return (
    <main className="mx-auto min-h-screen max-w-md bg-background px-6 pb-10 pt-6 safe-top">
      <header className="flex items-center justify-between">
        <button onClick={() => navigate({ to: "/app" })} className="grid h-10 w-10 place-items-center rounded-full surface shadow-card">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <Logo size={32} withWordmark={false} />
        <div className="w-10" />
      </header>

      <section className="mt-8 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
          <Sparkles className="h-3 w-3" /> RoadFin Premium
        </span>
        <h1 className="mt-4 text-[34px] font-bold leading-tight tracking-tight">
          Saiba quanto <br /> realmente sobra.
        </h1>
        <p className="mt-3 text-[15px] text-muted-foreground">7 dias grátis. Cancele quando quiser.</p>
      </section>

      <section className="mt-7 rounded-3xl bg-foreground p-6 text-background shadow-elevated">
        <p className="text-[11px] font-semibold uppercase tracking-wider opacity-70">Após o trial</p>
        <p className="mt-1 text-[36px] font-bold leading-none tracking-tight">
          R$ 15,90 <span className="text-[14px] font-medium opacity-70">/mês</span>
        </p>
        <p className="mt-2 text-[13px] opacity-80">Pague apenas se decidir continuar.</p>
      </section>

      <ul className="mt-6 space-y-3">
        {benefits.map((b) => (
          <li key={b} className="flex items-center gap-3 rounded-2xl surface px-4 py-3 shadow-card">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground">
              <Check className="h-4 w-4" strokeWidth={3} />
            </span>
            <span className="text-[14px] font-medium">{b}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8 space-y-3">
        <button className="flex h-[60px] w-full items-center justify-center gap-2 rounded-2xl bg-primary text-[15px] font-semibold text-primary-foreground shadow-elevated active:scale-[0.99]">
          Começar 7 dias grátis
        </button>
        <Link to="/app" className="flex h-[52px] w-full items-center justify-center text-[14px] font-semibold text-muted-foreground">
          Continuar grátis por enquanto
        </Link>
      </div>
    </main>
  );
}
