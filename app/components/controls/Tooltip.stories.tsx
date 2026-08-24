import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { IconButton } from "../buttons/ButtonPrimitives";
import { Tooltip } from "./Tooltip";

const meta = {
  component: Tooltip,
  title: "Примитивы/Контролы/Tooltip",
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {
  render: () => (
    <div style={{ padding: "140px 120px" }}>
      <Tooltip content="Подсказка открывается по наведению и при фокусе с клавиатуры.">
        <IconButton icon="info" label="Подробнее" />
      </Tooltip>
    </div>
  ),
};

export const WithImage: Story = {
  render: () => (
    <div style={{ padding: "180px 180px" }}>
      <Tooltip
        content="Один транспондер позволяет оплачивать проезд по дорогам разных операторов."
        image={{
          alt: "Схема интероперабельности",
          src: "/media/account/interoperability-diagram.png",
        }}
      >
        <IconButton icon="info" label="Подробнее об интероперабельности" />
      </Tooltip>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ padding: "140px 120px" }}>
      <Tooltip disabled content="Недоступная подсказка не открывается.">
        <IconButton disabled icon="info" label="Подробнее недоступно" />
      </Tooltip>
    </div>
  ),
};
