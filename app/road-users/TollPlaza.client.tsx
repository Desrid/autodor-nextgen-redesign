"use client";

import Image from "next/image";
import { useState } from "react";

import styles from "./RoadUsersPage.module.css";

const LANES = [
  {
    id: "transponder",
    title: "Только с\u00a0транспондером",
    description: "Зелёная полоса. Проезд без\u00a0остановки.",
    image: "/media/road-users/toll-plaza/transponder-lane.png",
    className: styles.laneTransponder,
  },
  {
    id: "card",
    title: "Оплата картой",
    description: "Оплатите проезд банковской картой.",
    image: "/media/road-users/toll-plaza/card-lane.png",
    className: styles.laneCard,
  },
  {
    id: "cash",
    title: "Оплата наличными",
    description: "Подготовьте наличные до\u00a0въезда на\u00a0полосу.",
    image: "/media/road-users/toll-plaza/cash-lane.png",
    className: styles.laneCash,
  },
  {
    id: "closed",
    title: "Полоса закрыта",
    description: "Не заезжайте на\u00a0полосу с\u00a0запрещающим знаком.",
    image: "/media/road-users/toll-plaza/closed-lane.png",
    className: styles.laneClosed,
  },
] as const;

function LaneDivider() {
  return (
    <span className={styles.laneDivider} aria-hidden="true">
      <span className={styles.dividerSignal}>
        <Image
          src="/media/road-users/toll-plaza/divider-direction.png"
          alt=""
          width={482}
          height={414}
          unoptimized
        />
      </span>
      <span className={styles.dividerBoard} />
      <span className={styles.dividerLight} />
    </span>
  );
}

function ModeSign({
  photoMode,
  onToggle,
}: Readonly<{ photoMode: boolean; onToggle: () => void }>) {
  return (
    <button
      type="button"
      className={`${styles.laneSign} ${styles.laneSignToggle}`}
      onClick={onToggle}
      aria-pressed={photoMode}
      aria-label={photoMode ? "Показать схему полос" : "Показать фотореалистичный вид"}
      title={photoMode ? "Показать схему" : "Показать фотореалистичный вид"}
    >
      <Image
        src="/media/road-users/toll-plaza/transponder-lane.png"
        alt=""
        width={100}
        height={100}
      />
    </button>
  );
}

function DiagramVariant({ onToggle }: Readonly<{ onToggle: () => void }>) {
  return (
    <>
      <div className={styles.tollRoof} aria-hidden="true" />
      <div className={styles.tollLanes}>
        {LANES.map((lane, index) => (
          <article className={`${styles.tollLane} ${lane.className}`} key={lane.id}>
            {index === 0 ? (
              <ModeSign photoMode={false} onToggle={onToggle} />
            ) : (
              <div className={styles.laneSign}>
                <Image src={lane.image} alt="" width={100} height={100} />
              </div>
            )}
            <div className={styles.laneCopy}>
              <h3>{lane.title}</h3>
              <p>{lane.description}</p>
            </div>
            {index < LANES.length - 1 ? <LaneDivider /> : null}
          </article>
        ))}
      </div>
    </>
  );
}

function PhotoVariant({ onToggle }: Readonly<{ onToggle: () => void }>) {
  return (
    <>
      <Image
        className={styles.photoPlazaBackground}
        src="/media/road-users/toll-plaza/toll-plaza-photo-v2.png"
        alt=""
        fill
        sizes="(max-width: 900px) 100vw, 94vw"
      />
      <div className={styles.photoPlazaShade} aria-hidden="true" />
      <div className={styles.photoLaneGrid}>
        {LANES.map((lane, index) => (
          <article
            className={`${styles.photoLane} ${lane.className}`}
            key={`photo-${lane.id}`}
          >
            {index === 0 ? (
              <button
                type="button"
                className={styles.photoModeToggle}
                onClick={onToggle}
                aria-pressed="true"
                aria-label="Показать схему полос"
                title="Показать схему"
              />
            ) : null}
            <div className={styles.photoLaneCopy}>
              <h3>{lane.title}</h3>
              <p>{lane.description}</p>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

export function TollPlaza() {
  const [photoMode, setPhotoMode] = useState(false);

  return (
    <div
      className={`${styles.tollPlaza} ${photoMode ? styles.tollPlazaPhoto : ""}`}
      aria-label={
        photoMode
          ? "Фотореалистичный вид полос пункта взимания платы"
          : "Схема полос пункта взимания платы"
      }
      data-toll-plaza-mode={photoMode ? "photo" : "diagram"}
    >
      {photoMode ? (
        <PhotoVariant onToggle={() => setPhotoMode(false)} />
      ) : (
        <DiagramVariant onToggle={() => setPhotoMode(true)} />
      )}
    </div>
  );
}
