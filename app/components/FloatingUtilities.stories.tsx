import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { FloatingUtilities } from "./FloatingUtilities.client";

const meta = {
  title: "Навигация/Плавающие действия",
  component: FloatingUtilities,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Фиксированные действия «наверх» и «чат». В story можно открыть диалог и проверить FAQ-состояние.",
      },
    },
  },
  decorators: [
    (Story) => (
      <main style={{ minHeight: "52rem", padding: "4rem var(--page-gutter)" }}>
        <p>Прокрутите canvas или откройте чат кнопкой справа снизу.</p>
        <Story />
      </main>
    ),
  ],
} satisfies Meta<typeof FloatingUtilities>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
