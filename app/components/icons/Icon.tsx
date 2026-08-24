import Image from "next/image";
import type { ReactNode } from "react";

type AssetIconDefinition = Readonly<{ group: string; label: string; src: string }>;
type InlineIconDefinition = Readonly<{
  fill?: "none" | "currentColor";
  group: string;
  label: string;
  paths: ReactNode;
  stroke?: "currentColor" | "none";
  strokeWidth?: number;
  viewBox?: string;
}>;

export const ICONS = {
  email: { group: "Коммуникации", label: "Почта", src: "/brand/header/email.svg" },
  location: {
    group: "Коммуникации",
    label: "Геолокация",
    src: "/brand/header/location.svg",
  },
  phone: { group: "Коммуникации", label: "Телефон", src: "/brand/header/phone.svg" },
  search: { group: "Навигация", label: "Поиск", src: "/brand/header/search.svg" },
  languageGb: {
    group: "Навигация",
    label: "English",
    src: "/brand/header/flags/gb.svg",
  },
  languageRu: {
    group: "Навигация",
    label: "Русский язык",
    src: "/brand/header/flags/ru.svg",
  },
  socialMax: {
    group: "Социальные сети",
    label: "MAX",
    src: "/brand/header/social-max.svg",
  },
  socialOk: {
    group: "Социальные сети",
    label: "Одноклассники",
    src: "/brand/header/social-ok.svg",
  },
  socialRutube: {
    group: "Социальные сети",
    label: "Rutube",
    src: "/brand/header/social-rutube.svg",
  },
  socialVk: {
    group: "Социальные сети",
    label: "ВКонтакте",
    src: "/brand/header/social-vk.svg",
  },
  contactCardMark: {
    group: "Навигация",
    label: "Маркер контактной карточки",
    src: "/brand/contact-card-mark.svg",
  },
} as const satisfies Record<string, AssetIconDefinition>;

