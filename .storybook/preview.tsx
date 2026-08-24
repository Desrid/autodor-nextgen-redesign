import type { Preview } from "@storybook/nextjs-vite";

import "../app/globals.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: [
          "Основы",
          "Примитивы",
          "Компоненты",
          "Навигация",
          "Карточки",
          "Статистика",
          "Медиа",
          "Секции",
          "Страницы",
          "Паттерны",
          "Каталог",
        ],
      },
    },
  },
  tags: ["autodocs"],
};

export default preview;
