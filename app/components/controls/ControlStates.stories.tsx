import { useState, type ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ArrowIcon } from "../ArrowIcon";

const panelStyle = {
  background: "var(--color-surface)",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-card)",
  display: "grid",
  gap: 16,
  padding: 24,
} as const;

function Group({ children, title }: Readonly<{ children: ReactNode; title: string }>) {
  return (
    <section style={panelStyle}>
      <h2 style={{ fontSize: 22, margin: 0 }}>{title}</h2>
      {children}
    </section>
  );
}

function StateLabel({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <span style={{ color: "var(--color-text-muted)", fontSize: 12 }}>{children}</span>
  );
}

function ButtonStates() {
  return (
    <Group title="Кнопки">
      <div style={{ alignItems: "start", display: "flex", flexWrap: "wrap", gap: 20 }}>
        <div style={{ display: "grid", gap: 8 }}>
          <button className="primary-button" type="button">
            Основное действие
          </button>
          <StateLabel>default</StateLabel>
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          <button
            className="primary-button"
            style={{ background: "var(--color-brand-orange-hover)" }}
            type="button"
          >
            Основное действие
          </button>
          <StateLabel>hover / active</StateLabel>
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          <button className="primary-button" disabled type="button">
            Основное действие
          </button>
          <StateLabel>disabled</StateLabel>
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          <button className="icon-button" type="button" aria-label="Продолжить">
            <ArrowIcon direction="right" />
          </button>
          <StateLabel>icon</StateLabel>
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          <button className="card-cta" type="button">
            Текстовый CTA <ArrowIcon className="card-cta__icon" direction="right" />
          </button>
          <StateLabel>inline CTA</StateLabel>
        </div>
      </div>
    </Group>
  );
}

function FieldStates() {
  return (
    <Group title="Поля ввода">
      <div
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
        }}
      >
        <label style={{ display: "grid", gap: 8 }}>
          <StateLabel>default</StateLabel>
          <input
            placeholder="Город отправления"
            style={{
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-control)",
              padding: "12px 14px",
            }}
          />
        </label>
        <label style={{ display: "grid", gap: 8 }}>
          <StateLabel>filled</StateLabel>
          <input
            defaultValue="Москва"
            style={{
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-control)",
              padding: "12px 14px",
            }}
          />
        </label>
        <label style={{ display: "grid", gap: 8 }}>
          <StateLabel>focus</StateLabel>
          <input
            defaultValue="Москва"
            style={{
              border: "2px solid var(--color-brand-orange)",
              borderRadius: "var(--radius-control)",
              outline: "2px solid var(--color-brand-orange-soft)",
              padding: "11px 13px",
            }}
          />
        </label>
        <label style={{ display: "grid", gap: 8 }}>
          <StateLabel>error</StateLabel>
          <input
            aria-invalid="true"
            defaultValue="Неизвестный город"
            style={{
              border:
                "2px solid color-mix(in srgb, var(--color-brand-orange) 70%, var(--color-brand-black))",
              borderRadius: "var(--radius-control)",
              padding: "11px 13px",
            }}
          />
          <span
            style={{
              color:
                "color-mix(in srgb, var(--color-brand-orange) 70%, var(--color-brand-black))",
              fontSize: 12,
            }}
          >
            Проверьте значение
          </span>
        </label>
        <label style={{ display: "grid", gap: 8 }}>
          <StateLabel>disabled</StateLabel>
          <input
            disabled
            defaultValue="Недоступно"
            style={{
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-control)",
              padding: "12px 14px",
            }}
          />
        </label>
      </div>
    </Group>
  );
}

