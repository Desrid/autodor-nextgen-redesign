export type LoyaltyProgram = Readonly<{
  id: string;
  nodeId: string;
  meta: string;
  title: string;
  description: string;
  href: string;
  linkLabel: string;
  image: string;
  imageAlt: string;
  kind: "offer" | "mechanic";
}>;

export const LOYALTY_SOURCES = {
  largeFamilies: "https://www.russianhighways.ru/press/news/145160/",
  programRules: "https://russianhighways.ru/press/news/83198/",
} as const;

export const LOYALTY_PROGRAMS = [
  {
    id: "large-families",
    nodeId: "1767:7292",
    kind: "offer",
    meta: "До 30 сентября 2026",
    title: "12 000 баллов многодетным семьям",
    description:
      "Баллы можно обменять на скидку на проезд, а транспондер T-pass — приобрести со скидкой 30% при выполнении условий акции.",
    href: LOYALTY_SOURCES.largeFamilies,
    linkLabel: "Условия акции",
    image: "/media/loyalty/large-families-road-trip.png",
    imageAlt: "Автомобиль едет по скоростной дороге среди лесистых холмов",
  },
  {
    id: "bonus-discount",
    nodeId: "1767:7295",
    kind: "mechanic",
    meta: "Скидка 3–15%",
    title: "Дополнительная скидка за баллы",
    description:
      "Накопленные баллы программы лояльности можно обменять на скидку, которая действует выбранный календарный месяц.",
    href: LOYALTY_SOURCES.largeFamilies,
    linkLabel: "Как работает скидка",
    image: "/media/loyalty/bonus-discount-transponder.png",
    imageAlt: "Транспондер в салоне автомобиля на фоне пункта оплаты",
  },
  {
    id: "earn-points",
    nodeId: "1767:7298",
    kind: "mechanic",
    meta: "За поездки с T-pass",
    title: "Баллы за оплаченный проезд",
    description:
      "Баллы начисляются за проезды по платным участкам дорог Автодора после подключения программы лояльности.",
    href: LOYALTY_SOURCES.programRules,
    linkLabel: "Правила начисления",
    image: "/media/loyalty/earn-points-motorway.png",
    imageAlt: "Вид сверху на многополосную дорогу среди зелёного леса",
  },
  {
    id: "discount-levels",
    nodeId: "1767:7273",
    kind: "mechanic",
    meta: "Пять уровней",
    title: "Выберите размер скидки",
    description:
      "Доступные уровни — 3%, 5%, 7%, 10% или 15%. Чем выше скидка, тем больше бонусных баллов потребуется.",
    href: LOYALTY_SOURCES.programRules,
    linkLabel: "Уровни программы",
    image: "/media/loyalty/discount-levels-console.png",
    imageAlt: "Транспондер и банковская карта на центральной консоли автомобиля",
  },
  {
    id: "flexible-period",
    nodeId: "1767:7276",
    kind: "mechanic",
    meta: "На выбранный месяц",
    title: "Планируйте скидку заранее",
    description:
      "Скидку можно активировать на подходящий месяц, а до начала действия — отменить и выбрать другой период.",
    href: LOYALTY_SOURCES.programRules,
    linkLabel: "Управление скидкой",
    image: "/media/loyalty/flexible-period-road-trip.png",
    imageAlt: "Автомобиль у зоны отдыха рядом со скоростной дорогой",
  },
  {
    id: "points-lifetime",
    nodeId: "1767:7279",
    kind: "mechanic",
    meta: "Контроль баланса",
    title: "Следите за сроком баллов",
    description:
      "История начислений и срок действия баллов доступны в личном кабинете владельца транспондера T-pass.",
    href: LOYALTY_SOURCES.programRules,
    linkLabel: "Подробнее о баллах",
    image: "/media/loyalty/points-balance-dashboard.png",
    imageAlt: "Вид из автомобиля на вечернюю скоростную дорогу",
  },
] as const satisfies readonly LoyaltyProgram[];
