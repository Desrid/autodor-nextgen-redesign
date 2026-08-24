import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { TextInput } from "./TextInput";

const meta = {
  args: { label: "Город отправления", placeholder: "Москва" },
  component: TextInput,
  title: "Примитивы/Поля ввода/TextInput",
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const States: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 18, maxWidth: 360 }}>
      <TextInput label="Пустое поле" placeholder="Введите значение" />
      <TextInput defaultValue="Москва" label="Заполненное поле" />
      <TextInput
        defaultValue="Неизвестный город"
        error="Проверьте значение"
        label="Ошибка"
      />
      <TextInput defaultValue="Недоступно" disabled label="Disabled" />
    </div>
  ),
};
