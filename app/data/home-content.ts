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
    actionLabel:
      "\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u0441\u0435\u0440\u0432\u0438\u0441",
  },
  {
    id: "mobile-app",
    nodeId: "1767:7231",
    title: "Мобильное приложение",
    description: "Дорожные сервисы оператора доступны на официальном портале T-pass.",
    href: "https://tpass.me/",
    actionLabel:
      "\u041f\u0435\u0440\u0435\u0439\u0442\u0438 \u043d\u0430 \u043f\u043e\u0440\u0442\u0430\u043b T-pass",
  },
  {
    id: "max",
    nodeId: "1767:7237",
    title: "MAX",
    description: "Официальный канал Государственной компании в MAX.",
    href: "https://max.ru/avtodorgk",
    actionLabel:
      "\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u043a\u0430\u043d\u0430\u043b \u0432 MAX",
  },
  {
    id: "legal-account",
    nodeId: "1767:7241",
    title: "Личный кабинет юридических лиц",
    description: "Вход в кабинет для управления услугами и документами организации.",
    href: "https://avtodor-tr.ru/account/",
    actionLabel:
      "\u0412\u043e\u0439\u0442\u0438 \u0432 \u043b\u0438\u0447\u043d\u044b\u0439 \u043a\u0430\u0431\u0438\u043d\u0435\u0442",
  },
  {
    id: "online-store",
    nodeId: "1767:7247",
    title: "Интернет-магазин",
    description: "Устройства и услуги для проезда по платным дорогам.",
    href: "https://tpass.me/",
    actionLabel:
      "\u041f\u0435\u0440\u0435\u0439\u0442\u0438 \u0432 \u0438\u043d\u0442\u0435\u0440\u043d\u0435\u0442-\u043c\u0430\u0433\u0430\u0437\u0438\u043d",
  },
  {
    id: "plate-payment",
    nodeId: "1767:7253",
    title: "Оплата проезда по номеру автомобиля",
    description:
      "Проверка начисления и оплата проезда без транспондера по государственному номеру автомобиля.",
    href: "https://russianhighways.ru/for_drivers/",
    actionLabel:
      "\u041f\u0435\u0440\u0435\u0439\u0442\u0438 \u043a \u043e\u043f\u043b\u0430\u0442\u0435 \u043f\u0440\u043e\u0435\u0437\u0434\u0430",
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
  },
  {
    id: "management-company",
    label: "ООО УК «Автодор»",
    name: "ООО УК «Автодор»",
    phone: "+7 (495) 249-06-95",
    email: "avtodor-mc@ru",
    href: "https://avtodor-mc.ru/",
  },
  {
    id: "avtodor-tp",
    label: "ООО «АВТОДОР-ТП»",
    name: "ООО «АВТОДОР-ТП»",
    phone: "+7 (495) 000-00-00",
    email: "info@avtodor-tp.ru",
    href: "https://www.russianhighways.ru/about/affiliates/",
  },
  {
    id: "toll-roads",
    label: "ООО «АВТОДОР — Платные дороги»",
    name: "ООО «АВТОДОР — Платные дороги»",
    phone: "8 (800) 707-23-23",
    email: "info@avtodor-tr.ru",
    href: "https://www.russianhighways.ru/about/affiliates/",
  },
  {
    id: "avtodor-up",
    label: "ООО «АВТОДОР-УП»",
    name: "ООО «АВТОДОР-УП»",
    phone: "+7 (495) 000-00-00",
    email: "info@avtodor-up.ru",
    href: "https://www.russianhighways.ru/about/affiliates/",
  },
  {
    id: "engineering",
    label: "ООО «АВТОДОР — Инжиниринг»",
    name: "ООО «АВТОДОР — Инжиниринг»",
    phone: "+7 (495) 000-00-00",
    email: "info@avtodor-e.ru",
    href: "https://www.russianhighways.ru/about/affiliates/",
  },
  {
    id: "sk-avtodor",
    label: "ООО «СК АВТОДОР»",
    name: "ООО «СК АВТОДОР»",
    phone: "+7 (495) 000-00-00",
    email: "info@sk-avtodor.ru",
    href: "https://www.russianhighways.ru/about/affiliates/",
  },
] as const;

