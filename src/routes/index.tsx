import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Logo } from "@/components/roadfin/Logo";
import { Mail } from "lucide-react";
import { store } from "@/lib/roadfin-store";

export const Route = createFileRoute("/")({
  component: LandingPage,
  head: () => ({
    meta: [
      { title: "RoadFin — O controle financeiro do motorista moderno." },
      { name: "description", content: "Plataforma financeira premium para motoristas de aplicativo." },
    ],
  }),
});

function LandingPage() {
  const navigate = useNavigate();

  const handleGoogle = () => {
    // Demo: simula login Google. Conectaremos ao Lovable Cloud em seguida.
    store.setUser({
      email: "motorista@google.com",
      name: "Motorista",
      lastName: "",
      trialStartedAt: new Date().toISOString(),
    });
    navigate({ to: "/onboarding/veiculo" });
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[300px] w-[300px] translate-x-1/3 translate-y-1/3 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 pb-10 pt-16 safe-top">
        <div className="flex justify-center animate-in fade-in zoom-in-90 duration-700">
          <Logo size={96} impact />
        </div>

        <div className="mt-16 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            Assuma o controle dos seus ganhos
          </p>
          <h1 className="mt-4 text-[34px] font-bold leading-[1.05] tracking-tight">
            Seu lucro na <br /> direção certa.
          </h1>
          <p className="mt-4 text-[15px] text-muted-foreground">
            Veja quanto realmente sobra no seu bolso depois de tudo.
          </p>
        </div>

        <div className="mt-auto pt-16">
          <h2 className="text-base font-semibold">Faça login na sua conta.</h2>

          <button
            onClick={handleGoogle}
            className="mt-4 flex h-[58px] w-full items-center justify-center gap-3 rounded-2xl surface shadow-card text-[15px] font-semibold transition-transform active:scale-[0.99]"
          >
            <GoogleIcon />
            Continuar com o Google
          </button>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">ou</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <Link
            to="/auth/email"
            className="flex h-[58px] w-full items-center justify-center gap-3 rounded-2xl bg-foreground text-background text-[15px] font-semibold transition-transform active:scale-[0.99]"
          >
            <Mail className="h-5 w-5" />
            Continuar com e-mail
          </Link>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Novo por aqui?{" "}
            <Link to="/auth/email" className="font-semibold text-primary">
              Comece grátis
            </Link>
          </p>

          <p className="mt-6 text-center text-[11px] text-muted-foreground">
            Ao continuar, você aceita os{" "}
            <a className="underline-offset-2 hover:underline">Termos legais e privacidade</a>.
          </p>
        </div>
      </div>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <path fill="#EA4335" d="M12 10.2v3.92h5.45c-.24 1.4-1.66 4.12-5.45 4.12-3.28 0-5.95-2.72-5.95-6.06s2.67-6.06 5.95-6.06c1.87 0 3.12.8 3.84 1.48l2.62-2.52C16.78 3.55 14.6 2.6 12 2.6 6.85 2.6 2.7 6.74 2.7 11.9s4.15 9.3 9.3 9.3c5.37 0 8.93-3.77 8.93-9.08 0-.61-.07-1.08-.15-1.54H12z" />
    </svg>
  );
}
