import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { ReactNode } from "react";

import { TransponderDeviceIcon } from "../../account/TransponderDeviceIcon";
import { ACTION_ICONS, Icon, type IconName } from "./Icon";
import { ICON_AUDIT_INVENTORY } from "./icon-audit-registry";

const iconNames = Object.keys(ACTION_ICONS) as IconName[];
const sizes = [16, 20, 24] as const;

function Surface({
  dark,
  children,
}: Readonly<{ dark?: boolean; children: ReactNode }>) {
  return (
    <span
      style={{
        alignItems: "center",
        background: dark ? "#2d2a26" : "#ffffff",
        border: `1px solid ${dark ? "#514c46" : "#e4e0dc"}`,
        borderRadius: 10,
        color: dark ? "#ffffff" : "#2d2a26",
        display: "inline-flex",
        gap: 10,
        minHeight: 44,
        padding: "8px 12px",
      }}
    >
      {children}
    </span>
  );
}

function IconAuditGallery() {
  const excluded = ICON_AUDIT_INVENTORY.filter((entry) => entry.status === "excluded");

  return (
    <main style={{ display: "grid", gap: 40, maxWidth: 1600, padding: 32 }}>
      <header style={{ display: "grid", gap: 8 }}>
        <p style={{ color: "#786f67", margin: 0 }}>
          Machine-readable source: icon-audit-registry.ts
        </p>
        <h1 style={{ fontSize: 44, margin: 0 }}>Полный аудит UI-иконок</h1>
        <p style={{ lineHeight: 1.6, margin: 0, maxWidth: 900 }}>
          Канонический outline-набор: 24×24, currentColor, stroke 1.75, round caps and
          joins. Каждая иконка проверяется в 16/20/24 px, на светлой и тёмной
          поверхности, в кнопке и рядом с текстом.
        </p>
      </header>

      <section style={{ display: "grid", gap: 16 }}>
        <h2 style={{ margin: 0 }}>Канонический каталог · {iconNames.length}</h2>
        <div style={{ display: "grid", gap: 12 }}>
          {iconNames.map((name) => (
            <article
              key={name}
              style={{
                alignItems: "center",
                border: "1px solid #e4e0dc",
                borderRadius: 14,
                display: "grid",
                gap: 12,
                gridTemplateColumns:
                  "minmax(180px, .8fr) minmax(280px, 1.3fr) minmax(280px, 1.3fr)",
                padding: 14,
              }}
            >
              <span style={{ display: "grid", gap: 4 }}>
                <strong>{ACTION_ICONS[name as keyof typeof ACTION_ICONS].label}</strong>
                <code style={{ color: "#786f67" }}>{name}</code>
              </span>
              <Surface>
                {sizes.map((size) => (
                  <span
                    key={size}
                    style={{ alignItems: "center", display: "inline-flex", gap: 4 }}
                  >
                    <Icon name={name} size={size} />
                    <small>{size}</small>
                  </span>
                ))}
              </Surface>
              <Surface dark>
                {sizes.map((size) => (
                  <Icon key={size} name={name} size={size} />
                ))}
                <button
                  aria-label={`Действие: ${ACTION_ICONS[name as keyof typeof ACTION_ICONS].label}`}
                  style={{
                    alignItems: "center",
                    background: "#ff5100",
                    border: 0,
                    borderRadius: 8,
                    color: "white",
                    display: "inline-flex",
                    height: 36,
                    justifyContent: "center",
                    width: 36,
                  }}
                  type="button"
                >
                  <Icon name={name} size={20} />
                </button>
                <span style={{ alignItems: "center", display: "inline-flex", gap: 6 }}>
                  <Icon name={name} size={16} /> Текст
                </span>
              </Surface>
            </article>
          ))}
        </div>
      </section>

      <section style={{ display: "grid", gap: 12 }}>
        <h2 style={{ margin: 0 }}>Условные и скрытые состояния</h2>
        <div style={{ display: "grid", gap: 8 }}>
          {ICON_AUDIT_INVENTORY.filter((entry) => entry.status !== "excluded").map(
            (entry) => (
              <article
                key={entry.id}
                style={{
                  border: "1px solid #e4e0dc",
                  borderRadius: 12,
                  display: "grid",
                  gap: 8,
                  padding: 14,
                }}
              >
                <div
                  style={{
                    alignItems: "baseline",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                  }}
                >
                  <strong>{entry.id}</strong>
                  <code style={{ color: "#786f67" }}>{entry.source}</code>
                  <span
                    style={{
                      color: entry.status === "canonical" ? "#1b7355" : "#a55b00",
                    }}
                  >
                    {entry.status}
                  </span>
                </div>
                <p style={{ margin: 0 }}>
                  <b>State:</b> {entry.state}
                </p>
                <div
                  style={{
                    alignItems: "center",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                  }}
                >
                  {entry.icons.map((name) => (
                    <Surface key={name}>
                      <Icon name={name} size={20} />
                      <code>{name}</code>
                    </Surface>
                  ))}
                </div>
                <small style={{ color: "#786f67" }}>{entry.note}</small>
              </article>
            ),
          )}
        </div>
      </section>

      <section style={{ display: "grid", gap: 12 }}>
        <h2 style={{ margin: 0 }}>Осознанные исключения · {excluded.length}</h2>
        {excluded.map((entry) => (
          <article
            key={entry.id}
            style={{
              borderInlineStart: "4px solid #b6afa8",
              display: "grid",
              gap: 4,
              padding: "8px 12px",
            }}
          >
            <strong>
              {entry.id} · {entry.category}
            </strong>
            {entry.id === "account-transponder-device" ? (
              <span
                aria-label="Прежняя детализированная иконка транспондера T-pass"
                role="img"
                style={{
                  alignItems: "center",
                  background: "#fff7f3",
                  border: "1px solid #f0ded5",
                  borderRadius: 12,
                  display: "inline-flex",
                  height: 88,
                  justifyContent: "center",
                  width: 88,
                }}
              >
                <TransponderDeviceIcon
                  style={{ display: "block", height: 66, width: 56 }}
                />
              </span>
            ) : null}
            <code>{entry.source}</code>
            <span>{entry.note}</span>
          </article>
        ))}
      </section>
    </main>
  );
}

const meta = {
  component: IconAuditGallery,
  parameters: { layout: "fullscreen" },
  title: "Основы/Иконки/Полный аудит",
} satisfies Meta<typeof IconAuditGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CompleteInventory: Story = { name: "Все UI-иконки и состояния" };
