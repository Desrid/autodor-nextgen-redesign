import Image from "next/image";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { MediaGallery } from "./MediaGallery.client";

const descriptions = [
  {
    title: "Дорожная инфраструктура",
    description: "Пример фотографии в непрерывной медиа-ленте.",
  },
  {
    title: "Путешествие по трассе",
    description: "Вторая карточка демонстрирует циклическую прокрутку и lightbox.",
  },
  {
    title: "Новая дорога",
    description: "Подписи доступны в полноэкранном просмотре.",
  },
] as const;

const meta = {
  title: "Медиа/Галерея",
  component: MediaGallery,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Переиспользуемая горизонтальная галерея с auto-scroll, drag, клавиатурой и lightbox.",
      },
    },
  },
} satisfies Meta<typeof MediaGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <main className="section-shell" style={{ paddingBlock: "4rem" }}>
      <MediaGallery descriptions={descriptions} label="Примеры медиа">
        {descriptions.map((item, index) => (
          <Image
            key={item.title}
            src={`/media/gallery/gallery-0${index + 1}.webp`}
            alt={item.title}
            width={1280}
            height={720}
          />
        ))}
      </MediaGallery>
    </main>
  ),
};
