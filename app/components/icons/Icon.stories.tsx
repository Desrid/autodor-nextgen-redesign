import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ACTION_ICONS, ICONS, ICON_SIZES, Icon, type IconName } from "./Icon";

const iconNames = [...Object.keys(ICONS), ...Object.keys(ACTION_ICONS)] as IconName[];
const definitions = { ...ICONS, ...ACTION_ICONS };
const groups = [...new Set(Object.values(definitions).map((icon) => icon.group))];

const meta = {
  title: "Примитивы/Иконки/Icon",
  component: Icon,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Единый каталог уникальных иконок без интерактивной подложки. Квадратные поверхности и состояния находятся в отдельном компоненте IconButton.",
      },
    },
  },
  argTypes: {
    name: { control: "select", options: iconNames },
    size: { control: "inline-radio", options: ICON_SIZES },
  },
  args: { name: "search", size: 24 },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 32, maxWidth: 960 }}>
      {groups.map((group) => (
        <section key={group}>
          <h2 style={{ fontSize: 20 }}>{group}</h2>
          <div
            style={{
              display: "grid",
              gap: 16,
              gridTemplateColumns: "repeat(auto-fill, minmax(128px, 1fr))",
            }}
          >
            {iconNames
              .filter((name) => definitions[name].group === group)
              .map((name) => (
                <div
                  key={name}
                  style={{
                    alignItems: "center",
                    display: "grid",
                    gap: 8,
                    justifyItems: "center",
                    minHeight: 84,
                    padding: "12px 4px",
                    color:
                      group === "Маршрут"
                        ? "var(--color-brand-orange)"
                        : "var(--color-brand-black)",
                  }}
                >
                  <Icon name={name} size={32} />
                  <code
                    style={{
                      fontSize: 11,
                      overflowWrap: "anywhere",
                      textAlign: "center",
                    }}
                  >
                    {name}
                  </code>
                  <span style={{ color: "var(--color-text-muted)", fontSize: 11 }}>
                    {definitions[name].label}
                  </span>
                </div>
              ))}
          </div>
        </section>
      ))}
    </div>
  ),
};

export const SizeVariants: Story = {
  name: "Размеры 16 / 24 / 32",
  render: () => (
    <div style={{ display: "grid", gap: 16, maxWidth: 960 }}>
      {iconNames.map((name) => (
        <div
          key={name}
          style={{
            alignItems: "center",
            borderBottom: "1px solid var(--color-border)",
            display: "grid",
            gap: 16,
            gridTemplateColumns: "minmax(10rem, 1fr) repeat(3, 4rem)",
            padding: "12px 0",
          }}
        >
          <div>
            <strong>{definitions[name].label}</strong>
            <code
              style={{
                color: "var(--color-text-muted)",
                display: "block",
                fontSize: 11,
              }}
            >
              {name}
            </code>
          </div>
          {ICON_SIZES.map((size) => (
            <div
              key={size}
              style={{
                alignItems: "center",
                display: "grid",
                gap: 4,
                justifyItems: "center",
              }}
            >
              <Icon name={name} size={size} />
              <span style={{ color: "var(--color-text-muted)", fontSize: 11 }}>
                {size}×{size}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
};
