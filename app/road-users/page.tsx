import { HeaderNav } from "@/app/components/HeaderNav.client";
import LoyaltyRail from "@/app/components/LoyaltyRail.client";
import { ServicesGrid } from "@/app/components/ServicesGrid";
import { SiteFooter } from "@/app/components/SiteFooter";
import { TransponderDeviceIcon } from "@/app/account/TransponderDeviceIcon";

import styles from "./RoadUsersPage.module.css";
import { RoutePlanner } from "./RoutePlanner.client";
import { RoadUsersHero } from "./RoadUsersHero.client";

type LaneKind = "transponder" | "card" | "cash" | "closed";

function LaneSign({ kind }: Readonly<{ kind: LaneKind }>) {
  if (kind === "transponder") {
    return <TransponderDeviceIcon className={styles.transponderLaneIcon!} />;
  }
  if (kind === "card") {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <rect x="11" y="17" width="42" height="29" rx="4" />
        <path d="M12 27h40M19 37h12" />
        <path d="M43 12l8 8" />
      </svg>
    );
  }
  if (kind === "cash") {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <rect x="10" y="19" width="44" height="26" rx="4" />
        <circle cx="32" cy="32" r="7" />
        <path d="M18 25v14M46 25v14" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="20" />
      <path d="m19 19 26 26M45 19 19 45" />
    </svg>
  );
}

export default function RoadUsersPage() {
  return (
    <>
      <header className="site-header">
        <HeaderNav />
      </header>
      <div
        id="header-scroll-sentinel"
        className="header-scroll-sentinel"
        aria-hidden="true"
      />
      <main id="main-content" className={styles.page} tabIndex={-1}>
        <RoadUsersHero />

        <section
          className="section-shell services-section"
          aria-labelledby="services-title"
        >
          <div className="services-heading">
            <h2 id="services-title">Сервисы</h2>
          </div>
          <ServicesGrid />
        </section>

        <section
          className={`${styles.section} section-shell`}
          aria-labelledby="calculator-title"
        >
          <div className={styles.heading}>
            <h2 id="calculator-title">Рассчитать стоимость</h2>
            <p>Маршрут, стоимость проезда и полезная информация по дороге</p>
          </div>
          <RoutePlanner />
        </section>

        <section
          className={`${styles.section} section-shell`}
          aria-labelledby="rules-title"
        >
          <div className={styles.heading}>
            <h2 id="rules-title">Правила проезда</h2>
            <p>Ориентируйтесь на знаки над полосами пункта взимания платы</p>
          </div>
          <div
            className={styles.tollPlaza}
            aria-label="Схема полос пункта взимания платы"
          >
            <div className={styles.tollRoof} aria-hidden="true" />
            <div className={styles.tollLanes}>
              <article className={`${styles.tollLane} ${styles.laneTransponder}`}>
                <div className={styles.laneSign}>
                  <LaneSign kind="transponder" />
                </div>
                <h3>Только с транспондером</h3>
                <p>Зелёная полоса. Проезд без остановки.</p>
              </article>
              <article className={`${styles.tollLane} ${styles.laneCard}`}>
                <div className={styles.laneSign}>
                  <LaneSign kind="card" />
                </div>
                <h3>Оплата картой</h3>
                <p>Оплатите проезд банковской картой.</p>
              </article>
              <article className={`${styles.tollLane} ${styles.laneCash}`}>
                <div className={styles.laneSign}>
                  <LaneSign kind="cash" />
                </div>
                <h3>Оплата наличными</h3>
                <p>Подготовьте наличные до въезда на полосу.</p>
              </article>
              <article className={`${styles.tollLane} ${styles.laneClosed}`}>
                <div className={styles.laneSign}>
                  <LaneSign kind="closed" />
                </div>
                <h3>Полоса закрыта</h3>
                <p>Не заезжайте на полосу с красным знаком.</p>
              </article>
            </div>
          </div>
        </section>

        <section
          className="section-shell loyalty-section"
          aria-labelledby="loyalty-title"
        >
          <div className="loyalty-header">
            <div className="section-heading">
              <h2 id="loyalty-title">Программа лояльности</h2>
            </div>
            <LoyaltyRail />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
