import Image from "next/image";
import type { ReactNode } from "react";

type AssetIconDefinition = Readonly<{ group: string; label: string; src: string }>;
type InlineIconDefinition = Readonly<{
  group: string;
  label: string;
  paths: ReactNode;
}>;

export const ICONS = {
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
  appsGrid: {
    group: "Навигация",
    label: "Все сервисы",
    paths: (
      <path d="M7 7h.01M12 7h.01M17 7h.01M7 12h.01M12 12h.01M17 12h.01M7 17h.01M12 17h.01M17 17h.01" />
    ),
  },
  arrowDown: {
    group: "Навигация",
    label: "Стрелка вниз",
    paths: <path d="M12 5v14m-6-6 6 6 6-6" />,
  },
  arrowLeft: {
    group: "Навигация",
    label: "Стрелка влево",
    paths: <path d="M19 12H5m6-6-6 6 6 6" />,
  },
  arrowRight: {
    group: "Навигация",
    label: "Стрелка вправо",
    paths: <path d="M5 12h14m-6-6 6 6-6 6" />,
  },
  arrowUp: {
    group: "Навигация",
    label: "Стрелка вверх",
    paths: <path d="M12 19V5m-6 6 6-6 6 6" />,
  },
  bell: {
    group: "Коммуникации",
    label: "Уведомления",
    paths: (
      <path d="M6.5 16.5h11l-1.4-2.1V10a4.1 4.1 0 0 0-8.2 0v4.4l-1.4 2.1ZM10 19a2.2 2.2 0 0 0 4 0" />
    ),
  },
  calendar: {
    group: "Маршрут",
    label: "Календарь",
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
    paths: (
      <>
        <path d="m4 15 1.8-5.4A2 2 0 0 1 7.7 8h8.6a2 2 0 0 1 1.9 1.6L20 15v4.5h-2.2v-2h-11v2H4z" />
        <path d="M4 15h16M8 15h.01M16 15h.01" />
      </>
    ),
  },
  chat: {
    group: "Коммуникации",
    label: "Обратная связь",
    paths: (
      <>
        <path
          className="icon-chat__bubble"
          d="M9 9h8a2.5 2.5 0 0 1 2.5 2.5V16a2.5 2.5 0 0 1-2.5 2.5h-3L11 21v-2.5H9A2.5 2.5 0 0 1 6.5 16v-4.5A2.5 2.5 0 0 1 9 9Z"
        />
        <path
          className="icon-chat__bubble"
          d="M6 3.5h8A2.5 2.5 0 0 1 16.5 6v4.5A2.5 2.5 0 0 1 14 13h-4.5l-3 3v-3H6a2.5 2.5 0 0 1-2.5-2.5V6A2.5 2.5 0 0 1 6 3.5Z"
        />
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
  chevronRight: {
    group: "Навигация",
    label: "Вперёд",
    paths: <path d="m10 8 4 4-4 4" />,
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
  details: {
    group: "Действия",
    label: "Детализация",
    paths: (
      <>
        <path d="M6.5 3.5h7l4 4v13h-11Z" />
        <path d="M13.5 3.5v4h4M9 12h6M9 15.5h5" />
      </>
    ),
  },
  download: {
    group: "Действия",
    label: "Скачать",
    paths: <path d="M12 4v10m0 0 4-4m-4 4-4-4M5 19h14" />,
  },
  drag: {
    group: "Действия",
    label: "Переместить",
    paths: (
      <>
        <path d="M8 5.5v1M16 5.5v1M8 11.5v1M16 11.5v1M8 17.5v1M16 17.5v1" />
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
  email: {
    group: "Коммуникации",
    label: "Почта",
    paths: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2.5" />
        <path d="m4 7 8 6 8-6" />
      </>
    ),
  },
  expand: {
    group: "Навигация",
    label: "Развернуть",
    paths: <path d="M8 3H3v5M16 3h5v5M21 16v5h-5M3 16v5h5" />,
  },
  externalLink: {
    group: "Навигация",
    label: "Внешняя ссылка",
    paths: (
      <path d="M14 5h5v5M19 5l-8 8M11 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-5" />
    ),
  },
  filter: {
    group: "Маршрут",
    label: "Фильтр",
    paths: <path d="M4 6h16M7 12h10M10 18h4" />,
  },
  fuel: {
    group: "Маршрут",
    label: "АЗС",
    paths: (
      <path d="M7 21h10M8 21V5a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v16M10 7h4M10 11h4M16 9h2a2 2 0 0 1 2 2v5" />
    ),
  },
  globe: {
    group: "Коммуникации",
    label: "Веб-сайт",
    paths: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M3.5 12h17M12 3.5c2.2 2.3 3.3 5.1 3.3 8.5S14.2 18.2 12 20.5C9.8 18.2 8.7 15.4 8.7 12S9.8 5.8 12 3.5Z" />
      </>
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
  help: {
    group: "Коммуникации",
    label: "Помощь",
    paths: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M9.8 9.2a2.45 2.45 0 1 1 4.13 1.8c-.97.85-1.93 1.3-1.93 2.75M12 17v.01" />
      </>
    ),
  },
  landmark: {
    group: "Маршрут",
    label: "Достопримечательность",
    paths: (
      <>
        <path d="M12 21s6-5.1 6-10a6 6 0 1 0-12 0c0 4.9 6 10 6 10Z" />
        <path d="m12 7 .9 2.1 2.3.2-1.7 1.5.5 2.2-2-1.2-2 1.2.5-2.2-1.7-1.5 2.3-.2L12 7Z" />
      </>
    ),
  },
  minus: { group: "Действия", label: "Уменьшить", paths: <path d="M8 12h8" /> },
  location: {
    group: "Коммуникации",
    label: "Геолокация",
    paths: (
      <>
        <path d="M12 21s6-5.1 6-10a6 6 0 1 0-12 0c0 4.9 6 10 6 10Z" />
        <circle cx="12" cy="11" r="2.25" />
      </>
    ),
  },
  move: {
    group: "Действия",
    label: "Переместить",
    paths: <path d="M4 8h12m-3.5-3.5L16 8l-3.5 3.5M20 16H8m3.5-3.5L8 16l3.5 3.5" />,
  },
  pause: {
    group: "Медиа",
    label: "Пауза",
    paths: <path d="M8 5v14M16 5v14" />,
  },
  phone: {
    group: "Коммуникации",
    label: "Телефон",
    paths: (
      <path d="M7.2 4.5 9.5 8 8 9.5c1.2 2.6 3.9 5.3 6.5 6.5l1.5-1.5 3.5 2.3v2.1c0 .9-.7 1.6-1.6 1.6C10 20.5 3.5 14 3.5 6.1c0-.9.7-1.6 1.6-1.6h2.1Z" />
    ),
  },
  play: {
    group: "Медиа",
    label: "Воспроизвести",
    paths: <path d="M8 5.5v13L19 12 8 5.5Z" />,
  },
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
  search: {
    group: "Навигация",
    label: "Поиск",
    paths: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m15.5 15.5 4.5 4.5" />
      </>
    ),
  },
  rest: {
    group: "Маршрут",
    label: "Отдых",
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
  vehicle: {
    group: "Личный кабинет",
    label: "Транспортное средство",
    paths: (
      <>
        <path d="M4 8.5h16v9H4Z" />
        <path d="m8 8.5 1.5-3h5l1.5 3M8 17h.01M16 17h.01" />
      </>
    ),
  },
  volume: {
    group: "Медиа",
    label: "Звук включён",
    paths: (
      <>
        <path d="M4 10h4l5-4v12l-5-4H4Z" />
        <path d="M16.5 9.5c1.4 1.4 1.4 3.6 0 5M18.5 7.5c2.3 2.5 2.3 6.5 0 9" />
      </>
    ),
  },
  volumeMuted: {
    group: "Медиа",
    label: "Звук выключен",
    paths: (
      <>
        <path d="M4 10h4l5-4v12l-5-4H4Z" />
        <path d="m17 9 4 6m0-6-4 6" />
      </>
    ),
  },
} as const satisfies Record<string, InlineIconDefinition>;

export type IconName = keyof typeof ICONS | keyof typeof ACTION_ICONS;
export const ICON_SIZES = [16, 20, 24, 32] as const;
export type IconSize = (typeof ICON_SIZES)[number];

type IconProps = Readonly<{
  alt?: string;
  className?: string;
  label?: string;
  name: IconName;
  size?: IconSize;
}>;

export function Icon({ alt = "", className, label, name, size = 24 }: IconProps) {
  if (alt && label) {
    throw new Error("Icon accepts either alt or label, not both.");
  }

  const accessibleName = label ?? alt;

  if (name in ICONS) {
    const icon = ICONS[name as keyof typeof ICONS];
    return (
      <Image
        alt={accessibleName}
        aria-hidden={accessibleName ? undefined : true}
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
      aria-hidden={accessibleName ? undefined : true}
      aria-label={accessibleName || undefined}
      className={className}
      fill="none"
      focusable="false"
      height={size}
      role={accessibleName ? "img" : undefined}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.75}
      viewBox="0 0 24 24"
      width={size}
    >
      {icon.paths}
    </svg>
  );
}
