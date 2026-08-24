import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { RoadStatistics } from "./RoadStatistics.client";

const meta = {
  title: "Статистика/Тарифы дорог",
  component: RoadStatistics,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Факты, bar-chart и таблица тарифов в контексте выбранной дороги. Семантически это статистика, но визуально — аналитическая панель.",
      },
    },
  },
  decorators: [
    (Story) => (
      <main className="section-shell" style={{ paddingBlock: "4rem" }}>
        <Story />
      </main>
    ),
  ],
} satisfies Meta<typeof RoadStatistics>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
