import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { IconButton } from "./ButtonPrimitives";

const meta = {
  component: IconButton,
  title: "Примитивы/Кнопки/IconButton",
  args: { icon: "filter", label: "Фильтры" },
} satisfies Meta<typeof IconButton>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Actions: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
      <IconButton icon="filter" label="Фильтры" />
      <IconButton icon="edit" label="Редактировать" />
      <IconButton icon="delete" label="Удалить" />
      <IconButton icon="plus" label="Добавить" />
      <IconButton disabled icon="expand" label="Развернуть" />
    </div>
  ),
};
