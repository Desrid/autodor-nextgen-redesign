import type { RoadId } from "./roads";

export type MapRoute = Readonly<{
  id: RoadId;
  svgIds: readonly string[];
}>;

export const MAP_ROUTES: readonly MapRoute[] = [
  { id: "m-11", svgIds: ["Vector 41"] },
  { id: "m-1", svgIds: ["Vector 42"] },
  { id: "m-3", svgIds: ["Vector 43"] },
  { id: "m-4", svgIds: ["Vector 44"] },
  { id: "m-12", svgIds: ["Vector 45"] },
  { id: "a-113", svgIds: ["Vector 40", "Vector 10"] },
] as const;

export type FutureMapStage = Readonly<{
  id: string;
  year: 2026 | 2027 | 2028 | 2029 | 2030;
  title: string;
  description: string;
  sourceNote: string;
  svgIds: readonly string[];
}>;

/**
 * The years are navigation positions from the approved 2026–2030 scale, not
 * individual commissioning deadlines. Only the common “К 2030 году” target
 * is independently verified; the other project labels come from Figma
 * 2011:25273 and remain explicitly described as schematic.
 */
export const FUTURE_MAP_STAGES: readonly FutureMapStage[] = [
  {
    id: "kad-2",
    year: 2026,
    title: "КАД-2",
    description:
      "Новый скоростной обход Санкт-Петербурга показан на карте как перспективное направление.",
    sourceNote: "Этап шкалы просмотра; отдельный срок ввода не заявлен.",
    svgIds: ["Vector 48"],
  },
  {
    id: "orekhovo-bypass",
    year: 2027,
    title: "Обход Орехово-Зуево и Ликино-Дулёво",
    description:
      "На исходной схеме выделен перспективный обход городов Орехово-Зуево и Ликино-Дулёво.",
    sourceNote:
      "Подпись из Figma; календарный срок требует официального подтверждения.",
    svgIds: ["Vector 59"],
  },
  {
    id: "krasnodar-bypass",
    year: 2028,
    title: "Южный обход Краснодара",
    description:
      "Перспективная дорога показана к югу от Краснодара и входит в три подтверждённых проекта блока.",
    sourceNote: "Общий подтверждённый ориентир трёх проектов — к 2030 году.",
    svgIds: ["Vector 54"],
  },
  {
    id: "m4-sochi",
    year: 2029,
    title: "М-4 «Дон» — Сочи",
    description:
      "Зелёный слой Figma показывает перспективное продолжение дорожного коридора в направлении Сочи.",
    sourceNote: "Этап шкалы просмотра; отдельный срок ввода не заявлен.",
    svgIds: ["Vector 56"],
  },
  {
    id: "southwest-chord",
    year: 2030,
    title: "Юго-западная хорда",
    description:
      "На карте направление показано пунктирной зелёной линией как перспективный проект дорожной сети.",
    sourceNote: "Схематичное направление из Figma, не навигационная геометрия.",
    svgIds: ["Vector 61"],
  },
] as const;

export const MAP_CITY_NAMES = [
  "Москва",
  "Санкт-Петербург",
  "Тверь",
  "Великий Новгород",
  "Смоленск",
  "Брянск",
  "Воронеж",
  "Ростов-на-Дону",
  "Краснодар",
  "Сочи",
  "Волгоград",
  "Саратов",
  "Самара",
  "Казань",
  "Нижний Новгород",
  "Екатеринбург",
  "Пермь",
  "Челябинск",
  "Тюмень",
  "Уфа",
  "Оренбург",
  "Астрахань",
  "Пенза",
  "Саранск",
  "Чебоксары",
  "Владимир",
  "Ярославль",
  "Тула",
  "Калуга",
  "Рязань",
  "Тольяти",
  "Ульяновск",
  "Новороссийск",
  "Майкоп",
  "Ставрополь",
  "Белгород",
  "Курск",
  "Орел",
  "Липецк",
  "Тамбов",
  "Вологда",
  "Торжок",
  "Орехово-Зуево",
  "Муром",
  "Арзамас",
  "Йошкар-Ола",
  "Набережные Челны",
  "Бугульма",
  "Магнитогорск",
] as const;

export type MapCityName = (typeof MAP_CITY_NAMES)[number];

const CITY_DESCRIPTIONS: Partial<Record<MapCityName, string>> = {
  Москва: "Центральный узел схемы, где сходятся основные магистральные направления.",
  "Санкт-Петербург":
    "Северо-западный узел карты и отправная точка коридора М-11 «Нева».",
  Краснодар: "Южный транспортный узел рядом с перспективным обходом города.",
  Сочи: "Черноморская точка перспективного направления М-4 «Дон» — Сочи.",
  "Ростов-на-Дону": "Крупный южный узел на направлении М-4 «Дон».",
  Казань: "Город отмечен на восточном магистральном коридоре карты.",
};

export function getMapCityDescription(city: MapCityName): string {
  return (
    CITY_DESCRIPTIONS[city] ??
    `${city} отмечен на исходной схеме как городской ориентир вдоль дорожной сети.`
  );
}

export const ALL_ROUTE_SVG_IDS = [
  "Vector 40",
  "Vector 41",
  "Vector 42",
  "Vector 43",
  "Vector 44",
  "Vector 45",
  "Vector 10",
  "Vector 46",
  "Vector 47",
  "Vector 48",
  "Vector 49",
  "Vector 52",
  "Vector 53",
  "Vector 54",
  "Vector 55",
  "Vector 56",
  "Vector 57",
  "Vector 59",
  "Vector 60",
  "Vector 61",
  "Vector 62",
  "Vector 64",
  "Vector 65",
  "Vector 66",
] as const;
