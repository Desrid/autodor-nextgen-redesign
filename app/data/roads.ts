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

const source = (url: `https://${string}`): VerificationSource => ({
  label: "Действующий сайт Государственной компании «Автодор»",
  url,
  verifiedAt: CURRENT_SITE_AUDIT_DATE,
});

const SCHEMATIC_AUDIT_DATE = "2026-07-16" as const;

function schematicOfficialRoute(
  url: `https://${string}`,
  coordinates: readonly (readonly [number, number])[],
): MapGeometry {
  return {
    status: "verified",
    geometry: { type: "LineString", coordinates },
    source: {
      label: "Official Avtodor route; presentation schematic",
      url,
      verifiedAt: SCHEMATIC_AUDIT_DATE,
    },
    license: "Displayed as a schematic route",
    attribution: "Avtodor route scheme",
  };
}

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
    mapGeometry: schematicOfficialRoute(
      "https://russianhighways.ru/for_drivers/?tab=2",
      [
        [30.99259, 54.69094],
        [31.1361, 54.69227],
        [31.55861, 54.79533],
        [31.91901, 54.86065],
        [32.21375, 54.95582],
        [32.63944, 55.07565],
        [32.95672, 55.10536],
        [33.31828, 55.15193],
        [33.62343, 55.18236],
        [34.00611, 55.19616],
        [34.33892, 55.24602],
        [34.74767, 55.40887],
        [35.07024, 55.49978],
        [35.43449, 55.48611],
        [35.80402, 55.46469],
        [36.12879, 55.47416],
        [36.49516, 55.55046],
        [36.92583, 55.60031],
        [37.2642, 55.69029],
        [37.38833, 55.71308],
      ],
    ),
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
    mapGeometry: schematicOfficialRoute(
      "https://russianhighways.ru/for_drivers/?tab=3",
      [
        [37.56, 55.67],
        [37.31, 55.5],
        [36.86, 55.18],
        [36.28, 54.51],
        [35.63, 54.16],
        [34.37, 53.24],
        [32.0, 52.12],
      ],
    ),
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
    mapGeometry: schematicOfficialRoute(
      "https://russianhighways.ru/for_drivers/?tab=4",
      [
        [37.62, 55.75],
        [38.29, 54.19],
        [39.2, 51.66],
        [40.1, 48.7],
        [39.7, 47.24],
        [38.97, 45.04],
        [37.77, 44.72],
      ],
    ),
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
    mapGeometry: schematicOfficialRoute(
      "https://russianhighways.ru/for_drivers/?tab=5",
      [
        [37.62, 55.75],
        [37.22, 56.01],
        [35.91, 56.86],
        [33.54, 57.15],
        [31.27, 58.52],
        [30.3, 59.93],
      ],
    ),
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
    mapGeometry: schematicOfficialRoute(
      "https://russianhighways.ru/for_drivers/?tab=6",
      [
        [37.62, 55.75],
        [40.41, 56.13],
        [42.05, 55.57],
        [43.84, 55.39],
        [46.04, 55.2],
        [47.25, 56.15],
        [49.1, 55.79],
      ],
    ),
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
    mapGeometry: schematicOfficialRoute(
      "https://russianhighways.ru/for_drivers/?tab=7",
      [
        [36.7, 56.06],
        [37.35, 55.98],
        [37.89, 55.75],
        [38.02, 55.44],
        [37.72, 55.25],
        [37.05, 55.3],
        [36.55, 55.54],
        [36.7, 56.06],
      ],
    ),
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
    mapGeometry: schematicOfficialRoute(
      "https://russianhighways.ru/for_drivers/?tab=8",
      [
        [38.97, 45.04],
        [38.03, 45.26],
        [37.41, 45.28],
        [36.77, 45.35],
      ],
    ),
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
    mapGeometry: schematicOfficialRoute(
      "https://russianhighways.ru/for_drivers/?tab=9",
      [
        [37.62, 55.75],
        [37.72, 55.64],
        [37.82, 55.52],
        [37.9, 55.42],
      ],
    ),
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
    mapGeometry: schematicOfficialRoute(
      "https://russianhighways.ru/for_drivers/?tab=10",
      [
        [37.55, 56.06],
        [38.15, 55.86],
        [38.2, 55.55],
        [37.78, 55.32],
        [36.88, 55.36],
        [36.55, 55.65],
        [36.85, 55.94],
        [37.55, 56.06],
      ],
    ),
  },
] as const satisfies readonly RoadRecord[];

export function getRoadById(id: RoadId): RoadRecord {
  const road = ROADS.find((item) => item.id === id);

  if (!road) {
    throw new Error(`Unknown road id: ${id}`);
  }

  return road;
}