function SelectionStates() {
  const [switchOn, setSwitchOn] = useState(true);
  const [checked, setChecked] = useState(true);

  return (
    <Group title="Выбор и переключение">
      <div style={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: 28 }}>
        <label style={{ alignItems: "center", display: "flex", gap: 8 }}>
          <input
            checked={checked}
            onChange={(event) => setChecked(event.target.checked)}
            type="checkbox"
          />{" "}
          Получать уведомления
        </label>
        <label style={{ alignItems: "center", display: "flex", gap: 8 }}>
          <input checked disabled type="checkbox" /> Недоступно
        </label>
        <button
          aria-checked={switchOn}
          onClick={() => setSwitchOn((value) => !value)}
          role="switch"
          style={{
            background: switchOn ? "var(--color-brand-orange)" : "var(--color-gray-5)",
            border: 0,
            borderRadius: 999,
            height: 32,
            padding: 4,
            width: 56,
          }}
          type="button"
        >
          <span
            style={{
              background: "var(--color-page)",
              borderRadius: "50%",
              display: "block",
              height: 24,
              marginLeft: switchOn ? 24 : 0,
              transition: "margin 160ms ease",
              width: 24,
            }}
          />
        </button>
        <button
          aria-checked="false"
          disabled
          role="switch"
          style={{
            background: "var(--color-gray-3)",
            border: 0,
            borderRadius: 999,
            height: 32,
            padding: 4,
            width: 56,
          }}
          type="button"
        >
          <span
            style={{
              background: "var(--color-page)",
              borderRadius: "50%",
              display: "block",
              height: 24,
              width: 24,
            }}
          />
        </button>
      </div>
    </Group>
  );
}

function TabStates() {
  const [active, setActive] = useState("Маршруты");
  const tabs = ["Маршруты", "Тарифы", "Сервисы"];

  return (
    <Group title="Табы">
      <div
        role="tablist"
        style={{
          borderBottom: "1px solid var(--color-border)",
          display: "flex",
          gap: 8,
        }}
      >
        {tabs.map((tab) => (
          <button
            aria-selected={active === tab}
            key={tab}
            onClick={() => setActive(tab)}
            role="tab"
            style={{
              background: "transparent",
              border: 0,
              borderBottom:
                active === tab
                  ? "3px solid var(--color-brand-orange)"
                  : "3px solid transparent",
              color: active === tab ? "var(--color-text)" : "var(--color-text-muted)",
              fontWeight: active === tab ? 700 : 500,
              padding: "10px 12px",
            }}
            type="button"
          >
            {tab}
          </button>
        ))}
      </div>
      <p style={{ margin: 0 }}>Выбран раздел: {active}.</p>
    </Group>
  );
}

function DialogState() {
  return (
    <Group title="Диалог подтверждения">
      <div
        role="alertdialog"
        aria-labelledby="dialog-title"
        style={{
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-card)",
          display: "grid",
          gap: 16,
          maxWidth: 480,
          padding: 24,
        }}
      >
        <h3 id="dialog-title" style={{ margin: 0 }}>
          Удалить госномер?
        </h3>
        <p style={{ margin: 0 }}>Это действие нельзя отменить.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "end" }}>
          <button type="button">Отмена</button>
          <button
            style={{
              background:
                "color-mix(in srgb, var(--color-brand-orange) 70%, var(--color-brand-black))",
              border: 0,
              borderRadius: "var(--radius-control)",
              color: "var(--color-page)",
              padding: "10px 14px",
            }}
            type="button"
          >
            Удалить
          </button>
        </div>
      </div>
    </Group>
  );
}

function ControlStates() {
  return (
    <main style={{ display: "grid", gap: 24, maxWidth: 1180, padding: 32 }}>
      <header>
        <p style={{ color: "var(--color-text-muted)", margin: "0 0 8px" }}>Примитивы</p>
        <h1 style={{ fontSize: "clamp(2rem, 4vw, 4rem)", margin: 0 }}>
          Состояния controls
        </h1>
        <p style={{ color: "var(--color-text-muted)" }}>
          Матрица повторяющихся состояний из шапки, планировщика маршрута, карточек и
          личного кабинета.
        </p>
      </header>
      <ButtonStates />
      <FieldStates />
      <SelectionStates />
      <TabStates />
      <DialogState />
    </main>
  );
}

const meta = {
  component: ControlStates,
  title: "Примитивы/Контролы/Состояния",
} satisfies Meta<typeof ControlStates>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllStates: Story = { name: "Все состояния" };
