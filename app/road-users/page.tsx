import { HeaderNav } from "@/app/components/HeaderNav.client";
import LoyaltyRail from "@/app/components/LoyaltyRail.client";
import { ServicesGrid } from "@/app/components/ServicesGrid";
import { SiteFooter } from "@/app/components/SiteFooter";

import styles from "./RoadUsersPage.module.css";
import { RoutePlanner } from "./RoutePlanner.client";
import { RoadUsersHero } from "./RoadUsersHero.client";
import { TollPlaza } from "./TollPlaza.client";

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
          hidden
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
          <TollPlaza />
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
