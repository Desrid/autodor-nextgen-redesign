import type { HeaderLink as NavigationItem } from "./header-navigation";

export { PRIMARY_NAVIGATION } from "./header-navigation";

export const MORE_NAVIGATION = [
  {
    label: "Документы",
    href: "https://russianhighways.ru/about/regulatory-information/disc_inform/",
  },
  { label: "Реализация", href: "https://russianhighways.ru/tenders/?tab=1" },
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
    dateTime: "2026-07-14",
    date: "14 июля 2026",
    title:
      "Михаил Мишустин встретился с\u00a0председателем правления государственной компании «Автодор» Вячеславом Петушенко",
    href: "https://russianhighways.ru/press/news/149487/",
    image: "/media/news/government-meeting-patriotic.png",
    imageAlt:
      "Сгенерированный образ совещания по дорожной инфраструктуре с российским триколором; не является документальной съёмкой встречи",
  },
  {
    dateTime: "2026-07-10",
    date: "10 июля 2026",
    title:
      "Глава Автодора и\u00a0губернатор Пермского края обсудили перспективы развития региона",
    href: "https://russianhighways.ru/press/news/149367/",
    image: "/media/news/perm-development.png",
    imageAlt:
      "Сгенерированная панорама современной автомагистрали в лесном ландшафте; не является снимком конкретного участка",
  },
  {
    dateTime: "2026-07-09",
    date: "9 июля 2026",
    title: "Автодор поздравил выпускников МАДИ с\u00a0окончанием университета",
    href: "https://russianhighways.ru/press/news/149323/",
    image: "/media/news/madi-graduates.png",
    imageAlt:
      "Сгенерированная иллюстрация выпускников дорожного инженерного направления с чертежами и касками",
  },
  {
    dateTime: "2026-07-08",
    date: "8 июля 2026",
    title:
      "Госкомпания «Автодор» и\u00a0Правительство Псковской области будут развивать дорожный сервис для\u00a0автотуристов",
    href: "https://russianhighways.ru/press/news/149261/",
    image: "/media/news/pskov-roadside.png",
    imageAlt:
      "Сгенерированная иллюстрация современного придорожного сервиса для автотуристов в сосновом лесу",
  },
  {
    dateTime: "2026-07-08",
    date: "8 июля 2026",
    title: "За\u00a0пять лет на\u00a0ЦКАД зафиксировано около 410 млн проездов",
    href: "https://russianhighways.ru/press/news/149242/",
    image: "/media/news/ckad-traffic.png",
    imageAlt:
      "Сгенерированный вид сверху на загруженную многоуровневую дорожную развязку; не является снимком ЦКАД",
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
  {
    label: "Rutube",
    href: "https://rutube.ru/channel/24811017/",
    image: "/brand/social-rutube.svg",
    nodeId: "1767:8067",
  },
  {
    label: "ВКонтакте",
    href: "https://vk.com/gkavtodor",
    image: "/brand/social-vk.svg",
    nodeId: "1767:8071",
  },
  {
    label: "Одноклассники",
    href: "https://ok.ru/gkavtodor",
    image: "/brand/social-ok.svg",
    nodeId: "1767:8075",
  },
  {
    label: "MAX",
    href: "https://max.ru/avtodorgk",
    image: "/brand/social-max.svg",
    nodeId: "1767:8082",
  },
] as const;

export const GOVERNMENT_LINKS = [
  {
    label: "Правительство России",
    href: "http://government.ru/",
    image: "/brand/government-rf.svg",
    width: 72,
    nodeId: "1767:8086",
  },
  {
    label: "Минтранс России",
    href: "https://mintrans.gov.ru/",
    image: "/brand/mintrans-rf.svg",
    width: 59,
    nodeId: "1767:8249",
  },
  {
    label: "Стройкомплекс России",
    href: "https://stroi.gov.ru/",
    image: "/brand/construction-rf.svg",
    width: 103,
    nodeId: "1767:9202",
  },
] as const;
