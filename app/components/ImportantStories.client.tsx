"use client";

import Image from "next/image";
import { useState } from "react";

import { ArrowIcon } from "@/app/components/ArrowIcon";

import styles from "./ImportantStories.module.css";

const IMPORTANT_STORIES = [
  {
    id: "transport-complex",
    eyebrow: "Федеральный портал",
    title: "Всё о транспортном комплексе России",
    description:
      "Официальные новости, проекты и сервисы Министерства транспорта Российской Федерации.",
    href: "https://transport.gov.ru/",
    image: "/media/important/transport-complex.png",
    imageAlt:
      "Мультимодальный транспортный узел с автомобильными дорогами, железной дорогой и речным портом",
  },
  {
    id: "russia-news",
    eyebrow: "Новости России",
    title: "Развитие дорожной инфраструктуры",
    description:
      "Ключевые события, новые маршруты и изменения на сети федеральных дорог.",
    href: "https://www.russianhighways.ru/press/news/",
    image: "/media/important/road-infrastructure.png",
    imageAlt: "Многоуровневая дорожная развязка на рассвете",
  },
  {
    id: "roads-of-war",
    eyebrow: "Специальный проект",
    title: "Дороги войны",
    description:
      "Истории дорожников и транспортной инфраструктуры в годы Великой Отечественной войны.",
    href: "https://www.russianhighways.ru/",
    image: "/media/important/roads-of-war.png",
    imageAlt: "Дорожные рабочие восстанавливают деревянный мост в 1940-х годах",
  },
] as const;

export default function ImportantStories() {
  const [activeIndex, setActiveIndex] = useState(0);
  const story = IMPORTANT_STORIES[activeIndex]!;

  const showStory = (direction: -1 | 1) => {
    setActiveIndex(
      (index) =>
        (index + direction + IMPORTANT_STORIES.length) % IMPORTANT_STORIES.length,
    );
  };

  return (
    <div className="important-stories" data-testid="important-stories">
      <div
        className="important-stories__controls"
        role="group"
        aria-label="Переключение важной информации"
      >
        <button
          type="button"
          onClick={() => showStory(-1)}
          aria-label="Предыдущая тема"
        >
          <ArrowIcon direction="left" />
        </button>
        <button type="button" onClick={() => showStory(1)} aria-label="Следующая тема">
          <ArrowIcon direction="right" />
        </button>
      </div>

      <article
        className={`important-state ${styles.compactCard}`}
        aria-labelledby={`important-story-${story.id}`}
      >
        <Image
          key={story.id}
          className="important-state__image"
          src={story.image}
          alt={story.imageAlt}
          width={1600}
          height={900}
          sizes="(max-width: 767px) 100vw, 90vw"
          unoptimized
        />
        <div className={`important-state__content ${styles.compactContent}`}>
          <p className="important-state__meta">{story.eyebrow}</p>
          <h3 id={`important-story-${story.id}`}>{story.title}</h3>
          <p>{story.description}</p>
          <a
            className="important-state__link"
            href={story.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            Открыть источник
            <ArrowIcon className="inline-arrow-icon" direction="right" />
            <span className="visually-hidden"> (откроется в новой вкладке)</span>
          </a>
        </div>
      </article>
    </div>
  );
}

export { IMPORTANT_STORIES };
