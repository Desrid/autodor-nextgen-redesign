import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Toggle } from "./Toggle";

const meta = {
  args: { checked: false, label: "Интероперабельность" },
  component: Toggle,
  title: "Примитивы/Тогглы/Toggle",
} satisfies Meta<typeof Toggle>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
function InteractiveToggle() {
  const [checked, setChecked] = useState(true);
  return (
    <Toggle
      checked={checked}
      label="Интероперабельность"
      onClick={() => setChecked((value) => !value)}
    />
  );
}
export const States: Story = {
  render: () => (
    <div style={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: 20 }}>
      <InteractiveToggle />
      <Toggle checked={false} label="Выключено" />
      <Toggle checked label="Включено" />
      <Toggle checked={false} disabled label="Недоступно, выключено" />
      <Toggle checked disabled label="Недоступно, включено" />
    </div>
  ),
};
