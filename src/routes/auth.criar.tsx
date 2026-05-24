import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { store } from "@/lib/roadfin-store";

type Search = { email?: string };

export const Route = createFileRoute("/auth/criar")({
  validateSearch: (s: Record<string, unknown>): Search => ({ email: typeof s.email === "string" ? s.email : "" }),
  component: CreateAccount,
});

function CreateAccount() {
  const { email } = Route.useSearch();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");

  const submit = () => {
    if (!name || !password) return;
    store.setUser({
      email: email || "",
      name,
      lastName,
      trialStartedAt: new Date().toISOString(),
    });
    navigate({ to: "/onboarding/veiculo" });
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col px-6 pb-10 pt-6 safe-top">
      <header className="flex items-center justify-between">
        <Link to="/auth/email" className="grid h-10 w-10 place-items-center rounded-full surface shadow-card">
          <ArrowLeft className="h-5 w-5" />
        </Link>
      </header>

      <div className="mt-10">
        <h1 className="text-[28px] font-bold leading-tight tracking-tight">Criar sua conta</h1>
        <p className="mt-2 text-[15px] text-muted-foreground">
          Usando <span className="font-semibold text-foreground">{email}</span>
        </p>

        <div className="mt-8 space-y-4">
          <Field label="Nome" value={name} onChange={setName} placeholder="João" />
          <Field label="Sobrenome" value={lastName} onChange={setLastName} placeholder="Silva" />
          <Field label="Senha" value={password} onChange={setPassword} placeholder="••••••••" type="password" />
        </div>
      </div>

      <div className="mt-auto pt-10">
        <button
          onClick={submit}
          disabled={!name || !password}
          className="flex h-[58px] w-full items-center justify-center rounded-2xl bg-primary text-[15px] font-semibold text-primary-foreground shadow-elevated transition-transform active:scale-[0.99] disabled:opacity-50"
        >
          Criar e acessar
        </button>
        <p className="mt-5 text-center text-sm text-muted-foreground">
          Já tem conta?{" "}
          <Link to="/auth/email" className="font-semibold text-primary">Entrar</Link>
        </p>
      </div>
    </main>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-[58px] w-full rounded-2xl bg-input px-5 text-[16px] font-medium outline-none transition focus:ring-2 focus:ring-primary"
      />
    </label>
  );
}
