"use client";

import { type RefObject, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { RoadNetworkHero } from "@/app/components/RoadNetworkHero.client";
import { ROADS, type RoadId } from "@/app/data/roads";

import { RoadTrafficSignal } from "./RoadTrafficSignal.client";
import styles from "./RoadUsersHero.module.css";

const PROMOTIONS: Record<RoadId, Readonly<{ image: string; description: string }>> = {
  "m-1": {
    image: "/media/road-users/promotions/m-1-promo.png",
    description:
      "Кофе и отдых по пути: предложение от партнёров на остановках маршрута.",
  },
  "m-3": {
    image: "/media/road-users/promotions/m-3-promo.png",
    description:
      "Больше комфорта для семейной поездки: специальные предложения в зонах отдыха.",
  },
  "m-4": {
    image: "/media/road-users/promotions/m-4-promo.png",
    description:
      "Путешествие к морю с выгодой: предложения на сервисы для вашего маршрута.",
  },
  "m-11": {
    image: "/media/road-users/promotions/m-11-promo.png",
    description: "Комфортный путь к северной столице: выгода на дорожные сервисы.",
  },
  "m-12": {
    image: "/media/road-users/promotions/m-12-promo.png",
    description:
      "Откройте Восток с выгодой: предложения для путешествий по новой трассе.",
  },
  "a-113": {
    image: "/media/road-users/promotions/m-12-promo.png",
    description:
      "Больше времени для своих планов: локальная акция для поездок по ЦКАД.",
  },
  "a-289": {
    image: "/media/road-users/promotions/m-4-promo.png",
    description: "Сезонное предложение для комфортной дороги к морю.",
  },
  "a-105": {
    image: "/media/road-users/promotions/m-1-promo.png",
    description:
      "Спокойный старт поездки: специальное предложение на маршруте до аэропорта.",
  },
  "a-107": {
    image: "/media/road-users/promotions/m-3-promo.png",
    description: "Планируйте свободный день за городом с выгодой на маршруте.",
  },
};

function roadName(label: string, shortLabel: string) {
  return label.replace(shortLabel, "").trim() || "автодороге";
}

function RoadUsersHeroPromotion({
  root,
}: Readonly<{ root: RefObject<HTMLDivElement | null> }>) {
  const [panel, setPanel] = useState<HTMLElement | null>(null);
  const [media, setMedia] = useState<HTMLElement | null>(null);
  const [activeRoadId, setActiveRoadId] = useState<RoadId>("m-1");

  useEffect(() => {
    const rootNode = root.current;
    if (!rootNode) return;

    const sync = () => {
      const nextPanel = rootNode.querySelector<HTMLElement>(
        "[data-testid='road-panel']",
      );
      const nextMedia = rootNode.querySelector<HTMLElement>(".road-hero__media");
      const selectedTab = rootNode.querySelector<HTMLButtonElement>(
        "[role='tab'][aria-selected='true']",
      );
      const nextId = selectedTab?.dataset.roadId as RoadId | undefined;

      if (nextPanel) setPanel(nextPanel);
      if (nextMedia) setMedia(nextMedia);
      if (nextId && PROMOTIONS[nextId]) {
        setActiveRoadId(nextId);
        rootNode.style.setProperty(
          "--road-users-promotion",
          `url(${PROMOTIONS[nextId].image})`,
        );
      }
    };

    sync();
    const observer = new MutationObserver(sync);
    observer.observe(rootNode, {
      attributes: true,
      attributeFilter: ["aria-selected"],
      subtree: true,
    });
    return () => observer.disconnect();
  }, [root]);

  const road = ROADS.find((item) => item.id === activeRoadId) ?? ROADS[0];
  const promotion = PROMOTIONS[road.id];
  if (!panel || !media || !road || !promotion) return null;

  return (
    <>
      {createPortal(
        <div className={styles.promotionContent}>
          <p className={styles.promotionDescription}>{promotion.description}</p>
          <a className={styles.promotionAction} href="#calculator-title">
            Участвовать в акции
          </a>
        </div>,
        panel,
      )}
      {createPortal(
        <aside
          className={styles.trafficPanel}
          aria-label={`Ситуация на ${road.shortLabel}`}
        >
          <RoadTrafficSignal
            road={road.shortLabel}
            roadName={roadName(road.label, road.shortLabel)}
          />
        </aside>,
        media,
      )}
    </>
  );
}

/**
 * Route-local extension of the homepage road hero. The shared source stays untouched;
 * only this route adds promotion media and replaces factual cards with traffic status.
 */
export function RoadUsersHero() {
  const root = useRef<HTMLDivElement>(null);

  return (
    <div ref={root} className={styles.root} data-road-users-hero-clone="true">
      <RoadNetworkHero withCar variant="cinematic" />
      <RoadUsersHeroPromotion root={root} />
    </div>
  );
}
