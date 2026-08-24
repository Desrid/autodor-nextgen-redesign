import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import {
  AUTODOR_LOGO_VARIANTS,
  AutodorLogo,
  LOGOS,
  Logo,
  type AutodorLogoVariant,
  type LogoName,
} from "./Logo";

const logoNames = Object.keys(LOGOS) as LogoName[];
const autodorVariants = Object.keys(AUTODOR_LOGO_VARIANTS) as AutodorLogoVariant[];

const meta = {
  title: "Примитивы/Логотипы/AutodorLogo",
  component: AutodorLogo,
  parameters: { layout: "centered" },
  argTypes: {
    height: { control: { max: 192, min: 24, step: 4, type: "range" } },
    variant: { control: "inline-radio", options: autodorVariants },
  },
  args: { height: 72, variant: "full" },
} satisfies Meta<typeof AutodorLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gap: 16,
        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
        maxWidth: 960,
      }}
    >
      {autodorVariants.map((variant) => (
        <div
          key={variant}
          style={{
            alignItems: "center",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-card)",
            display: "grid",
            gap: 8,
            justifyItems: "center",
            minHeight: 144,
            padding: 16,
          }}
        >
          <AutodorLogo height={72} variant={variant} />
          <code style={{ fontSize: 11, overflowWrap: "anywhere", textAlign: "center" }}>
            {variant}
          </code>
          <span style={{ color: "var(--color-text-muted)", fontSize: 11 }}>
            {AUTODOR_LOGO_VARIANTS[variant].label}
          </span>
        </div>
      ))}
    </div>
  ),
};

export const PartnerLogos: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
      {logoNames.map((name) => (
        <Logo key={name} name={name} size={96} />
      ))}
    </div>
  ),
};
