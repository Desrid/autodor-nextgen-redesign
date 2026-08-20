import Image from "next/image";
import Link from "next/link";

import { ArrowIcon } from "@/app/components/ArrowIcon";
import { HeaderNav } from "@/app/components/HeaderNav.client";
import LoyaltyRail from "@/app/components/LoyaltyRail.client";
import { ServicesGrid } from "@/app/components/ServicesGrid";
import { SiteFooter } from "@/app/components/SiteFooter";

import styles from "./RoadUsersPage.module.css";
import { RoutePlanner } from "./RoutePlanner.client";
import { UsefulStories } from "./UsefulStories.client";

const ROAD_STATUS = [
  { road: "М-4 «Дон»", status: "Свободно", detail: "Без существенных задержек", tone: "free" },
  { road: "М-12 «Восток»", status: "Ремонт", detail: "2 участка, задержка 18 мин", tone: "work" },
  { road: "ЦКАД", status: "Свободно", detail: "Без существенных задержек", tone: "free" },
] as const;

export default function RoadUsersPage() {
  return (
    <>
      <header className="site-header">
        <HeaderNav />
      </header>
      <div id="header-scroll-sentinel" className="header-scroll-sentinel" aria-hidden="true" />
      <main id="main-content" className={styles.page} tabIndex={-1}>
        <section className={`${styles.hero} section-shell`} aria-labelledby="road-users-title">
          <Image className={styles.heroImage} src="/media/road-users/road-users-hero-v1.png" alt="Автомобиль на современной федеральной трассе" fill priority sizes="(max-width: 767px) 100vw, 1480px" />
          <div className={styles.heroScrim} aria-hidden="true" />
          <div className={styles.heroContent}>
            <nav className={styles.breadcrumbs} aria-label="Хлебные крошки">
              <Link href="/">Главная</Link>
              <ArrowIcon direction="right" />
              <span aria-current="page">Пользователям автодорог</span>
            </nav>
            <h1 id="road-users-title">Всё для уверенной поездки</h1>
            <p className={styles.heroLead}>Планируйте маршрут, оплачивайте проезд и получайте помощь в пути.</p>
            <aside className={styles.heroNote}><span>В дороге</span><p>Маршрут, стоимость проезда и важная информация — в одном месте.</p></aside>
          </div>
        </section>

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

        <section className={`${styles.section} section-shell`} aria-labelledby="status-title">
          <div className={styles.heading}><h2 id="status-title">Ситуация на дороге</h2><p>Оперативная информация и помощь на маршруте</p></div>
          <div className={styles.statusGrid}>{ROAD_STATUS.map((item) => <article key={item.road} className={styles.statusCard}><h3>{item.road}</h3><p className={item.tone === "free" ? styles.free : styles.work}>{item.status}</p><span>{item.detail}</span><ArrowIcon direction="right" /></article>)}</div>
          <aside className={styles.help}><div><h3>Помощь на дороге <a href="tel:2323">*2323</a></h3><p>Вызвать аварийного комиссара или техническую помощь</p></div><a href="tel:2323" className={styles.call}>Позвонить <ArrowIcon direction="right" /></a></aside>
        </section>

        <section className="section-shell loyalty-section" aria-labelledby="loyalty-title">
          <div className="loyalty-header">
            <div className="section-heading">
              <h2 id="loyalty-title">Программа лояльности</h2>
            </div>
            <LoyaltyRail />
          </div>
        </section>

        <section id="useful" className={`${styles.section} section-shell`} aria-labelledby="useful-title">
          <div className={styles.heading}><h2 id="useful-title">Полезное</h2><p>Актуальная информация для поездки</p></div>
          <UsefulStories />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
