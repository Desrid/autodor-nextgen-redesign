import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LinkButton } from "./ButtonPrimitives";

const meta = {
  component: LinkButton,
  title: "Примитивы/Кнопки/LinkButton",
  args: { children: "Подробнее", href: "#details" },
} satisfies Meta<typeof LinkButton>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const CardCta: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 20 }}>
      <LinkButton href="#route">Рассчитать маршрут</LinkButton>
      <LinkButton disabled href="#route">
        Недоступная ссылка
      </LinkButton>
    </div>
  ),
};
