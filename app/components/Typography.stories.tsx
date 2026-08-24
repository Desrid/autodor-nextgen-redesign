import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const weights = [400, 500, 600, 700, 800] as const;

const roles = [
  {
    label: "Заголовок секции",
    size: "var(--section-heading-size)",
    weight: 700,
    sample: "Дороги будущего",
  },
  {
    label: "Заголовок карточки",
    size: "var(--card-title-size)",
    weight: 700,
    sample: "Транспортная доступность",
  },
  {
    label: "Крупный акцент",
    size: "clamp(1.5rem, 2.2vw, 2rem)",
    weight: 700,
    sample: "12 470 км",
  },
  {
    label: "Основной текст",
    size: "var(--card-body-size)",
    weight: 500,
    sample: "Развиваем дорожную инфраструктуру и делаем поездки удобнее.",
  },
  {
    label: "Метка / таб",
    size: "var(--card-tab-size)",
    weight: 700,
    sample: "АКТУАЛЬНО",
  },
] as const;

function Typography() {
  return (
    <main style={{ display: "grid", gap: 40, maxWidth: 1100, padding: 32 }}>
      <header>
        <p style={{ color: "var(--color-text-muted)", margin: "0 0 8px" }}>Основы</p>
        <h1 style={{ fontSize: "clamp(2rem, 4vw, 4rem)", margin: 0 }}>Типографика</h1>
        <p style={{ color: "var(--color-text-muted)", marginBottom: 0 }}>
          Семейство: <strong>Montserrat</strong>, с системными fallback: Arial,
          Helvetica, sans-serif.
        </p>
      </header>

      <section>
        <h2 style={{ fontSize: 24, margin: "0 0 16px" }}>Доступные начертания</h2>
        <div style={{ display: "grid", gap: 12 }}>
          {weights.map((weight) => (
            <div
              key={weight}
              style={{
                borderBottom: "1px solid var(--color-border)",
                fontSize: 28,
                fontWeight: weight,
                paddingBottom: 12,
              }}
            >
              Montserrat {weight} — Скоростные дороги
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: 24, margin: "0 0 16px" }}>Роли в интерфейсе</h2>
        <div style={{ display: "grid", gap: 16 }}>
          {roles.map((role) => (
            <article
              key={role.label}
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-card)",
                padding: 20,
              }}
            >
              <p
                style={{
                  color: "var(--color-text-muted)",
                  fontSize: 12,
                  margin: "0 0 10px",
                }}
              >
                {role.label} · {role.size} · {role.weight}
              </p>
              <p
                style={{
                  fontSize: role.size,
                  fontWeight: role.weight,
                  lineHeight:
                    role.label === "Основной текст"
                      ? "var(--card-body-line-height)"
                      : 1.2,
                  margin: 0,
                }}
              >
                {role.sample}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

const meta = {
  component: Typography,
  title: "Основы/Типографика",
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FontAndRoles: Story = { name: "Шрифт и роли" };
