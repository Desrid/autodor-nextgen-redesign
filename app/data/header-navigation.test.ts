import { describe, expect, it } from "vitest";

import {
  HEADER_NAVIGATION_GROUPS,
  HEADER_SOCIAL_LINKS,
  PRIMARY_NAVIGATION,
} from "./header-navigation";

describe("header navigation source", () => {
  it("keeps the approved primary labels in exact order", () => {
    expect(PRIMARY_NAVIGATION.map((item) => item.label)).toEqual([
      "О компании",
      "Пресс-центр",
      "Пользователям автодорог",
      "Партнёрам",
      "Закупки",
    ]);
  });

  it("keeps every Figma mega-menu group and link in exact order", () => {
    expect(
      HEADER_NAVIGATION_GROUPS.map((group) => ({
        title: group.title,
        links: group.links.map((item) => item.label),
        secondary:
          "secondary" in group
            ? {
                title: group.secondary.title,
                links: group.secondary.links.map((item) => item.label),
              }
            : null,
      })),
    ).toEqual([
      {
        title: "Дочерние общества",
        links: [
          "ООО УК «Автодор»",
          "ООО «АВТОДОР-ТП»",
          "ООО «АВТОДОР - ПЛАТНЫЕ ДОРОГИ»",
          "ООО «АВТОДОР-УП»",
          "ООО «АВТОДОР - ИНЖИНИРИНГ»",
          "ООО «СК АВТОДОР»",
        ],
        secondary: null,
      },
      {
        title: "Федеральные трассы",
        links: [
          "Сеть дорог",
          "М-1 «Беларусь»",
          "М-3 «Украина»",
          "М-11 «Нева»",
          "М-4 «Дон»",
          "М-12 «Восток»",
          "А-113 ЦКАД",
          "А-289",
          "А-105 Москва-Домодедово",
          "А-107 «ММК»",
        ],
        secondary: null,
      },
      {
        title: "Информация о дорогах",
        links: [
          "Грузоперевозчикам",
          "Ремонтные работы",
          "Проезд школьных автобусов",
          "Помощь на дороге",
          "Расчет стоимости работы",
          "Договор об организации проезда",
        ],
        secondary: null,
      },
      {
        title: "Инвесторам",
        links: [
          "Инвестиционные проекты",
          "Ценные бумаги",
          "Раскрытие информации",
          "Существенные факты",
          "Инсайдерам Госкомпании",
          "Реквизиты",
        ],
        secondary: {
          title: "Поддержка субъектов МСП",
          links: [
            "Информация для субъектов МСП",
            "Программа партерства с субъеткати МСП",
            "Деятельность экспертного совета",
          ],
        },
      },
      {
        title: "Документация",
        links: [
          "Центральный аппарат и филиалы",
          "Дочерние общества",
          "Деятельность компании",
          "Антимонопольный комплекс",
          "Противодействие коррупции",
          "Нормативно-правовая информация",
          "Отозванные доверенности",
        ],
        secondary: null,
      },
    ]);
  });

  it("uses verified destinations without placeholder hrefs", () => {
    const links = [
      ...PRIMARY_NAVIGATION,
      ...HEADER_NAVIGATION_GROUPS.flatMap((group) => [
        ...group.links,
        ...("secondary" in group ? group.secondary.links : []),
      ]),
      ...HEADER_SOCIAL_LINKS,
    ];

    for (const link of links) {
      expect(link.href).toMatch(/^https:\/\//);
      expect(link.href).not.toContain("#");
    }
  });
});
