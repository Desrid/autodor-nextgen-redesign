import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { UsefulStories } from "./UsefulStories.client";

const meta = {
  component: UsefulStories,
  title: "Секции/Пользователи дорог/Полезные истории",
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof UsefulStories>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