export const ACTION_ICONS = {
  calendar: {
    group: "Маршрут",
    label: "Календарь",
    strokeWidth: 1.75,
    paths: (
      <>
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M8 3v4M16 3v4M4 10h16" />
      </>
    ),
  },
  car: {
    group: "Маршрут",
    label: "Автомобиль",
    strokeWidth: 1.75,
    paths: (
      <>
        <path d="m4 15 1.8-5.4A2 2 0 0 1 7.7 8h8.6a2 2 0 0 1 1.9 1.6L20 15v4.5h-2.2v-2h-11v2H4z" />
        <path d="M4 15h16M8 15h.01M16 15h.01" />
      </>
    ),
  },
  check: {
    group: "Состояния",
    label: "Готово",
    paths: <path d="m7 12 3.2 3.2L17 8.5" />,
  },
  chevronDown: {
    group: "Навигация",
    label: "Раскрыть",
    paths: <path d="m8 10 4 4 4-4" />,
  },
  close: {
    group: "Действия",
    label: "Закрыть / очистить",
    paths: <path d="m8 8 8 8m0-8-8 8" />,
  },
  delete: {
    group: "Действия",
    label: "Удалить",
    paths: (
      <>
        <path d="M4 7h16M9 7V4h6v3m-9 0 1 13h10l1-13M10 11v5m4-5v5" />
      </>
    ),
  },
  drag: {
    group: "Действия",
    label: "Переместить",
    paths: (
      <>
        <circle cx="8" cy="6" r=".7" fill="currentColor" />
        <circle cx="16" cy="6" r=".7" fill="currentColor" />
        <circle cx="8" cy="12" r=".7" fill="currentColor" />
        <circle cx="16" cy="12" r=".7" fill="currentColor" />
        <circle cx="8" cy="18" r=".7" fill="currentColor" />
        <circle cx="16" cy="18" r=".7" fill="currentColor" />
      </>
    ),
  },
  edit: {
    group: "Действия",
    label: "Редактировать",
    paths: (
      <path d="m14.7 4.7 4.6 4.6M4 20l4.2-1 10.7-10.7a1.6 1.6 0 0 0 0-2.2l-1-1a1.6 1.6 0 0 0-2.2 0L5 15.8 4 20Z" />
    ),
  },
  expand: {
    group: "Навигация",
    label: "Развернуть",
    paths: <path d="M8 3H3v5M16 3h5v5M21 16v5h-5M3 16v5h5" />,
  },
  filter: {
    group: "Маршрут",
    label: "Фильтр",
    strokeWidth: 1.75,
    paths: <path d="M4 6h16M7 12h10M10 18h4" />,
  },
  fuel: {
    group: "Маршрут",
    label: "АЗС",
    strokeWidth: 1.75,
    paths: (
      <path d="M7 21h10M8 21V5a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v16M10 7h4M10 11h4M16 9h2a2 2 0 0 1 2 2v5" />
    ),
  },
  info: {
    group: "Состояния",
    label: "Информация",
    paths: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 11v5m0-8v.01" />
      </>
    ),
  },
  landmark: {
    group: "Маршрут",
    label: "Достопримечательность",
    strokeWidth: 1.75,
    paths: (
      <>
        <path d="M12 21s6-5.1 6-10a6 6 0 1 0-12 0c0 4.9 6 10 6 10Z" />
        <path d="m12 7 .9 2.1 2.3.2-1.7 1.5.5 2.2-2-1.2-2 1.2.5-2.2-1.7-1.5 2.3-.2L12 7Z" />
      </>
    ),
  },
  minus: { group: "Действия", label: "Уменьшить", paths: <path d="M8 12h8" /> },
  plus: {
    group: "Действия",
    label: "Добавить",
    paths: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 8v8M8 12h8" />
      </>
    ),
  },
  plusPlain: {
    group: "Личный кабинет",
    label: "Добавить госномер",
    paths: <path d="M12 4v16M4 12h16" />,
  },
  rest: {
    group: "Маршрут",
    label: "Отдых",
    strokeWidth: 1.75,
    paths: <path d="M4 15h16M6 15v4m12-4v4M7 13V8h10v5M7 11h10" />,
  },
  sparkle: {
    group: "Состояния",
    label: "Предложение",
    paths: <path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z" />,
  },
  warning: {
    group: "Состояния",
    label: "Предупреждение",
    paths: <path d="M12 6v8m0 4v.01" />,
  },
  transponder: {
    fill: "none",
    group: "Личный кабинет",
    label: "Транспондер T-pass",
    stroke: "none",
    viewBox: "90 45 220 260",
    paths: (
      <>
        <rect
          fill="var(--color-page)"
          height="230.33963"
          rx="13.599422"
          stroke="var(--color-brand-orange)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="4"
          strokeWidth="19.224823"
          transform="matrix(1,0,-0.19444649,0.98091313,0,0)"
          width="163.55885"
          x="127.90963"
          y="63.229168"
        />
        <path
          d="m130.911 117.883-6.498 27.718 119.932-11.597 6.236-27.043zM143.608 239.978l21.595-93.577h39.415l-22.22 95.976-16.396-13.597zM132.211 287.978l3.499-15.221-25.294-.387 51.987-30.393 37.591 31.192-25.994-1.2-3.867 15.982z"
          fill="var(--color-brand-orange)"
        />
        <path
          d="m160.513 240.973-1.945 9.281h4.42l1.988-9.281zM157.088 257.944l-1.945 9.281h4.42l1.988-9.281zM153.818 274.428l-1.945 9.281h4.42l1.989-9.281z"
          fill="var(--color-page)"
        />
      </>
    ),
  },
} as const satisfies Record<string, InlineIconDefinition>;

export type IconName = keyof typeof ICONS | keyof typeof ACTION_ICONS;
export const ICON_SIZES = [16, 24, 32] as const;
export type IconSize = (typeof ICON_SIZES)[number];

type IconProps = Readonly<{
  alt?: string;
  className?: string;
  name: IconName;
  size?: IconSize;
}>;

export function Icon({ alt = "", className, name, size = 24 }: IconProps) {
  if (name in ICONS) {
    const icon = ICONS[name as keyof typeof ICONS];
    return (
      <Image
        alt={alt}
        aria-hidden={alt ? undefined : true}
        className={className}
        height={size}
        src={icon.src}
        style={{ height: size, objectFit: "contain", width: size }}
        width={size}
      />
    );
  }

  const icon: InlineIconDefinition = ACTION_ICONS[name as keyof typeof ACTION_ICONS];
  return (
    <svg
      aria-hidden={alt ? undefined : true}
      aria-label={alt || undefined}
      className={className}
      fill={icon.fill ?? "none"}
      focusable="false"
      height={size}
      role={alt ? "img" : undefined}
      stroke={icon.stroke ?? "currentColor"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={icon.strokeWidth ?? 1.5}
      viewBox={icon.viewBox ?? "0 0 24 24"}
      width={size}
    >
      {icon.paths}
    </svg>
  );
}
