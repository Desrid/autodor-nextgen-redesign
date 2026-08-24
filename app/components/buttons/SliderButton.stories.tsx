import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SliderButton } from "./ButtonPrimitives";

const meta = {
  component: SliderButton,
  title: "Примитивы/Кнопки/SliderButton",
  args: { direction: "right" },
  argTypes: { direction: { control: "inline-radio", options: ["left", "right"] } },
} satisfies Meta<typeof SliderButton>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const States: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12 }}>
      <SliderButton direction="left" />
      <SliderButton direction="right" />
      <SliderButton disabled direction="left" />
    </div>
  ),
};
