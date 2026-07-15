export type NavigationItem = Readonly<{
  label: string;
  href: `https://${string}`;
}>;

export const PRIMARY_NAVIGATION = [
  { label: "О компании", href: "https://russianhighways.ru/about/" },
  { label: "Пресс-центр", href: "https://www.russianhighways.ru/press/" },
  {
    label: "Пользователям автодорог",
    href: "https://russianhighways.ru/for_drivers/",
  },
  { label: "Партнерам", href: "https://russianhighways.ru/for_investor/" },
  { label: "Закупки", href: "https://russianhighways.ru/tenders/?tab=1" },
] as const satisfies readonly NavigationItem[];

export const MORE_NAVIGATION = [
  {
    label: "Документы",
    href: "https://russianhighways.ru/about/regulatory-information/disc_inform/",
  },
  {
    label: "Реализация",
    href: "https://russianhighways.ru/tenders/?tab=1",
  },
  { label: "Поддержка МСП", href: "https://russianhighways.ru/msp/" },
] as const satisfies readonly NavigationItem[];

export const HERO_ACTIONS = [
  {
    label: "Оплатить проезд",
    href: "https://russianhighways.ru/for_drivers/",
  },
  {
    label: "Калькулятор маршрута",
    href: "https://russianhighways.ru/for_drivers/calculation/",
  },
  { label: "Программа лояльности", href: "https://tpass.me/" },
  { label: "Тарифы", href: "https://russianhighways.ru/for_drivers/" },
] as const satisfies readonly NavigationItem[];

export const SERVICES = [
  {
    id: "route-calculator",
    nodeId: "1767:7222",
    title: "Калькулятор маршрута",
    description: "Расчёт маршрута и стоимости поездки по платным участкам.",
    href: "https://russianhighways.ru/for_drivers/calculation/",
  },
  {
    id: "mobile-app",
    nodeId: "1767:7231",
    title: "Мобильное приложение",
    description: "Дорожные сервисы оператора доступны на официальном портале T-pass.",
    href: "https://tpass.me/",
  },
  {
    id: "max",
    nodeId: "1767:7237",
    title: "MAX",
    description: "Официальный канал Государственной компании в MAX.",
    href: "https://max.ru/avtodorgk",
  },
  {
    id: "legal-account",
    nodeId: "1767:7241",
    title: "Личный кабинет юридических лиц",
    description: "Вход в кабинет для управления услугами и документами организации.",
    href: "https://avtodor-tr.ru/account/",
  },
  {
    id: "online-store",
    nodeId: "1767:7247",
    title: "Интернет-магазин",
    description: "Устройства и услуги для проезда по платным дорогам.",
    href: "https://tpass.me/",
  },
  {
    id: "plate-payment",
    nodeId: "1767:7253",
    title: "Оплата проезда по номеру автомобиля",
    description:
      "Проверка начисления и оплата проезда без транспондера по государственному номеру автомобиля.",
    href: "https://russianhighways.ru/for_drivers/",
  },
] as const;

export const NEWS = [
  {
    date: "14 июля 2026",
    title:
      "Михаил Мишустин встретился с председателем правления государственной компании «Автодор» Вячеславом Петушенко",
    href: "https://russianhighways.ru/press/news/149487/",
  },
  {
    date: "10 июля 2026",
    title:
      "Глава Автодора и губернатор Пермского края обсудили перспективы развития региона",
    href: "https://russianhighways.ru/press/news/149367/",
  },
  {
    date: "9 июля 2026",
    title: "Автодор поздравил выпускников МАДИ с окончанием университета",
    href: "https://russianhighways.ru/press/news/149323/",
  },
  {
    date: "8 июля 2026",
    title:
      "Госкомпания «Автодор» и Правительство Псковской области будут развивать дорожный сервис для автотуристов",
    href: "https://russianhighways.ru/press/news/149261/",
  },
  {
    date: "8 июля 2026",
    title: "За пять лет на ЦКАД зафиксировано около 410 млн проездов",
    href: "https://russianhighways.ru/press/news/149242/",
  },
] as const;

