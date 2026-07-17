import { describe, expect, it } from "vitest";

import {
  CONTACT_TABS,
  GOVERNMENT_LINKS,
  HERO_ACTIONS,
  MORE_NAVIGATION,
  NEWS,
  PRIMARY_NAVIGATION,
  SERVICES,
  SOCIAL_LINKS,
  SUBSIDIARY_SERVICES,
} from "./home-content";

const allUrls = [
  ...PRIMARY_NAVIGATION,
  ...MORE_NAVIGATION,
  ...HERO_ACTIONS,
  ...SERVICES,
  ...NEWS,
  ...CONTACT_TABS,
  ...SUBSIDIARY_SERVICES,
  ...SOCIAL_LINKS,
].map(({ href }) => href);

describe("homepage source-backed content contracts", () => {
  it("keeps the Figma service slots and exact item count", () => {
    expect(SERVICES).toHaveLength(6);
    expect(SERVICES.map(({ nodeId }) => nodeId)).toEqual([
      "1767:7222",
      "1767:7231",
      "1767:7237",
      "1767:7241",
      "1767:7247",
      "1767:7253",
    ]);
    expect(new Set(SERVICES.map(({ id }) => id)).size).toBe(6);
  });

  it("keeps exactly five dated news records", () => {
    expect(NEWS).toHaveLength(5);
    for (const item of NEWS) {
      expect(item.date).toMatch(/^\d{1,2} [а-яё]+ 20\d{2}$/i);
      expect(item.dateTime).toMatch(/^20\d{2}-\d{2}-\d{2}$/);
      expect(item.title.length).toBeGreaterThan(20);
      expect(item.title).not.toMatch(
        /(?:^|\s)(?:а|в|и|к|о|с|у|на|по|за|из|от|до|для) /iu,
      );
      expect(item.image).toMatch(/^\/media\/news\/[a-z-]+\.png$/);
      expect(item.imageAlt.length).toBeGreaterThan(30);
    }
  });

  it("keeps the hidden Documents entry in navigation data", () => {
    expect(MORE_NAVIGATION).toContainEqual(
      expect.objectContaining({ label: "Документы" }),
    );
  });

  it("does not publish empty subsidiary service cards", () => {
    expect(SUBSIDIARY_SERVICES.length).toBeGreaterThan(0);
    for (const item of SUBSIDIARY_SERVICES) {
      expect(item.company.trim()).not.toBe("");
      expect(item.service.trim()).not.toBe("");
      expect(item.description.trim()).not.toBe("");
    }
  });

  it("uses absolute HTTP(S) targets and secure links where the source supports them", () => {
    for (const href of allUrls) {
      expect(() => new URL(href)).not.toThrow();
      expect(href).toMatch(/^https:\/\//);
    }

    expect(GOVERNMENT_LINKS).toHaveLength(3);
    for (const { href } of GOVERNMENT_LINKS) {
      expect(() => new URL(href)).not.toThrow();
    }
  });

  it("keeps the exact Figma footer logo slots as local SVG assets", () => {
    expect(SOCIAL_LINKS.map(({ nodeId }) => nodeId)).toEqual([
      "1767:8067",
      "1767:8071",
      "1767:8075",
      "1767:8082",
    ]);
    expect(SOCIAL_LINKS.every(({ image }) => image.endsWith(".svg"))).toBe(true);
    expect(GOVERNMENT_LINKS.map(({ nodeId }) => nodeId)).toEqual([
      "1767:8086",
      "1767:8249",
      "1767:9202",
    ]);
    expect(GOVERNMENT_LINKS.every(({ image }) => image.endsWith(".svg"))).toBe(true);
  });
});
