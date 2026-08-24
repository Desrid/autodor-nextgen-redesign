import type { Meta, StoryObj } from "@storybook/nextjs-vite";

type SpacingToken = Readonly<{
  description: string;
  token: string;
  value: string;
}>;

const spacingTokens: SpacingToken[] = [
  {
    description: "Горизонтальный отступ страницы",
    token: "--page-gutter",
    value: "clamp(16px, 3.2vw, 64px)",
  },
  {
    description: "Пространство между секциями",
    token: "--section-space",
    value: "72px",
  },
  {
    description: "От заголовка до контента",
    token: "--heading-content-space",
    value: "48px",
  },
  { description: "Зазор карточек", token: "--card-gap", value: "24px" },
  {
    description: "Внутренний отступ карточки",
    token: "--card-content-padding",
    value: "clamp(20px, 1.8vw, 24px)",
  },
  {
    description: "Интервал внутри карточки",
    token: "--card-content-gap",
    value: "16px",
  },
  {
    description: "Внутренний отступ feature-карточки",
    token: "--card-feature-padding",
    value: "clamp(24px, 2.2vw, 32px)",
  },
  {
    description: "Интервал feature-карточки",
    token: "--card-feature-gap",
    value: "clamp(16px, 1.4vw, 20px)",
  },
];

function Spacing() {
  return (
    <main style={{ display: "grid", gap: 40, maxWidth: 1120, padding: 32 }}>
      <header>
        <p style={{ color: "var(--color-text-muted)", margin: "0 0 8px" }}>Основы</p>
        <h1 style={{ fontSize: "clamp(2rem, 4vw, 4rem)", margin: 0 }}>Отступы</h1>
        <p style={{ color: "var(--color-text-muted)", marginBottom: 0 }}>
          Живые layout-токены из <code>app/globals.css</code>. Полосы отражают их
          значение при текущей ширине viewport.
        </p>
      </header>

      <div style={{ display: "grid", gap: 20 }}>
        {spacingTokens.map((item) => (
          <article key={item.token} style={{ display: "grid", gap: 10 }}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "4px 12px",
                justifyContent: "space-between",
              }}
            >
              <strong>{item.description}</strong>
              <code style={{ color: "var(--color-text-muted)", fontSize: 12 }}>
                {item.token} · {item.value}
              </code>
            </div>
            <div
              style={{
                alignItems: "center",
                background: "var(--color-surface-subtle)",
                display: "flex",
                height: 32,
                padding: "0 8px",
              }}
            >
              <div
                style={{
                  background: "var(--color-brand-orange)",
                  height: 12,
                  maxWidth: "100%",
                  minWidth: 2,
                  width: `var(${item.token})`,
                }}
              />
            </div>
          </article>
        ))}
      </div>

      <section style={{ display: "grid", gap: 16 }}>
        <h2 style={{ fontSize: 24, margin: 0 }}>Применение</h2>
        <div
          style={{
            background: "var(--color-surface-subtle)",
            padding: "var(--page-gutter)",
          }}
        >
          <div
            style={{
              background: "var(--color-surface)",
              display: "grid",
              gap: "var(--card-content-gap)",
              padding: "var(--card-content-padding)",
            }}
          >
            <strong>Карточка</strong>
            <span>Внутренние отступ и интервал берутся из component-токенов.</span>
          </div>
        </div>
      </section>
    </main>
  );
}

const meta = {
  component: Spacing,
  title: "Основы/Отступы",
} satisfies Meta<typeof Spacing>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Tokens: Story = { name: "Токены" };
