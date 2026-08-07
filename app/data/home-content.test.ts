import { describe, expect, it } from "vitest";

import {
  CONTACT_TABS,
  FOOTER_CONTACTS,
  FOOTER_LEGAL_LINKS,
  GOVERNMENT_LINKS,
  HERO_ACTIONS,
  MORE_NAVIGATION,
  NEWS,
  PRIMARY_NAVIGATION,
  SERVICES,
  SOCIAL_COMMITMENTS,
  SOCIAL_LINKS,
  SUBSIDIARY_SERVICES,
  SUPPORT_FAQ,
} from "./home-content";

const allUrls = [
  ...PRIMARY_NAVIGATION,
  ...MORE_NAVIGATION,
  ...HERO_ACTIONS,
  ...SERVICES,
  ...NEWS,
  ...CONTACT_TABS,
  ...SUBSIDIARY_SERVICES,
  ...SOCIAL_COMMITMENTS,
  ...SOCIAL_LINKS,
].flatMap(({ href }) => (typeof href === "string" ? [href] : []));

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
    expect(SUBSIDIARY_SERVICES).toHaveLength(4);
    expect(SUBSIDIARY_SERVICES.map(({ service, href }) => ({ service, href }))).toEqual(
      [
        {
          service: "Реализация транспондеров",
          href: "https://tpass.me/",
        },
        {
          service: "КАСКО",
          href: "https://avtodor-tr.ru/services/insurance/kasko/",
        },
        {
          service: "ОСАГО",
          href: "https://avtodor-tr.ru/services/insurance/osago/",
        },
        {
          service: "Подключение к API (для юридических лиц)",
          href: null,
        },
      ],
    );
    expect(new Set(SUBSIDIARY_SERVICES.map(({ id }) => id)).size).toBe(
      SUBSIDIARY_SERVICES.length,
    );
    for (const item of SUBSIDIARY_SERVICES) {
      expect(item.company.trim()).not.toBe("");
      expect(item.service.trim()).not.toBe("");
      expect(item.description.trim()).not.toBe("");
      expect(item.image).toMatch(/^\/media\/subsidiary\/[a-z-]+\.webp$/);
      expect(item.linkLabel.trim()).not.toBe("");
    }
    expect(new Set(SUBSIDIARY_SERVICES.map(({ image }) => image)).size).toBe(4);
    expect(new Set(SUBSIDIARY_SERVICES.map(({ company }) => company))).toEqual(
      new Set(["ООО «АВТОДОР - ПЛАТНЫЕ ДОРОГИ»"]),
    );
    expect(SUBSIDIARY_SERVICES.find(({ id }) => id === "legal-api")?.linkLabel).toBe(
      "Ссылка уточняется",
    );
  });

  it("uses absolute HTTP(S) targets and secure links where the source supports them", () => {
    for (const href of allUrls) {
      expect(() => new URL(href)).not.toThrow();
      expect(href).toMatch(/^https:\/\//);
    }

    expect(GOVERNMENT_LINKS).toHaveLength(5);
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
    expect(GOVERNMENT_LINKS.slice(0, 3).map(({ nodeId }) => nodeId)).toEqual([
      "1767:8086",
      "1767:8249",
      "1767:9202",
    ]);
    expect(GOVERNMENT_LINKS.every(({ image }) => image.endsWith(".svg"))).toBe(true);
  });

  it("adds the requested official resources with local SVG emblems", () => {
    expect(GOVERNMENT_LINKS.slice(-2)).toMatchObject([
      {
        label: "Ространснадзор",
        href: "https://rostransnadzor.gov.ru/",
        image: "/brand/rostransnadzor.svg",
      },
      {
        label: "Официальный сайт Президента РФ",
        href: "https://kremlin.ru/",
        image: "/brand/president-russia.svg",
      },
    ]);
  });

  it("keeps the two verified social commitments in Figma order", () => {
    expect(SOCIAL_COMMITMENTS.map(({ nodeId }) => nodeId)).toEqual([
      "1767:7504",
      "1767:7506",
    ]);
    expect(SOCIAL_COMMITMENTS.map(({ id }) => id)).toEqual([
      "large-families",
      "small-business",
    ]);

    for (const item of SOCIAL_COMMITMENTS) {
      expect(item.media).toBeTruthy();
      expect(item.src).toMatch(/^\/media\/social\/.+\.png$/);
      expect(item.imageAlt).toMatch(/^Сгенерированный образ/);
      expect(item.eyebrow).not.toBe("");
      expect(item.title).not.toBe("");
      expect(item.description).not.toBe("");
      expect(item.linkLabel).not.toBe("");
      expect(item.href).toMatch(/^https:\/\//);
    }
  });

  it("keeps footer contacts and support answers complete and actionable", () => {
    expect(FOOTER_CONTACTS).toHaveLength(3);
    expect(FOOTER_CONTACTS.every(({ image }) => image.endsWith(".svg"))).toBe(true);
    expect(FOOTER_LEGAL_LINKS).toHaveLength(3);
    expect(SUPPORT_FAQ).toHaveLength(3);
    expect(SUPPORT_FAQ.every(({ question, answer }) => question && answer)).toBe(true);

    for (const link of FOOTER_LEGAL_LINKS) {
      expect(link.href).toMatch(/^https:\/\//);
    }
  });
});
