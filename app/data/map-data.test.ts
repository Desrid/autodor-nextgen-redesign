import { describe, expect, it } from "vitest";

import {
  FUTURE_PROJECTS,
  FUTURE_PROJECT_TIMELINE,
  getPublishableFutureProjects,
} from "./future-projects";
import { hasVerifiedGeometry } from "./map-contracts";
import { getRoadById, ROADS } from "./roads";

describe("road data contract", () => {
  it("keeps the nine Figma roads in approved order", () => {
    expect(ROADS.map(({ id }) => id)).toEqual([
      "m-1",
      "m-3",
      "m-4",
      "m-11",
      "m-12",
      "a-113",
      "a-289",
      "a-105",
      "a-107",
    ]);
    expect(ROADS.map(({ figmaNodeId }) => figmaNodeId)).toEqual([
      "1767:7111",
      "1767:7112",
      "1767:7113",
      "1767:7114",
      "1767:7115",
      "1767:7116",
      "1767:7117",
      "1767:7118",
      "1767:7119",
    ]);
  });

  it("carries verified facts and unique live detail URLs", () => {
    expect(new Set(ROADS.map(({ detailsUrl }) => detailsUrl)).size).toBe(9);

    for (const road of ROADS) {
      expect(road.label.length).toBeGreaterThan(3);
      expect(road.fact.extent.length).toBeGreaterThan(3);
      expect(road.fact.classes.length).toBeGreaterThan(0);
      expect(road.fact.lanesMax).toBeGreaterThan(0);
      expect(road.fact.speedKmhMax).toBeGreaterThan(0);
      expect(road.detailsUrl).toMatch(/^https:\/\/russianhighways\.ru\//);
      expect(road.factSource.verifiedAt).toBe("2026-07-15");
    }
  });

  it("exposes all nine routes as official-source presentation schematics", () => {
    for (const road of ROADS) {
      expect(hasVerifiedGeometry(road.mapGeometry)).toBe(true);
      expect(road.mapGeometry).toMatchObject({
        status: "verified",
        geometry: { type: "LineString" },
        source: {
          url: road.detailsUrl,
          verifiedAt: "2026-07-16",
        },
        license: "Displayed as a schematic route",
        attribution: "Avtodor route scheme",
      });
    }
  });

  it("resolves a road by its stable id", () => {
    expect(getRoadById("m-11").label).toBe("М-11 «Нева»");
  });
});

describe("verified future projects", () => {
  it("preserves exactly three traced projects in Figma order", () => {
    expect(FUTURE_PROJECTS).toHaveLength(3);
    expect(FUTURE_PROJECTS.map(({ figmaCardNodeId }) => figmaCardNodeId)).toEqual([
      "1767:7511",
      "1767:7513",
      "1767:7515",
    ]);
  });

  it("publishes only the three projects and common 2030 target verified by the official prospect", () => {
    for (const project of FUTURE_PROJECTS) {
      expect(project.publicationStatus).toBe("verified");

      if (project.publicationStatus !== "verified") {
        throw new Error("Unexpected blocked future-project fixture");
      }

      expect(project.title.length).toBeGreaterThan(0);
      expect(project.deadlineYear).toBe(2030);
      expect(project.deadlineLabel).toBe("К 2030 году");
      expect(project.factSource.url).toMatch(/ed459c049c90a1b80a4f4db93a7a8912\.pdf$/);
      expect(project.mapGeometry.geometry).toBeNull();
    }

    expect(getPublishableFutureProjects()).toHaveLength(3);
    expect(getPublishableFutureProjects().map(({ title }) => title)).toEqual([
      "Новый скоростной обход Санкт-Петербурга (КАД-2), Ленинградская область и Санкт-Петербург",
      "Строительство автомобильной дороги А-108 на участке пересечения с автомобильной дорогой М-7 «Волга» до д. Стенино, Московская область (обход Орехово-Зуево и Ликино-Дулево)",
      "Южный обход г. Краснодар",
    ]);
  });

  it("keeps the Figma timeline scale while the verified milestone lands at 2030", () => {
    expect(FUTURE_PROJECT_TIMELINE.map(({ year }) => year)).toEqual([
      2026, 2027, 2028, 2029, 2030,
    ]);
    expect(
      new Set(FUTURE_PROJECT_TIMELINE.map(({ figmaNodeId }) => figmaNodeId)).size,
    ).toBe(5);
  });
});
