import Image from "next/image";

type LogoDefinition = Readonly<{
  label: string;
  src: string;
}>;

export const LOGOS = {
  constructionRf: { label: "Строительство РФ", src: "/brand/construction-rf.svg" },
  gosuslugi: { label: "Госуслуги", src: "/brand/gosuslugi.svg" },
  governmentRf: { label: "Правительство РФ", src: "/brand/government-rf.svg" },
  mintransRf: { label: "Минтранс РФ", src: "/brand/mintrans-rf.svg" },
  presidentRussia: { label: "Президент России", src: "/brand/president-russia.svg" },
  rostransnadzor: { label: "Ространснадзор", src: "/brand/rostransnadzor.svg" },
} as const satisfies Record<string, LogoDefinition>;

export type LogoName = keyof typeof LOGOS;

export const AUTODOR_LOGO_VARIANTS = {
  full: { label: "Полный", ratio: 725.9 / 123.2, src: "/brand/autodor-logo.svg" },
  footer: {
    label: "Для footer без герба",
    ratio: 241.029 / 37.8955,
    src: "/brand/autodor-logo-footer.svg",
  },
  mark: {
    label: "Знак без текста",
    ratio: 64.721 / 37.526,
    src: "/brand/autodor-mark.svg",
  },
} as const satisfies Record<string, LogoDefinition & Readonly<{ ratio: number }>>;

export type AutodorLogoVariant = keyof typeof AUTODOR_LOGO_VARIANTS;

type AutodorLogoProps = Readonly<{
  alt?: string;
  className?: string;
  height?: number;
  variant?: AutodorLogoVariant;
}>;

/** Единый знак Автодора для шапки, footer и компактных применений. */
export function AutodorLogo({
  alt = "Автодор",
  className,
  height = 48,
  variant = "full",
}: AutodorLogoProps) {
  const logo = AUTODOR_LOGO_VARIANTS[variant];
  const width = Math.round(height * logo.ratio);

  return (
    <Image
      alt={alt}
      className={className}
      height={height}
      src={logo.src}
      style={{ height, objectFit: "contain", width }}
      width={width}
    />
  );
}

type LogoProps = Readonly<{
  alt?: string;
  className?: string;
  name: LogoName;
  size?: number;
}>;

export function Logo({ alt = "", className, name, size = 96 }: LogoProps) {
  const logo = LOGOS[name];

  return (
    <Image
      alt={alt}
      aria-hidden={alt ? undefined : true}
      className={className}
      height={size}
      src={logo.src}
      style={{ height: size, objectFit: "contain", width: size }}
      width={size}
    />
  );
}
