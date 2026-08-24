import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import ImportantStories from "./ImportantStories.client";

const meta = {
  title: "Карточки/Важная информация",
  component: ImportantStories,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Компактная карточка важной темы с навигацией между сюжетами и растянутой интерактивной областью.",
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
} satisfies Meta<typeof ImportantStories>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
