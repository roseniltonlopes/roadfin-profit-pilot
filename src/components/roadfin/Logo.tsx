type Props = { size?: number; withWordmark?: boolean };

export function Logo({ size = 40, withWordmark = true }: Props) {
  return (
    <div className="inline-flex items-center gap-2.5">
      <div
        className="grid place-items-center rounded-2xl bg-primary shadow-elevated"
        style={{ width: size, height: size }}
        aria-hidden
      >
        <svg
          viewBox="0 0 24 24"
          width={size * 0.58}
          height={size * 0.58}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary-foreground"
        >
          <path d="M3 17h2l1-3h12l1 3h2" />
          <path d="M5 17v2a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-2" />
          <path d="M16 17v2a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-2" />
          <path d="M6 14l1.6-5.2A2 2 0 0 1 9.5 7.4h5a2 2 0 0 1 1.9 1.4L18 14" />
        </svg>
      </div>
      {withWordmark && (
        <span className="text-xl font-bold tracking-tight">
          Road<span className="text-primary">Fin</span>
        </span>
      )}
    </div>
  );
}
