import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ArrowIcon } from "./ArrowIcon";

const meta = {
  title: "Примитивы/ArrowIcon",
  component: ArrowIcon,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Базовая стрелка навигации во всех поддерживаемых направлениях.",
      },
    },
  },
  argTypes: {
    direction: {
      control: "inline-radio",
      options: ["up", "right", "down", "left"],
    },
  },
  args: {
    direction: "right",
  },
} satisfies Meta<typeof ArrowIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllDirections: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 3rem)",
        gap: "1rem",
        color: "var(--color-brand-orange)",
      }}
    >
      {(["up", "right", "down", "left"] as const).map((direction) => (
        <div
          key={direction}
          style={{
            display: "grid",
            width: "3rem",
            height: "3rem",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-control)",
            placeItems: "center",
          }}
        >
          <ArrowIcon direction={direction} />
        </div>
      ))}
    </div>
  ),
};
