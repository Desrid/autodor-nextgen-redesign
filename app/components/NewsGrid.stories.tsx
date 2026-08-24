import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { NewsGrid } from "./NewsGrid";

const meta = {
  title: "Карточки/Новостные",
  component: NewsGrid,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Редакционный bento-grid: ведущая карточка и компактные новости используют общий CTA, но разные плотность и контраст.",
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
} satisfies Meta<typeof NewsGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
