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
      expect(item.title.length).toBeGreaterThan(20);
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
});
