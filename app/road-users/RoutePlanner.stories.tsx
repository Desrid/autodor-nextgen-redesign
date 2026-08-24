import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RoutePlanner } from "./RoutePlanner.client";

const meta = {
  component: RoutePlanner,
  title: "Секции/Пользователи дорог/Планировщик маршрута",
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof RoutePlanner>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