export const CONTACT_TABS = [
  {
    id: "state-company",
    label: "Гос компания",
    name: "Государственная компания «Автодор»",
    phone: "+7 (495) 727-11-95",
    email: "info@russianhighways.ru",
    href: "https://www.russianhighways.ru/about/structure/",
    status: "verified",
  },
  {
    id: "management-company",
    label: "ООО УК «Автодор»",
    name: "ООО УК «Автодор»",
    phone: "+7 (495) 249-06-95",
    email: null,
    href: "https://avtodor-mc.ru/",
    status: "partial",
  },
  {
    id: "avtodor-tp",
    label: "ООО «АВТОДОР-ТП»",
    name: "ООО «АВТОДОР-ТП»",
    phone: "+7 (495) 249-07-17",
    email: null,
    href: "https://www.russianhighways.ru/about/affiliates/",
    status: "partial",
  },
  {
    id: "toll-roads",
    label: "ООО «АВТОДОР - ПЛАТНЫЕ ДОРОГИ»",
    name: "ООО «Автодор - Платные Дороги»",
    phone: null,
    email: null,
    href: "https://www.russianhighways.ru/about/affiliates/",
    status: "source-gated",
  },
  {
    id: "avtodor-up",
    label: "ООО «АВТОДОР-УП»",
    name: "ООО «АВТОДОР-УП»",
    phone: null,
    email: null,
    href: "https://www.russianhighways.ru/about/affiliates/",
    status: "source-gated",
  },
  {
    id: "engineering",
    label: "ООО «АВТОДОР - ИНЖИНИРИНГ»",
    name: "ООО «АВТОДОР - ИНЖИНИРИНГ»",
    phone: null,
    email: null,
    href: "https://www.russianhighways.ru/about/affiliates/",
    status: "source-gated",
  },
  {
    id: "sk-avtodor",
    label: "ООО «СК АВТОДОР»",
    name: "ООО «СК АВТОДОР»",
    phone: null,
    email: null,
    href: "https://www.russianhighways.ru/about/affiliates/",
    status: "source-gated",
  },
] as const;

export const SUBSIDIARY_SERVICES = [
  {
    id: "management",
    company: "ООО УК «Автодор»",
    service: "Управление инфраструктурными активами",
    description: "Проверенный контакт и официальный сайт управляющей компании.",
    href: "https://avtodor-mc.ru/",
  },
  {
    id: "toll-operations",
    company: "ООО «Автодор - Платные Дороги»",
    service: "Операторская деятельность",
    description: "Взимание платы, T-pass и клиентские сервисы.",
    href: "https://www.russianhighways.ru/about/affiliates/",
  },
  {
    id: "transport-projects",
    company: "ООО «АВТОДОР-ТП»",
    service: "Транспортные проекты",
    description: "Проверенный телефон опубликован в реестре дочерних обществ.",
    href: "https://www.russianhighways.ru/about/affiliates/",
  },
  {
    id: "road-maintenance",
    company: "Дорожно-эксплуатационные предприятия",
    service: "Ремонт и содержание дорог",
    description: "АО «ДЭП № 17», АО «ДЭП № 22» и АО «ДЭП № 73».",
    href: "https://www.russianhighways.ru/about/affiliates/",
  },
] as const;

export const SOCIAL_LINKS = [
  { label: "Rutube", href: "https://rutube.ru/channel/24811017/" },
  { label: "ВКонтакте", href: "https://vk.com/gkavtodor" },
  { label: "Telegram", href: "https://t.me/avtodorgk" },
  { label: "Одноклассники", href: "https://ok.ru/gkavtodor" },
  { label: "MAX", href: "https://max.ru/avtodorgk" },
] as const satisfies readonly NavigationItem[];

export const GOVERNMENT_LINKS = [
  {
    label: "Правительство России",
    href: "http://government.ru/",
    image: "/brand/government-rf.png",
  },
  {
    label: "Минтранс России",
    href: "https://mintrans.gov.ru/",
    image: "/brand/mintrans-rf.png",
  },
  {
    label: "Стройкомплекс России",
    href: "https://stroi.gov.ru/",
    image: "/brand/moscow-construction.png",
  },
] as const;
