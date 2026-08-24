import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ServicesGrid } from "./ServicesGrid";

const meta = {
  title: "Карточки/Сервисные",
  component: ServicesGrid,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Шесть интерактивных сервисных карточек: hover/focus раскрывает сценарий, а click открывает подробности.",
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
} satisfies Meta<typeof ServicesGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
