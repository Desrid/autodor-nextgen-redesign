import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CloseButton } from "./ButtonPrimitives";

const meta = {
  component: CloseButton,
  title: "Примитивы/Кнопки/CloseButton",
} satisfies Meta<typeof CloseButton>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const ModalAndInput: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16 }}>
      <CloseButton label="Закрыть модальное окно" />
      <CloseButton label="Очистить поле" />
      <CloseButton disabled label="Недоступное закрытие" />
    </div>
  ),
};
