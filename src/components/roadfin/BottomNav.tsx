import { Link, useLocation } from "@tanstack/react-router";
import { CalendarDays, BarChart3, Plus, Target, Car } from "lucide-react";

const items = [
  { to: "/app", label: "Hoje", icon: CalendarDays, exact: true },
  { to: "/app/resultados", label: "Resultados", icon: BarChart3 },
  { to: "/app/registrar", label: "Registrar", icon: Plus, primary: true },
  { to: "/app/meta", label: "Meta", icon: Target },
  { to: "/app/veiculo", label: "Veículo", icon: Car },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/85 backdrop-blur-xl safe-bottom">
      <ul className="mx-auto flex max-w-md items-end justify-between px-3 pt-2">
        {items.map((item) => {
          const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
          const Icon = item.icon;
          if (item.primary) {
            return (
              <li key={item.to} className="-mt-7">
                <Link
                  to={item.to}
                  className="grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-elevated transition-transform active:scale-95"
                  aria-label={item.label}
                >
                  <Icon className="h-6 w-6" strokeWidth={2.5} />
                </Link>
              </li>
            );
          }
          return (
            <li key={item.to} className="flex-1">
              <Link
                to={item.to}
                className={`mx-auto flex w-16 flex-col items-center gap-1 rounded-2xl py-2 text-[11px] font-semibold transition-colors ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
