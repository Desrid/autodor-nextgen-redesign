import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { RoadStatusRail, type RoadStatus } from "./RoadStatusRail.client";

const SAMPLE_STATUSES = [
  {
    road: "М-1 «Беларусь»",
    status: "Движение свободное",
    detail: "Без ограничений",
    tone: "free",
  },
  {
    road: "М-3 «Украина»",
    status: "Дорожные работы",
    detail: "96–101 км",
    tone: "work",
  },
  {
    road: "М-4 «Дон»",
    status: "Движение свободное",
    detail: "Без ограничений",
    tone: "free",
  },
  {
    road: "М-11 «Нева»",
    status: "Дорожные работы",
    detail: "536–542 км",
    tone: "work",
  },
  {
    road: "М-12 «Восток»",
    status: "Движение свободное",
    detail: "Без ограничений",
    tone: "free",
  },
] as const satisfies readonly RoadStatus[];

const meta = {
  title: "Компоненты/RoadStatusRail",
  component: RoadStatusRail,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Горизонтальная лента оперативных статусов дорог с клавиатурной навигацией.",
      },
    },
  },
  decorators: [
    (Story) => (
      <main className="section-shell" style={{ paddingBlock: "7rem 4rem" }}>
        <Story />
      </main>
    ),
  ],
  args: {
    items: SAMPLE_STATUSES,
  },
} satisfies Meta<typeof RoadStatusRail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SingleRoad: Story = {
  args: {
    items: SAMPLE_STATUSES.slice(0, 1),
  },
};
