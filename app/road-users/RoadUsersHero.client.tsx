"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { ArrowIcon } from "@/app/components/ArrowIcon";

import styles from "./RoadUsersPage.module.css";
import { RoadTrafficSignal } from "./RoadTrafficSignal.client";

type HeroSlide = "road" | "promotion";

const SLIDES: Readonly<
  Record<
    HeroSlide,
    Readonly<{
      label: string;
      image: string;
      alt: string;
      title: readonly [string, string];
      lead: string;
      action: string;
      actionLabel: string;
    }>
  >
> = {
  road: {
    label: "М-4 «Дон»",
    image: "/media/road-users/road-users-hero-v1.png",
    alt: "Автомобиль на современной федеральной трассе",
    title: ["Всё для уверенной", "поездки"],
    lead: "Планируйте маршрут, оплачивайте проезд и получайте помощь в пути.",
    action: "#calculator-title",
    actionLabel: "Подробнее о дороге",
  },
  promotion: {
    label: "Локальная акция",
    image: "/media/road-users/road-users-local-promotion-demo.png",
    alt: "Автомобиль на трассе в вечернем свете",
    title: ["Выгода на", "М-4 «Дон»"],
    lead: "Место для локальной акции дороги: условия, период и предложение настраиваются для кампании.",
    action: "#calculator-title",
    actionLabel: "Участвовать в акции",
  },
};

export function RoadUsersHero() {
  const [activeSlide, setActiveSlide] = useState<HeroSlide>("road");
  const slide = SLIDES[activeSlide];
  const isPromotion = activeSlide === "promotion";

  return (
    <section
      className={`${styles.hero} ${isPromotion ? styles.heroPromotion : ""} section-shell`}
      aria-labelledby="road-users-title"
    >
      <Image
        className={styles.heroImage}
        src={slide.image}
        alt={slide.alt}
        fill
        priority
        sizes="(max-width: 767px) 100vw, 1480px"
      />
      <div className={styles.heroScrim} aria-hidden="true" />
      <div className={styles.heroContent}>
        <nav className={styles.breadcrumbs} aria-label="Хлебные крошки">
          <Link href="/">Главная</Link>
          <ArrowIcon direction="right" />
          <span aria-current="page">Пользователям автодорог</span>
        </nav>
        <div
          className={styles.heroSlideTabs}
          role="tablist"
          aria-label="Слайды главного баннера"
        >
          {(Object.keys(SLIDES) as HeroSlide[]).map((slideName) => (
            <button
              key={slideName}
              type="button"
              role="tab"
              aria-selected={activeSlide === slideName}
              onClick={() => setActiveSlide(slideName)}
            >
              {SLIDES[slideName].label}
            </button>
          ))}
        </div>
        {isPromotion ? <p className={styles.heroEyebrow}>Локальная акция</p> : null}
        <h1 id="road-users-title">
          <span>{slide.title[0]}</span>
          <span>{slide.title[1]}</span>
        </h1>
        <p className={styles.heroLead}>{slide.lead}</p>
        <Link
          className={`${styles.heroAction} ${isPromotion ? styles.heroActionPromotion : ""}`}
          href={slide.action}
        >
          <span>{slide.actionLabel}</span>
          <ArrowIcon direction="right" />
        </Link>
        <RoadTrafficSignal road="М-4" roadName="«Дон»" />
      </div>
    </section>
  );
}
