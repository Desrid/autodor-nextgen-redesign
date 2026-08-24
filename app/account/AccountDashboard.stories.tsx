import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AccountDashboard } from "./AccountDashboard.client";

const meta = {
  component: AccountDashboard,
  title: "Страницы/Личный кабинет",
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof AccountDashboard>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
