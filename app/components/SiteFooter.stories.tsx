import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { SiteFooter } from "./SiteFooter";

const meta = {
  title: "Навигация/Подвал",
  component: SiteFooter,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Повторяющиеся контактные, социальные, государственные и юридические ссылки в подвале.",
      },
    },
  },
} satisfies Meta<typeof SiteFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
