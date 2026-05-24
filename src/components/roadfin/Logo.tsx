import logoSrc from "@/assets/roadfin-logo-light.png";

type Props = {
  size?: number;
  withWordmark?: boolean;
  impact?: boolean;
};

/**
 * Logo oficial RoadFin.
 * - `size` controla a ALTURA da logo (proporção mantida).
 * - `withWordmark`: quando false, exibe apenas o ícone do carro recortado.
 * - `impact`: quando true, aplica halo/glow verde para máxima presença.
 */
export function Logo({ size = 40, withWordmark = true, impact = false }: Props) {
  const glow = impact
    ? "drop-shadow(0 0 24px rgba(99,215,42,0.55)) drop-shadow(0 8px 28px rgba(99,215,42,0.25))"
    : undefined;

  if (!withWordmark) {
    return (
      <div
        className="overflow-hidden"
        style={{ width: size * 1.6, height: size }}
        aria-label="RoadFin"
      >
        <img
          src={logoSrc}
          alt=""
          className="select-none"
          style={{
            height: size * 2.2,
            width: "auto",
            objectFit: "cover",
            objectPosition: "center top",
            marginTop: -size * 0.1,
            filter: glow,
          }}
          draggable={false}
        />
      </div>
    );
  }

  return (
    <img
      src={logoSrc}
      alt="RoadFin"
      draggable={false}
      className="select-none object-contain dark:rounded-2xl dark:bg-white dark:px-3 dark:py-1.5"
      style={{ height: size, width: "auto", filter: glow }}
    />
  );
}
