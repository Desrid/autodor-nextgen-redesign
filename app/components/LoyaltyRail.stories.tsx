import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import LoyaltyRail from "./LoyaltyRail.client";

const meta = {
  title: "Секции/LoyaltyRail",
  component: LoyaltyRail,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Карусель программ лояльности с рабочим, загрузочным, пустым и ошибочным состояниями.",
      },
    },
  },
  decorators: [
    (Story) => (
      <main className="section-shell loyalty-section" style={{ paddingBlock: "4rem" }}>
        <Story />
      </main>
    ),
  ],
  args: {
    state: "ready",
    onRetry: () => undefined,
  },
  argTypes: {
    state: {
      control: "inline-radio",
      options: ["ready", "loading", "empty", "error"],
    },
  },
} satisfies Meta<typeof LoyaltyRail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ready: Story = {};

export const Loading: Story = {
  args: {
    state: "loading",
  },
};

export const Empty: Story = {
  args: {
    state: "empty",
  },
};

export const Error: Story = {
  args: {
    state: "error",
  },
};
