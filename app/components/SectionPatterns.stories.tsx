import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ArrowIcon } from "./ArrowIcon";

function SectionPatterns() {
  return (
    <div
      style={{
        display: "grid",
        width: "min(100%, 70rem)",
        gap: "4rem",
        padding: "4rem var(--page-gutter)",
      }}
    >
      <section>
        <div className="section-heading">
          <h2>Секционный заголовок</h2>
          <p>Единый вход для крупных смысловых блоков страницы.</p>
        </div>
      </section>

      <section style={{ display: "grid", gap: "1.5rem" }}>
        <p className="card-eyebrow-tab">Категория / дата / статус</p>
        <h3 style={{ margin: 0, fontSize: "var(--card-feature-title-size)" }}>
          Metadata tab
        </h3>
        <p style={{ margin: 0, color: "var(--color-text-muted)" }}>
          Применяется в карточках лояльности, новостей, статистики, дочерних обществ и
          будущих проектов.
        </p>
      </section>

      <section style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
        <a className="card-cta" href="#text-cta">
          Текстовый CTA
          <ArrowIcon className="card-cta__icon" direction="right" />
        </a>
        <a className="primary-button" href="#primary-action">
          Основное действие
        </a>
        <button type="button" className="floating-button" aria-label="Наверх">
          <ArrowIcon direction="up" />
        </button>
      </section>
    </div>
  );
}

const meta = {
  title: "Паттерны/Базовые элементы",
  component: SectionPatterns,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Общие для сайта заголовок секции, metadata tab и action-паттерны. Все используют существующие глобальные классы и токены.",
      },
    },
  },
} satisfies Meta<typeof SectionPatterns>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {};
