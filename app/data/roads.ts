import type { FigmaNodeId, MapGeometry, VerificationSource } from "./map-contracts";

export type RoadId =
  "m-1" | "m-3" | "m-4" | "m-11" | "m-12" | "a-113" | "a-289" | "a-105" | "a-107";

export type RoadFact = Readonly<{
  extent: string;
  classes: readonly string[];
  lanesMax: number;
  speedKmhMax: number;
}>;

export type RoadRecord = Readonly<{
  id: RoadId;
  figmaNodeId: FigmaNodeId;
  label: string;
  shortLabel: string;
  fact: RoadFact;
  detailsUrl: `https://${string}`;
  factSource: VerificationSource;
  mapGeometry: MapGeometry;
}>;

const CURRENT_SITE_AUDIT_DATE = "2026-07-15" as const;

const withoutVerifiedGeometry = (): MapGeometry => ({
  status: "unavailable",
  geometry: null,
  reason:
    "В разрешённых источниках нет проверенной геометрии с лицензией и атрибуцией.",
});

const source = (url: `https://${string}`): VerificationSource => ({
  label: "Действующий сайт Государственной компании «Автодор»",
  url,
  verifiedAt: CURRENT_SITE_AUDIT_DATE,
});

export const ROADS = [
  {
    id: "m-1",
    figmaNodeId: "1767:7111",
    label: "М-1 «Беларусь»",
    shortLabel: "М-1",
    fact: {
      extent: "52 км платных участков",
      classes: ["IБ"],
      lanesMax: 8,
      speedKmhMax: 110,
    },
    detailsUrl: "https://russianhighways.ru/for_drivers/?tab=2",
    factSource: source("https://russianhighways.ru/for_drivers/?tab=2"),
    mapGeometry: withoutVerifiedGeometry(),
  },
  {
    id: "m-3",
    figmaNodeId: "1767:7112",
    label: "М-3 «Украина»",
    shortLabel: "М-3",
    fact: {
      extent: "104,2 км платных участков",
      classes: ["IБ"],
      lanesMax: 8,
      speedKmhMax: 110,
    },
    detailsUrl: "https://russianhighways.ru/for_drivers/?tab=3",
    factSource: source("https://russianhighways.ru/for_drivers/?tab=3"),
    mapGeometry: withoutVerifiedGeometry(),
  },
  {
    id: "m-4",
    figmaNodeId: "1767:7113",
    label: "М-4 «Дон»",
    shortLabel: "М-4",
    fact: {
      extent: "1234 км платных участков",
      classes: ["IА", "IБ"],
      lanesMax: 8,
      speedKmhMax: 110,
    },
    detailsUrl: "https://russianhighways.ru/for_drivers/?tab=4",
    factSource: source("https://russianhighways.ru/for_drivers/?tab=4"),
    mapGeometry: withoutVerifiedGeometry(),
  },
  {
    id: "m-11",
    figmaNodeId: "1767:7114",
    label: "М-11 «Нева»",
    shortLabel: "М-11",
    fact: {
      extent: "684 км в доверительном управлении",
      classes: ["IА"],
      lanesMax: 10,
      speedKmhMax: 130,
    },
    detailsUrl: "https://russianhighways.ru/for_drivers/?tab=5",
    factSource: source("https://russianhighways.ru/for_drivers/?tab=5"),
    mapGeometry: withoutVerifiedGeometry(),
  },
  {
    id: "m-12",
    figmaNodeId: "1767:7115",
    label: "М-12 «Восток»",
    shortLabel: "М-12",
    fact: {
      extent: "1232 км участков в платной эксплуатации",
      classes: ["IБ"],
      lanesMax: 6,
      speedKmhMax: 110,
    },
    detailsUrl: "https://russianhighways.ru/for_drivers/?tab=6",
    factSource: source("https://russianhighways.ru/for_drivers/?tab=6"),
    mapGeometry: withoutVerifiedGeometry(),
  },
  {
    id: "a-113",
    figmaNodeId: "1767:7116",
    label: "А-113 ЦКАД",
    shortLabel: "А-113",
    fact: {
      extent: "267 км платных участков",
      classes: ["IА"],
      lanesMax: 4,
      speedKmhMax: 110,
    },
    detailsUrl: "https://russianhighways.ru/for_drivers/?tab=7",
    factSource: source("https://russianhighways.ru/for_drivers/?tab=7"),
    mapGeometry: withoutVerifiedGeometry(),
  },
  {
    id: "a-289",
    figmaNodeId: "1767:7117",
    label: "А-289",
    shortLabel: "А-289",
    fact: {
      extent: "119 км платных участков",
      classes: ["IБ"],
      lanesMax: 4,
      speedKmhMax: 90,
    },
    detailsUrl: "https://russianhighways.ru/for_drivers/?tab=8",
    factSource: source("https://russianhighways.ru/for_drivers/?tab=8"),
    mapGeometry: withoutVerifiedGeometry(),
  },
  {
    id: "a-105",
    figmaNodeId: "1767:7118",
    label: "А-105 Москва-Домодедово",
    shortLabel: "А-105",
    fact: {
      extent: "22,5 км протяжённости дороги",
      classes: ["IВ"],
      lanesMax: 8,
      speedKmhMax: 90,
    },
    detailsUrl: "https://russianhighways.ru/for_drivers/?tab=9",
    factSource: source("https://russianhighways.ru/for_drivers/?tab=9"),
    mapGeometry: withoutVerifiedGeometry(),
  },
  {
    id: "a-107",
    figmaNodeId: "1767:7119",
    label: "А-107 Московское малое кольцо",
    shortLabel: "А-107",
    fact: {
      extent: "257 км протяжённости",
      classes: ["II", "III"],
      lanesMax: 4,
      speedKmhMax: 90,
    },
    detailsUrl: "https://russianhighways.ru/for_drivers/?tab=10",
    factSource: source("https://russianhighways.ru/for_drivers/?tab=10"),
    mapGeometry: withoutVerifiedGeometry(),
  },
] as const satisfies readonly RoadRecord[];

export function getRoadById(id: RoadId): RoadRecord {
  const road = ROADS.find((item) => item.id === id);

  if (!road) {
    throw new Error(`Unknown road id: ${id}`);
  }

  return road;
}
