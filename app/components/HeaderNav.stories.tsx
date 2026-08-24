import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { HeaderNav } from "./HeaderNav.client";

const meta = {
  title: "Навигация/Шапка",
  component: HeaderNav,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Главная навигация: первичные ссылки, megamenu, поиск, языковой переключатель и мобильное меню.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: "52rem" }}>
        <Story />
        <main className="section-shell" style={{ paddingBlock: "8rem" }}>
          <h1>Проверочная область шапки</h1>
          <p>Прокрутка canvas показывает scrolled-состояние.</p>
        </main>
      </div>
    ),
  ],
} satisfies Meta<typeof HeaderNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
