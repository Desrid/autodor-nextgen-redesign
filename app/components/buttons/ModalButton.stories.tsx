import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ModalButton } from "./ButtonPrimitives";

const meta = {
  component: ModalButton,
  title: "Примитивы/Кнопки/ModalButton",
  args: { children: "Подтвердить", variant: "confirm" },
  argTypes: {
    variant: { control: "inline-radio", options: ["cancel", "confirm", "destructive"] },
  },
} satisfies Meta<typeof ModalButton>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const DialogActions: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
      <ModalButton variant="cancel">Отмена</ModalButton>
      <ModalButton variant="confirm">Подтвердить</ModalButton>
      <ModalButton variant="destructive">Удалить</ModalButton>
      <ModalButton disabled variant="confirm">
        Подтвердить
      </ModalButton>
    </div>
  ),
};
