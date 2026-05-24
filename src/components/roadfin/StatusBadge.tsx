import type { FinancialStatus } from "@/lib/status";
import { TrendingUp, AlertTriangle, TrendingDown, Minus, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Size = "sm" | "md";

const STATUS_MAP: Record<FinancialStatus, { label: string; icon: LucideIcon; cls: string; dotCls: string }> = {
  positive: {
    label: "Saudável",
    icon: TrendingUp,
    cls: "bg-status-positive-soft text-status-positive",
    dotCls: "bg-status-positive",
  },
  warning: {
    label: "Atenção",
    icon: AlertTriangle,
    cls: "bg-status-warning-soft text-status-warning",
    dotCls: "bg-status-warning",
  },
  negative: {
    label: "Prejuízo",
    icon: TrendingDown,
    cls: "bg-status-negative-soft text-status-negative",
    dotCls: "bg-status-negative",
  },
  neutral: {
    label: "Sem dados",
    icon: Minus,
    cls: "bg-status-neutral-soft text-status-neutral",
    dotCls: "bg-status-neutral",
  },
};

export function StatusBadge({
  status,
  label,
  size = "sm",
  showIcon = true,
  className,
}: {
  status: FinancialStatus;
  label?: string;
  size?: Size;
  showIcon?: boolean;
  className?: string;
}) {
  const cfg = STATUS_MAP[status];
  const Icon = cfg.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-semibold",
        size === "sm" ? "px-2.5 py-1 text-[11px] uppercase tracking-wider" : "px-3 py-1.5 text-[12px]",
        cfg.cls,
        className,
      )}
    >
      {showIcon && <Icon className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} strokeWidth={2.5} />}
      {label ?? cfg.label}
    </span>
  );
}

export function StatusDot({ status, className }: { status: FinancialStatus; className?: string }) {
  const cfg = STATUS_MAP[status];
  return <span className={cn("inline-block h-2 w-2 rounded-full", cfg.dotCls, className)} />;
}

/** Classe utilitária para backgrounds sólidos baseados em status (cards grandes). */
export function statusBgClass(status: FinancialStatus): string {
  switch (status) {
    case "positive":
      return "bg-status-positive text-status-positive-foreground";
    case "warning":
      return "bg-status-warning text-status-warning-foreground";
    case "negative":
      return "bg-status-negative text-status-negative-foreground";
    case "neutral":
      return "bg-status-neutral text-status-neutral-foreground";
  }
}
