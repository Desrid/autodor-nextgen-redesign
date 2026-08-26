import { ArrowIcon } from "@/app/components/ArrowIcon";
import { HeaderNav } from "@/app/components/HeaderNav.client";
import LoyaltyRail from "@/app/components/LoyaltyRail.client";
import { ServicesGrid } from "@/app/components/ServicesGrid";
import { SiteFooter } from "@/app/components/SiteFooter";

import styles from "./RoadUsersPage.module.css";
import { RoutePlanner } from "./RoutePlanner.client";
import { RoadUsersHero } from "./RoadUsersHero.client";

export default function RoadUsersPage() {
  return (
    <>
      <header className="site-header">
        <HeaderNav />
      </header>
      <div id="header-scroll-sentinel" className="header-scroll-sentinel" aria-hidden="true" />
      <main id="main-content" className={styles.page} tabIndex={-1}>
        <RoadUsersHero />

        <section className="section-shell services-section" aria-labelledby="services-title">
          <div className="services-heading">
            <h2 id="services-title">Сервисы</h2>
          </div>
          <ServicesGrid />
        </section>

        <section className={`${styles.section} section-shell`} aria-labelledby="calculator-title">
          <div className={styles.heading}>
            <h2 id="calculator-title">Рассчитать стоимость</h2>
            <p>Маршрут, стоимость проезда и полезная информация по дороге</p>
          </div>
          <RoutePlanner />
        </section>

        <section className={`${styles.section} section-shell`} aria-labelledby="rules-title">
          <div className={styles.heading}><h2 id="rules-title">Правила проезда</h2><p>Выбирайте правильную полосу на пункте оплаты</p></div>
          <div className={styles.rules}>
            <article className={`${styles.rule} ${styles.ruleGreen}`}><p>ЗЕЛЁНАЯ ПОЛОСА</p><h3>Только с транспондером</h3><span>Проезд без остановки</span></article>
            <article className={`${styles.rule} ${styles.ruleYellow}`}><p>ЖЁЛТАЯ ПОЛОСА</p><h3>Оплата картой или наличными</h3><span>Выберите полосу заранее</span></article>
            <article className={`${styles.rule} ${styles.ruleBarrier}`}><h3>Безбарьерные участки</h3><p className={styles.tag}>М-12 • ЦКАД • А-289</p><span>Оплата по госномеру после завершения поездки</span><a href="#useful">Подробнее о правилах <ArrowIcon direction="right" /></a></article>
          </div>
        </section>

        <section className="section-shell loyalty-section" aria-labelledby="loyalty-title">
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
