"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { RoadNetworkHero } from "@/app/components/RoadNetworkHero.client";
import { Icon } from "@/app/components/icons";
import { ROADS, type RoadId } from "@/app/data/roads";

import { RoadTrafficSignal } from "./RoadTrafficSignal.client";
import styles from "./RoadUsersHero.module.css";

const FIRST_TAB_PROMOTION = {
  image: "/media/road-users/promotions/m-1-promo-v2.png",
  description: "Кофе и отдых по пути: предложение от партнёров на остановках маршрута.",
} as const;

function roadName(label: string, shortLabel: string) {
  return label.replace(shortLabel, "").trim() || "автодороге";
}

function RoadUsersHeroPromotion() {
  const [panel, setPanel] = useState<HTMLElement | null>(null);
  const [media, setMedia] = useState<HTMLElement | null>(null);
  const [activeRoadId, setActiveRoadId] = useState<RoadId>("m-1");

  useEffect(() => {
    const rootNode = document.querySelector<HTMLDivElement>(
      "[data-road-users-hero-clone='true']",
    );
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
      if (nextId) {
        setActiveRoadId(nextId);
        const firstTabActive = nextId === "m-1";
        rootNode.dataset.firstTabActive = String(firstTabActive);

        if (firstTabActive) {
          rootNode.style.setProperty(
            "--road-users-promotion",
            `url(${FIRST_TAB_PROMOTION.image})`,
          );
        }
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
  }, []);

  const road = ROADS.find((item) => item.id === activeRoadId) ?? ROADS[0];
  const firstTabActive = road.id === "m-1";
  if (!panel || !media || !road) return null;

  return (
    <>
      {firstTabActive
        ? createPortal(
            <div className={styles.promotionContent}>
              <p className={styles.promotionDescription}>
                {FIRST_TAB_PROMOTION.description}
              </p>
              <a className={styles.promotionAction} href="#calculator-title">
                Участвовать в акции
              </a>
            </div>,
            panel,
          )
        : null}
      {createPortal(
        <>
          <div className={styles.trafficPanel}>
            <RoadTrafficSignal
              road={road.shortLabel}
              roadName={roadName(road.label, road.shortLabel)}
            />
          </div>
          <a
            className={styles.assistancePanel}
            href="tel:*2323"
            aria-label="Позвонить в круглосуточную помощь на дороге по номеру *2323"
          >
            <span className={styles.assistanceIcon} aria-hidden="true">
              <Icon name="phone" size={24} />
            </span>
            <span className={styles.assistanceCopy}>
              <span className={styles.assistanceEyebrow}>Помощь на дороге</span>
              <strong>*2323</strong>
              <span>Круглосуточная помощь на дороге.</span>
              <span>Звонок бесплатный по России</span>
            </span>
          </a>
        </>,
        media,
      )}
    </>
  );
}

/**
 * Route-local extension of the homepage road hero. The shared source stays untouched;
 * only this route keeps the first-tab promotion and replaces maps with service cards.
 */
export function RoadUsersHero() {
  return (
    <div
      className={styles.root}
      data-road-users-hero-clone="true"
      data-first-tab-active="true"
    >
      <RoadNetworkHero withCar variant="cinematic" />
      <RoadUsersHeroPromotion />
    </div>
  );
}
