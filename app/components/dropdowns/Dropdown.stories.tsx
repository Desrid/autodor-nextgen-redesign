import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Dropdown } from "./Dropdown";

const options = ["Легковой автомобиль", "Мотоцикл", "Автодом"];
const meta = {
  args: { label: "Транспорт", options },
  component: Dropdown,
  title: "Примитивы/Дропдауны/Dropdown",
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const States: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 18, maxWidth: 360 }}>
      <Dropdown label="Транспорт" options={options} />
      <Dropdown defaultValue="Автодом" label="Выбранное значение" options={options} />
      <Dropdown disabled label="Disabled" options={options} />
    </div>
  ),
};