export const SUBSIDIARY_SERVICES = [
  {
    id: "management",
    company: "ООО УК «Автодор»",
    service: "Управление инфраструктурными активами",
    description: "Проверенный контакт и официальный сайт управляющей компании.",
    category: "Управляющая компания",
    offerings: ["Инвестиционные проекты", "Управление активами"],
    linkLabel: "Официальный сайт УК «Автодор»",
    href: "https://avtodor-mc.ru/",
  },
  {
    id: "toll-operations",
    company: "ООО «Автодор - Платные Дороги»",
    service: "Операторская деятельность",
    description: "Взимание платы, T-pass и клиентские сервисы.",
    category: "Оператор платных дорог",
    offerings: ["Оплата проезда", "Сервисы T-pass"],
    linkLabel: "Реестр дочерних обществ",
    href: "https://www.russianhighways.ru/about/affiliates/",
  },
  {
    id: "transport-projects",
    company: "ООО «АВТОДОР-ТП»",
    service: "Транспортные проекты",
    description: "Проверенный телефон опубликован в реестре дочерних обществ.",
    category: "Транспортные решения",
    offerings: ["Цифровые сервисы", "Транспортные проекты"],
    linkLabel: "Реестр дочерних обществ",
    href: "https://www.russianhighways.ru/about/affiliates/",
  },
  {
    id: "road-maintenance",
    company: "Дорожно-эксплуатационные предприятия",
    service: "Ремонт и содержание дорог",
    description: "АО «ДЭП № 17», АО «ДЭП № 22» и АО «ДЭП № 73».",
    category: "Дорожная эксплуатация",
    offerings: ["Содержание дорог", "Ремонт инфраструктуры"],
    linkLabel: "Реестр дочерних обществ",
    href: "https://www.russianhighways.ru/about/affiliates/",
  },
] as const;

export const SOCIAL_COMMITMENTS = [
  {
    id: "large-families",
    nodeId: "1767:7504",
    media: "bridge-viaduct",
    src: "/media/social/large-families-road.png",
    imageAlt:
      "Сгенерированный образ дорожной инфраструктуры без привязки к конкретной социальной программе",
    eyebrow: "Льготы для поездок",
    title: "Поддержка многодетных семей",
    description:
      "До 30 сентября 2026 года действует специальная программа с бонусными баллами, скидкой на T-pass и максимальной скидкой программы лояльности.",
    linkLabel: "Условия программы",
    href: "https://www.russianhighways.ru/press/news/145160/",
  },
  {
    id: "small-business",
    nodeId: "1767:7506",
    media: "road-construction",
    src: "/media/social/small-business-roadworks.png",
    imageAlt:
      "Сгенерированный образ строительства дорожной инфраструктуры без привязки к конкретной закупке",
    eyebrow: "Ответственные закупки",
    title: "Поддержка МСП",
    description:
      "Официальный раздел о закупках у субъектов малого и среднего предпринимательства.",
    linkLabel: "Открыть раздел",
    href: "https://russianhighways.ru/msp/",
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

type FooterContact = Readonly<{
  label: string;
  value: string;
  href?: string;
  image: string;
  nodeId: string;
}>;

type SupportFaq = Readonly<{
  question: string;
  answer: string;
  href?: string;
  linkLabel?: string;
}>;

export const FOOTER_CONTACTS: readonly FooterContact[] = [
  {
    label: "Адрес",
    value: "Москва, Страстной бульвар, 9",
    image: "/brand/footer-location.svg",
    nodeId: "1767:8053",
  },
  {
    label: "Электронная почта",
    value: "info@russianhighways.ru",
    href: "mailto:info@russianhighways.ru",
    image: "/brand/footer-email.svg",
    nodeId: "1767:8058",
  },
  {
    label: "Телефон",
    value: "+7 495 727-11-95",
    href: "tel:+74957271195",
    image: "/brand/footer-phone.svg",
    nodeId: "1767:8063",
  },
] as const;

export const FOOTER_LEGAL_LINKS = [
  {
    label: "Раскрытие информации",
    href: "https://russianhighways.ru/about/regulatory-information/disc_inform/",
    nodeId: "1767:9209",
  },
  {
    label: "Противодействие коррупции",
    href: "https://russianhighways.ru/about/",
    nodeId: "1767:9210",
  },
  {
    label: "Политика обработки персональных данных",
    href: "https://russianhighways.ru/upload/docs/politika_PD.pdf",
    nodeId: "1767:9211",
  },
] as const;

export const SUPPORT_FAQ: readonly SupportFaq[] = [
  {
    question: "Как оплатить проезд?",
    answer: "Перейдите в сервис оплаты и выберите доступный способ для вашей поездки.",
    href: "https://russianhighways.ru/for_drivers/",
    linkLabel: "Открыть сервисы водителя",
  },
  {
    question: "Что делать при поломке?",
    answer:
      "Позвоните по короткому номеру *2323. Помощь на платной дороге оказывается безвозмездно.",
  },
  {
    question: "Как связаться с компанией?",
    answer:
      "Общий телефон: +7 (495) 727-11-95. Ситуационный центр: +7 (495) 580-98-41.",
  },
] as const;
