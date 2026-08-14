"use client";

import { useEffect, useState } from "react";

import { ArrowIcon } from "@/app/components/ArrowIcon";

import styles from "./UsefulStories.module.css";

type Story = {
  title: string;
  lead: string;
  image: string;
  description: string;
};

const stories: Story[] = [
  { title: "Тарифы и способы оплаты", lead: "Оплата проезда без лишних остановок", image: "/media/road-user-stories/toll-payment.png", description: "Проверьте способ оплаты до поездки и сохраните время на пункте взимания платы." },
  { title: "Помощь на дороге", lead: "Поддержка рядом, когда она нужна", image: "/media/road-user-stories/roadside-help.png", description: "При нештатной ситуации остановитесь безопасно и позвоните *2323." },
  { title: "Транспондер", lead: "Быстрее на полосе T-PASS", image: "/media/road-user-stories/transponder.png", description: "Транспондер помогает проезжать пункты оплаты без остановки." },
  { title: "Документы и правила", lead: "Спокойная поездка начинается с правил", image: "/media/road-user-stories/travel-rules.png", description: "Выбирайте подходящую полосу и следите за дорожной обстановкой." },
];

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function UsefulStories() {
  const [open, setOpen] = useState<number | null>(null);
  const close = () => setOpen(null);
  const goTo = (index: number) => setOpen((index + stories.length) % stories.length);
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
          <button key={story.title} className={styles.card} type="button" onClick={() => setOpen(index)}>
            <img src={story.image} alt="" />
            <span>0{index + 1}</span>
            <strong>{story.title}</strong>
            <small>{story.lead}</small>
            <ArrowIcon direction="right" />
          </button>
        ))}
      </div>

      {open !== null && currentStory && (
        <div className={styles.backdrop} role="presentation" onMouseDown={close}>
          <section className={styles.modal} role="dialog" aria-modal="true" aria-label={currentStory.title} onMouseDown={(event) => event.stopPropagation()}>
            <img src={currentStory.image} alt="" />
            <div className={styles.progress} aria-hidden="true">
              {stories.map((_, index) => <i key={index} className={index <= open ? styles.active : ""} />)}
            </div>
            <button className={styles.close} type="button" onClick={close} aria-label="Закрыть историю"><CloseIcon /></button>
            <div className={styles.copy}>
              <p>0{open + 1} / 0{stories.length}</p>
              <h3>{currentStory.title}</h3>
              <strong>{currentStory.lead}</strong>
              <span>{currentStory.description}</span>
            </div>
            <button className={styles.prev} type="button" onClick={() => goTo(open - 1)} aria-label="Предыдущая история"><ArrowIcon direction="left" /></button>
            <button className={styles.next} type="button" onClick={() => goTo(open + 1)} aria-label="Следующая история"><ArrowIcon direction="right" /></button>
          </section>
        </div>
      )}
    </>
  );
}
