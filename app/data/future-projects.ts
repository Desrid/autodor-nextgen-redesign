import type { FigmaNodeId, MapGeometry, VerificationSource } from "./map-contracts";

export type FutureProjectId =
  "future-project-slot-1" | "future-project-slot-2" | "future-project-slot-3";

type FutureProjectBase = Readonly<{
  id: FutureProjectId;
  figmaCardNodeId: FigmaNodeId;
  figmaTextNodeId: FigmaNodeId;
}>;

export type VerifiedFutureProject = FutureProjectBase &
  Readonly<{
    publicationStatus: "verified";
    shortTitle: string;
    title: string;
    detailsUrl: `https://${string}`;
    factSource: VerificationSource;
    deadlineYear: 2030;
    deadlineLabel: "К 2030 году";
    deadlineSource: VerificationSource;
    mapGeometry: MapGeometry;
  }>;

export type BlockedFutureProject = FutureProjectBase &
  Readonly<{
    publicationStatus: "blocked-source-gap";
    title: null;
    detailsUrl: null;
    factSource: null;
    deadlineYear: null;
    deadlineSource: null;
    mapGeometry: Readonly<{
      status: "unavailable";
      geometry: null;
      reason: string;
    }>;
  }>;

export type FutureProjectRecord = VerifiedFutureProject | BlockedFutureProject;

const OFFICIAL_PROSPECT_SOURCE = {
  label: "Проспект ценных бумаг Государственной компании «Автодор», стр. 36",
  url: "https://www.russianhighways.ru/upload/iblock/ed4/ed459c049c90a1b80a4f4db93a7a8912.pdf",
  verifiedAt: "2026-07-15",
} as const satisfies VerificationSource;

const verifiedProject = (
  id: FutureProjectId,
  figmaCardNodeId: FigmaNodeId,
  figmaTextNodeId: FigmaNodeId,
  shortTitle: string,
  title: string,
): VerifiedFutureProject => ({
  id,
  figmaCardNodeId,
  figmaTextNodeId,
  publicationStatus: "verified",
  shortTitle,
  title,
  detailsUrl: OFFICIAL_PROSPECT_SOURCE.url,
  factSource: OFFICIAL_PROSPECT_SOURCE,
  deadlineYear: 2030,
  deadlineLabel: "К 2030 году",
  deadlineSource: OFFICIAL_PROSPECT_SOURCE,
  mapGeometry: {
    status: "unavailable",
    geometry: null,
    reason:
      "Официальный проспект подтверждает название и срок, но не публикует лицензированную геометрию для интерактивной карты.",
  },
});

/**
 * Project names and the common target date are stated on page 36 of the
 * official securities prospect approved on 21 April 2025. Card order remains
 * identical to the final Figma prototype.
 */
export const FUTURE_PROJECTS: readonly FutureProjectRecord[] = [
  verifiedProject(
    "future-project-slot-1",
    "1767:7511",
    "1767:7512",
    "КАД-2",
    "Новый скоростной обход Санкт-Петербурга (КАД-2), Ленинградская область и Санкт-Петербург",
  ),
  verifiedProject(
    "future-project-slot-2",
    "1767:7513",
    "1767:7514",
    "А-108",
    "Строительство автомобильной дороги А-108 на участке пересечения с автомобильной дорогой М-7 «Волга» до д. Стенино, Московская область (обход Орехово-Зуево и Ликино-Дулево)",
  ),
  verifiedProject(
    "future-project-slot-3",
    "1767:7515",
    "1767:7516",
    "Краснодар",
    "Южный обход г. Краснодар",
  ),
];

/**
 * These years are verified Figma timeline labels only. They are not project
 * deadlines and must never be attached to a project without an authoritative source.
 */
export const FUTURE_PROJECT_TIMELINE = [
  { year: 2026, figmaNodeId: "1767:7537" },
  { year: 2027, figmaNodeId: "1767:7535" },
  { year: 2028, figmaNodeId: "1767:7534" },
  { year: 2029, figmaNodeId: "1767:7538" },
  { year: 2030, figmaNodeId: "1767:7536" },
] as const satisfies readonly Readonly<{
  year: number;
  figmaNodeId: FigmaNodeId;
}>[];

export function getPublishableFutureProjects(): readonly VerifiedFutureProject[] {
  return FUTURE_PROJECTS.filter(
    (project): project is VerifiedFutureProject =>
      project.publicationStatus === "verified",
  );
}
