"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { ArrowIcon } from "@/app/components/ArrowIcon";
import { Icon } from "@/app/components/icons";

import styles from "./UsefulStories.module.css";

type Story = {
  title: string;
  lead: string;
  image: string;
  description: string;
  href: string;
};

const stories: Story[] = [
  {
    title: "Тарифы и способы оплаты",
    lead: "Оплата проезда без лишних остановок",
    image: "/media/road-user-stories/toll-payment.png",
    description:
      "Проверьте способ оплаты до поездки и сохраните время на пункте взимания платы.",
    href: "#calculator-title",
  },
  {
    title: "Помощь на дороге",
    lead: "Поддержка рядом, когда она нужна",
    image: "/media/road-user-stories/roadside-help.png",
    description: "При нештатной ситуации остановитесь безопасно и позвоните *2323.",
    href: "#status-title",
  },
  {
    title: "Транспондер",
    lead: "Быстрее на полосе T-PASS",
    image: "/media/road-user-stories/transponder.png",
    description: "Транспондер помогает проезжать пункты оплаты без остановки.",
    href: "#loyalty-title",
  },
  {
    title: "Документы и правила",
    lead: "Спокойная поездка начинается с правил",
    image: "/media/road-user-stories/travel-rules.png",
    description: "Выбирайте подходящую полосу и следите за дорожной обстановкой.",
    href: "#rules-title",
  },
];

export function UsefulStories() {
  const [open, setOpen] = useState<number | null>(null);
  const [seen, setSeen] = useState<Set<number>>(() => new Set());
  const close = () => setOpen(null);
  const goTo = (index: number) => setOpen((index + stories.length) % stories.length);
  const openStory = (index: number) => {
    setSeen((current) => new Set(current).add(index));
    setOpen(index);
  };
  const currentStory = open === null ? null : stories[open]!;

  useEffect(() => {
    if (open === null) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") goTo(open + 1);
      if (event.key === "ArrowLeft") goTo(open - 1);
    };

    document.body.classList.add(styles.locked!);
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.classList.remove(styles.locked!);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <div className={styles.grid}>
        {stories.map((story, index) => (
          <button
            key={story.title}
            className={`${styles.card} ${seen.has(index) ? styles.seen : ""}`}
            type="button"
            onClick={() => openStory(index)}
            aria-label={`Открыть историю: ${story.title}`}
          >
            <span className={styles.avatar}>
              <Image
                src={story.image}
                alt=""
                width={320}
                height={320}
                sizes="10.5rem"
              />
            </span>
            <strong>{story.title}</strong>
          </button>
        ))}
      </div>

      {open !== null && currentStory && (
        <div className={styles.backdrop} role="presentation" onMouseDown={close}>
          <section
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-label={currentStory.title}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <Image
              src={currentStory.image}
              alt=""
              fill
              sizes="(max-width: 767px) 100vw, 56rem"
            />
            <div className={styles.progress} aria-hidden="true">
              {stories.map((_, index) => (
                <i key={index} className={index <= open ? styles.active : ""} />
              ))}
            </div>
            <button
              className={styles.close}
              type="button"
              onClick={close}
              aria-label="Закрыть историю"
            >
              <Icon name="close" size={24} />
            </button>
            <div className={styles.copy}>
              <h3>{currentStory.title}</h3>
              <strong>{currentStory.lead}</strong>
              <span>{currentStory.description}</span>
              <a className={styles.more} href={currentStory.href} onClick={close}>
                Подробнее <ArrowIcon direction="right" />
              </a>
            </div>
            <button
              className={styles.prev}
              type="button"
              onClick={() => goTo(open - 1)}
              aria-label="Предыдущая история"
            >
              <ArrowIcon direction="left" />
            </button>
            <button
              className={styles.next}
              type="button"
              onClick={() => goTo(open + 1)}
              aria-label="Следующая история"
            >
              <ArrowIcon direction="right" />
            </button>
          </section>
        </div>
      )}
    </>
  );
}
