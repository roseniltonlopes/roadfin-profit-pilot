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

        <div className="mt-6 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            Assuma o controle dos seus ganhos
          </p>
          <h1 className="mt-4 text-[34px] font-bold leading-[1.05] tracking-tight">
            O controle financeiro do <span className="text-primary">motorista moderno</span>.
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
    <svg viewBox="0 0 48 48" className="h-5 w-5">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571.001-.001.002-.001.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
    </svg>
  );
}
