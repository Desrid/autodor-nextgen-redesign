import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ACTION_ICONS, ICONS, Icon, type IconName } from "./icons/Icon";

const definitions = { ...ICONS, ...ACTION_ICONS };
const iconNames = Object.keys(definitions) as IconName[];
const groups = [...new Set(Object.values(definitions).map((icon) => icon.group))];

function IconGallery() {
  return (
    <main style={{ display: "grid", gap: 40, maxWidth: 1480, padding: 32 }}>
      <header>
        <p style={{ color: "var(--color-text-muted)", margin: "0 0 8px" }}>Основы</p>
        <h1 style={{ fontSize: "clamp(2rem, 4vw, 4rem)", margin: 0 }}>Иконки</h1>
        <p style={{ color: "var(--color-text-muted)", marginBottom: 0, maxWidth: 760 }}>
          Уникальные варианты из header, footer, личного кабинета и планировщика
          маршрута. Здесь показаны самостоятельные иконки; интерактивные квадратные
          поверхности, состояния и доступные действия вынесены в <code>IconButton</code>
          .
        </p>
      </header>
      {groups.map((group) => (
        <section key={group}>
          <h2 style={{ fontSize: 24, margin: "0 0 16px" }}>{group}</h2>
          <div
            style={{
              display: "grid",
              gap: 16,
              gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
            }}
          >
            {iconNames
              .filter((name) => definitions[name].group === group)
              .map((name) => (
                <figure
                  key={name}
                  style={{
                    alignItems: "center",
                    display: "grid",
                    gap: 10,
                    justifyItems: "center",
                    margin: 0,
                    minHeight: 120,
                    padding: 12,
                  }}
                >
                  <div
                    style={{
                      alignItems: "center",
                      color:
                        group === "Маршрут"
                          ? "var(--color-brand-orange)"
                          : "var(--color-brand-black)",
                      display: "flex",
                      height: 52,
                      justifyContent: "center",
                    }}
                  >
                    <Icon name={name} size={32} />
                  </div>
                  <figcaption
                    style={{
                      display: "grid",
                      gap: 6,
                      justifyItems: "center",
                      textAlign: "center",
                    }}
                  >
                    <strong>{definitions[name].label}</strong>
                    <code style={{ color: "var(--color-text-muted)", fontSize: 11 }}>
                      {name}
                    </code>
                  </figcaption>
                </figure>
              ))}
          </div>
        </section>
      ))}
    </main>
  );
}

const meta = { component: IconGallery, title: "Основы/Иконки" } satisfies Meta<
  typeof IconGallery
>;

export default meta;
type Story = StoryObj<typeof meta>;
export const AllIcons: Story = { name: "Все иконки" };
