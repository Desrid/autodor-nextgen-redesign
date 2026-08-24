import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const radiusTokens = [
  {
    description: "Контролы: кнопки, табы, поля",
    token: "--radius-control",
    value: "8px",
  },
  {
    description: "Карточки и крупные поверхности",
    token: "--radius-card",
    value: "16px",
  },
] as const;

function Radii() {
  return (
    <main style={{ display: "grid", gap: 40, maxWidth: 1120, padding: 32 }}>
      <header>
        <p style={{ color: "var(--color-text-muted)", margin: "0 0 8px" }}>Основы</p>
        <h1 style={{ fontSize: "clamp(2rem, 4vw, 4rem)", margin: 0 }}>Скругления</h1>
        <p style={{ color: "var(--color-text-muted)", marginBottom: 0 }}>
          Два layout-токена определяют геометрию интерактивных контролов и карточек.
        </p>
      </header>

      <div
        style={{
          display: "grid",
          gap: 24,
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        }}
      >
        {radiusTokens.map((item) => (
          <article key={item.token} style={{ display: "grid", gap: 16 }}>
            <div
              style={{
                background: "var(--color-brand-orange)",
                borderRadius: `var(${item.token})`,
                height: 160,
              }}
            />
            <div style={{ display: "grid", gap: 6 }}>
              <strong>{item.description}</strong>
              <code>{item.token}</code>
              <span style={{ color: "var(--color-text-muted)", fontSize: 13 }}>
                {item.value}
              </span>
            </div>
          </article>
        ))}
      </div>

      <section style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        <button
          style={{
            background: "var(--color-brand-orange)",
            border: 0,
            borderRadius: "var(--radius-control)",
            color: "var(--color-page)",
            padding: "12px 18px",
          }}
          type="button"
        >
          Контрол
        </button>
        <div
          style={{
            background: "var(--color-surface-subtle)",
            borderRadius: "var(--radius-card)",
            padding: 24,
          }}
        >
          Карточка
        </div>
      </section>
    </main>
  );
}

const meta = {
  component: Radii,
  title: "Основы/Скругления",
} satisfies Meta<typeof Radii>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Tokens: Story = { name: "Токены" };
