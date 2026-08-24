import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ContactsTabs } from "./ContactsTabs.client";

const meta = {
  title: "Навигация/Контакты",
  component: ContactsTabs,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Табличная навигация по контактам с активным состоянием, горизонтальной прокруткой на мобильном и карточкой выбранного адресата.",
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
} satisfies Meta<typeof ContactsTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
