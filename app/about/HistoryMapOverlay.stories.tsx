import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HistoryMapOverlay } from "./HistoryMapOverlay.client";

const meta = {
  component: HistoryMapOverlay,
  title: "Страницы/О компании/История на карте",
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof HistoryMapOverlay>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
