import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import {
  AUTODOR_LOGO_VARIANTS,
  AutodorLogo,
  LOGOS,
  Logo,
  type AutodorLogoVariant,
  type LogoName,
} from "./Logo";

const logos = Object.entries(LOGOS) as [LogoName, (typeof LOGOS)[LogoName]][];
const autodorVariants = Object.keys(AUTODOR_LOGO_VARIANTS) as AutodorLogoVariant[];

function LogoGallery() {
  return (
    <main style={{ display: "grid", gap: 40, maxWidth: 1480, padding: 32 }}>
      <header>
        <p style={{ color: "var(--color-text-muted)", margin: "0 0 8px" }}>Основы</p>
        <h1 style={{ fontSize: "clamp(2rem, 4vw, 4rem)", margin: 0 }}>Логотипы</h1>
        <p style={{ color: "var(--color-text-muted)", marginBottom: 0, maxWidth: 760 }}>
          Логотип Автодора переключается единым примитивом <code>AutodorLogo</code>;
          партнёрские знаки используют <code>Logo</code>.
        </p>
      </header>

      <section style={{ display: "grid", gap: 16 }}>
        <h2 style={{ margin: 0 }}>Автодор</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
          {autodorVariants.map((variant) => (
            <figure
              key={variant}
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-card)",
                display: "grid",
                gap: 10,
                justifyItems: "center",
                margin: 0,
                minWidth: 180,
                padding: 20,
              }}
            >
              <AutodorLogo height={72} variant={variant} />
              <figcaption style={{ color: "var(--color-text-muted)", fontSize: 12 }}>
                {AUTODOR_LOGO_VARIANTS[variant].label}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <h2 style={{ margin: 0 }}>Партнёрские логотипы</h2>
      <div
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        }}
      >
        {logos.map(([name, logo]) => (
          <figure
            key={name}
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-card)",
              margin: 0,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                alignItems: "center",
                background: "var(--color-surface-subtle)",
                display: "flex",
                height: 144,
                justifyContent: "center",
                padding: 24,
              }}
            >
              <Logo name={name} size={96} />
            </div>
            <figcaption style={{ display: "grid", gap: 6, padding: 14 }}>
              <strong>{logo.label}</strong>
              <code
                style={{
                  color: "var(--color-text-muted)",
                  fontSize: 11,
                  overflowWrap: "anywhere",
                }}
              >
                {name} · {logo.src}
              </code>
            </figcaption>
          </figure>
        ))}
      </div>
    </main>
  );
}

const meta = { component: LogoGallery, title: "Основы/Логотипы" } satisfies Meta<
  typeof LogoGallery
>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllLogos: Story = { name: "Все логотипы" };
