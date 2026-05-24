import logoSrc from "@/assets/roadfin-logo-light.png";

type Props = {
  size?: number;
  withWordmark?: boolean;
};

/**
 * Logo oficial RoadFin.
 * - `size` controla a ALTURA da logo (proporção mantida ~16:10).
 * - `withWordmark`: quando false, exibe apenas o ícone do carro recortado.
 * No tema escuro, a logo é exibida sobre uma pílula clara para preservar
 * legibilidade da palavra "Road" (preta na arte oficial).
 */
export function Logo({ size = 40, withWordmark = true }: Props) {
  if (!withWordmark) {
    // Ícone-only: recorta apenas a porção do carro usando object-position.
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
      style={{ height: size, width: "auto" }}
    />
  );
}
