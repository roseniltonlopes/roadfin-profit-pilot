import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/auth/email")({
  component: EmailStep,
});

function EmailStep() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col px-6 pb-10 pt-6 safe-top">
      <header className="flex items-center justify-between">
        <Link to="/" className="grid h-10 w-10 place-items-center rounded-full surface shadow-card">
          <ArrowLeft className="h-5 w-5" />
        </Link>
      </header>

      <div className="mt-10">
        <h1 className="text-[28px] font-bold leading-tight tracking-tight">Qual é o seu e-mail?</h1>
        <p className="mt-2 text-[15px] text-muted-foreground">
          Vamos verificar a melhor forma de acesso.
        </p>

        <label className="mt-8 block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">E-mail</span>
          <input
            type="email"
            autoFocus
            placeholder="voce@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-[58px] w-full rounded-2xl bg-input px-5 text-[16px] font-medium outline-none ring-0 transition focus:ring-2 focus:ring-primary"
          />
        </label>
      </div>

      <div className="mt-auto pt-10">
        <button
          disabled={!email.includes("@")}
          onClick={() => navigate({ to: "/auth/criar", search: { email } })}
          className="flex h-[58px] w-full items-center justify-center gap-2 rounded-2xl bg-primary text-[15px] font-semibold text-primary-foreground shadow-elevated transition-transform active:scale-[0.99] disabled:opacity-50"
        >
          Continuar
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </main>
  );
}
