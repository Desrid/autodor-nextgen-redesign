import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { StatisticsBlock } from "./StatisticsBlock";

const meta = {
  title: "Статистика/Строительство",
  component: StatisticsBlock,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Три связанные панели: итоговый показатель, годовая динамика и donut-распределение видов дорожных работ.",
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
} satisfies Meta<typeof StatisticsBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
