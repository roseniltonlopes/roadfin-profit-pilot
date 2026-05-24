import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect } from "react";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <p className="mt-4 text-sm text-muted-foreground">Página não encontrada.</p>
        <a
          href="/"
          className="mt-6 inline-flex h-12 items-center justify-center rounded-2xl bg-primary px-6 text-sm font-semibold text-primary-foreground"
        >
          Voltar
        </a>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight">Algo deu errado</h1>
        <p className="mt-2 text-sm text-muted-foreground">Tente novamente em instantes.</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 inline-flex h-12 items-center justify-center rounded-2xl bg-primary px-6 text-sm font-semibold text-primary-foreground"
        >
          Tentar de novo
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#100F0D" },
      { title: "RoadFin — O controle financeiro do motorista moderno." },
      { name: "description", content: "Plataforma financeira premium para motoristas de aplicativo. Acompanhe ganhos, despesas, metas e lucro real." },
      { property: "og:title", content: "RoadFin — O controle financeiro do motorista moderno." },
      { property: "og:description", content: "Plataforma financeira premium para motoristas de aplicativo. Acompanhe ganhos, despesas, metas e lucro real." },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "RoadFin — O controle financeiro do motorista moderno." },
      { name: "twitter:description", content: "Plataforma financeira premium para motoristas de aplicativo. Acompanhe ganhos, despesas, metas e lucro real." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/93339511-d96a-4224-aa96-da8428716c0c/id-preview-b2797086--88c6900a-d942-4710-b71f-40a55ca578b6.lovable.app-1779650639064.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/93339511-d96a-4224-aa96-da8428716c0c/id-preview-b2797086--88c6900a-d942-4710-b71f-40a55ca578b6.lovable.app-1779650639064.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function ThemeBootstrap() {
  useEffect(() => {
    const t = (localStorage.getItem("roadfin.theme") as "light" | "dark" | null) ?? "light";
    document.documentElement.classList.toggle("dark", t === "dark");
  }, []);
  return null;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeBootstrap />
      <Outlet />
    </QueryClientProvider>
  );
}
