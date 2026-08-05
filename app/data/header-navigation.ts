export type HeaderHref = `https://${string}` | `mailto:${string}` | `tel:${string}`;

export type HeaderLink = Readonly<{
  label: string;
  href: HeaderHref;
}>;

export type HeaderNavigationGroup = Readonly<{
  title: string;
  links: readonly HeaderLink[];
}>;

export const PRIMARY_NAVIGATION = [
  { label: "О компании", href: "https://russianhighways.ru/about/" },
  { label: "Пресс-центр", href: "https://russianhighways.ru/press/" },
  {
    label: "Пользователям автодорог",
    href: "https://russianhighways.ru/for_drivers/",
  },
  { label: "Партнёрам", href: "https://russianhighways.ru/for_investor/" },
  { label: "Закупки", href: "https://russianhighways.ru/tenders/?tab=1" },
] as const satisfies readonly HeaderLink[];

export const HEADER_NAVIGATION_GROUPS = [
  {
    title: "Дочерние общества",
    links: [
      { label: "ООО УК «Автодор»", href: "https://avtodor-mc.ru/" },
      { label: "ООО «АВТОДОР-ТП»", href: "https://etp-avtodor.ru/" },
      {
        label: "ООО «АВТОДОР - ПЛАТНЫЕ ДОРОГИ»",
        href: "https://avtodor-tr.ru/",
      },
      {
        label: "ООО «АВТОДОР-УП»",
        href: "https://russianhighways.ru/about/affiliates/",
      },
      {
        label: "ООО «АВТОДОР - ИНЖИНИРИНГ»",
        href: "https://avtodor-eng.ru/",
      },
      { label: "ООО «СК АВТОДОР»", href: "https://skavtodor.ru/" },
    ],
  },
  {
    title: "Федеральные трассы",
    links: [
      { label: "Сеть дорог", href: "https://russianhighways.ru/for_drivers/?tab=1" },
      {
        label: "М-1 «Беларусь»",
        href: "https://russianhighways.ru/for_drivers/?tab=2",
      },
      { label: "М-3 «Украина»", href: "https://russianhighways.ru/for_drivers/?tab=3" },
      { label: "М-11 «Нева»", href: "https://russianhighways.ru/for_drivers/?tab=5" },
      { label: "М-4 «Дон»", href: "https://russianhighways.ru/for_drivers/?tab=4" },
      { label: "М-12 «Восток»", href: "https://russianhighways.ru/for_drivers/?tab=6" },
      { label: "А-113 ЦКАД", href: "https://russianhighways.ru/for_drivers/?tab=7" },
      { label: "А-289", href: "https://russianhighways.ru/for_drivers/?tab=8" },
      {
        label: "А-105 Москва-Домодедово",
        href: "https://russianhighways.ru/for_drivers/?tab=9",
      },
      { label: "А-107 «ММК»", href: "https://russianhighways.ru/for_drivers/?tab=10" },
    ],
  },
  {
    title: "Информация о дорогах",
    links: [
      {
        label: "Грузоперевозчикам",
        href: "https://russianhighways.ru/for_drivers/gruzoperevozchikam/",
      },
      {
        label: "Ремонтные работы",
        href: "https://russianhighways.ru/for_drivers/remontnye-raboty/",
      },
      {
        label: "Проезд школьных автобусов",
        href: "https://russianhighways.ru/for_drivers/proezd-shkolnykh-avtobusov/",
      },
      {
        label: "Помощь на дороге",
        href: "https://russianhighways.ru/for_drivers/pomoshch-na-doroge/",
      },
      {
        label: "Расчет стоимости работы",
        href: "https://russianhighways.ru/for_drivers/calculation/",
      },
      {
        label: "Договор об организации проезда",
        href: "https://russianhighways.ru/for_drivers/dogovor-ob-organizatsii-proezda/",
      },
    ],
  },
  {
    title: "Инвесторам",
    links: [
      {
        label: "Инвестиционные проекты",
        href: "https://russianhighways.ru/for_investor/investment_projects/",
      },
      {
        label: "Ценные бумаги",
        href: "https://russianhighways.ru/for_investor/documents/",
      },
      {
        label: "Раскрытие информации",
        href: "https://russianhighways.ru/about/regulatory-information/disc_inform/",
      },
      {
        label: "Существенные факты",
        href: "https://russianhighways.ru/about/regulatory-information/facts/",
      },
      {
        label: "Инсайдерам Госкомпании",
        href: "https://russianhighways.ru/for_investor/disclosure/insayderam",
      },
      {
        label: "Реквизиты",
        href: "https://russianhighways.ru/for_investor/disclosure/requisite",
      },
    ],
    secondary: {
      title: "Поддержка субъектов МСП",
      links: [
        {
          label: "Информация для субъектов МСП",
          href: "https://russianhighways.ru/tenders/procurement/small-business-info/",
        },
        {
          label: "Партнерство с субъектами МСП",
          href: "https://russianhighways.ru/msp/program/",
        },
        {
          label: "Деятельность экспертного совета",
          href: "https://russianhighways.ru/msp/?tab=3",
        },
      ],
    },
  },
  {
    title: "Документация",
    links: [
      {
        label: "Центральный аппарат и филиалы",
        href: "https://russianhighways.ru/about/structure/",
      },
      {
        label: "Дочерние общества",
        href: "https://russianhighways.ru/about/affiliates/",
      },
      {
        label: "Деятельность компании",
        href: "https://russianhighways.ru/about/activity/",
      },
      {
        label: "Антимонопольный комплекс",
        href: "https://russianhighways.ru/about/antimonopolnyy-komplaens/",
      },
      {
        label: "Противодействие коррупции",
        href: "https://russianhighways.ru/about/anti-corruption/",
      },
      {
        label: "Нормативно-правовая информация",
        href: "https://russianhighways.ru/about/regulatory-information/",
      },
      {
        label: "Отозванные доверенности",
        href: "https://russianhighways.ru/about/otozvannye-doverennosti/",
      },
    ],
  },
] as const satisfies readonly (HeaderNavigationGroup & {
  secondary?: HeaderNavigationGroup;
})[];

export const HEADER_SOCIAL_LINKS = [
  {
    label: "Rutube",
    href: "https://rutube.ru/channel/24811017/",
    image: "/brand/header/social-rutube.svg",
  },
  {
    label: "ВКонтакте",
    href: "https://vk.com/gkavtodor",
    image: "/brand/header/social-vk.svg",
  },
  {
    label: "Одноклассники",
    href: "https://ok.ru/gkavtodor",
    image: "/brand/header/social-ok.svg",
  },
  {
    label: "MAX",
    href: "https://max.ru/avtodorgk",
    image: "/brand/header/social-max.svg",
  },
] as const;

export const HEADER_CONTACTS = {
  copyright: "© 2009–2026 Государственная компания «Российские автомобильные дороги»",
  address: "Москва, Страстной бульвар, 9",
  email: {
    label: "info@russianhighways.ru",
    href: "mailto:info@russianhighways.ru",
  },
  phone: {
    label: "+7 495 727-11-95",
    href: "tel:+74957271195",
  },
} as const;
