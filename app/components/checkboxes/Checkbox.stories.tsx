import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Checkbox } from "./Checkbox";

const meta = {
  args: { label: "Получать уведомления" },
  component: Checkbox,
  title: "Примитивы/Чекбоксы/Checkbox",
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const States: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16 }}>
      <Checkbox label="Не выбрано" />
      <Checkbox defaultChecked label="Выбрано" />
      <Checkbox disabled label="Disabled" />
      <Checkbox defaultChecked disabled label="Disabled, выбрано" />
    </div>
  ),
};
