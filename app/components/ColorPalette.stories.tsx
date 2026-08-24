import type { Meta, StoryObj } from "@storybook/nextjs-vite";

type ColorToken = {
  description: string;
  token: string;
  value: string;
};

const tokenGroups: { name: string; tokens: ColorToken[] }[] = [
  {
    name: "Примитивы",
    tokens: [
      {
        description: "Основной акцент",
        token: "--color-brand-orange",
        value: "#FF5100",
      },
      {
        description: "Фирменный тёмный",
        token: "--color-brand-black",
        value: "#2D2A26",
      },
      { description: "Серый 7", token: "--color-gray-7", value: "#97999C" },
      { description: "Серый 5", token: "--color-gray-5", value: "#B1B3B6" },
      { description: "Серый 3", token: "--color-gray-3", value: "#D1D3D4" },
      { description: "Серый 1", token: "--color-gray-1", value: "#E8E8E8" },
      { description: "Белый", token: "--color-page", value: "#FFFFFF" },
    ],
  },
  {
    name: "Семантика",
    tokens: [
      {
        description: "Базовая поверхность",
        token: "--color-surface",
        value: "#FFFFFF",
      },
      {
        description: "Приглушённая поверхность",
        token: "--color-surface-subtle",
        value: "color-mix(gray-1, page)",
      },
      { description: "Основной текст", token: "--color-text", value: "#2D2A26" },
      {
        description: "Вторичный текст",
        token: "--color-text-muted",
        value: "color-mix(black, page)",
      },
      { description: "Граница", token: "--color-border", value: "#D1D3D4" },
    ],
  },
  {
    name: "Состояния и компоненты",
    tokens: [
      {
        description: "Действие шапки",
        token: "--color-header-action",
        value: "brand-orange",
      },
      {
        description: "Hover акцента",
        token: "--color-brand-orange-hover",
        value: "color-mix(orange, black)",
      },
      {
        description: "Светлый акцент",
        token: "--color-brand-orange-light",
        value: "color-mix(orange, page)",
      },
      {
        description: "Мягкий акцент",
        token: "--color-brand-orange-soft",
        value: "color-mix(orange, page)",
      },
      {
        description: "Фоновый акцент",
        token: "--color-brand-orange-faint",
        value: "color-mix(orange, page)",
      },
    ],
  },
];

function ColorPalette() {
  return (
    <main style={{ display: "grid", gap: 40, maxWidth: 1480, padding: 32 }}>
      <header>
        <p style={{ color: "var(--color-text-muted)", margin: "0 0 8px" }}>Основы</p>
        <h1 style={{ fontSize: "clamp(2rem, 4vw, 4rem)", margin: 0 }}>
          Цветовая палитра
        </h1>
        <p style={{ color: "var(--color-text-muted)", marginBottom: 0, maxWidth: 760 }}>
          Это живые CSS-переменные из <code>app/globals.css</code>, а не отдельная копия
          палитры.
        </p>
      </header>

      {tokenGroups.map((group) => (
        <section key={group.name}>
          <h2 style={{ fontSize: 24, margin: "0 0 16px" }}>{group.name}</h2>
          <div
            style={{
              display: "grid",
              gap: 16,
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            }}
          >
            {group.tokens.map((item) => (
              <article
                key={item.token}
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-card)",
                  overflow: "hidden",
                }}
              >
                <div style={{ background: `var(${item.token})`, height: 104 }} />
                <div style={{ display: "grid", gap: 5, padding: 14 }}>
                  <strong>{item.description}</strong>
                  <code style={{ fontSize: 12 }}>{item.token}</code>
                  <span style={{ color: "var(--color-text-muted)", fontSize: 12 }}>
                    {item.value}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}

const meta = {
  component: ColorPalette,
  title: "Основы/Палитра",
} satisfies Meta<typeof ColorPalette>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Tokens: Story = { name: "Токены" };
