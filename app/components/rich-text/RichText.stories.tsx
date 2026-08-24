import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { RichText } from "./RichText";

const meta = {
  args: { label: "Описание" },
  component: RichText,
  title: "Примитивы/Рич-текст/RichText",
} satisfies Meta<typeof RichText>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const States: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 18, maxWidth: 560 }}>
      <RichText label="Пустой текст" />
      <RichText
        label="Заполненный текст"
        value={
          <>
            Проезд по трассе доступен <strong>круглосуточно</strong>.
          </>
        }
      />
      <RichText disabled label="Disabled" value="Редактирование недоступно" />
    </div>
  ),
};
