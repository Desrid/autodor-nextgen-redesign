import { ArrowIcon } from "@/app/components/ArrowIcon";
import { HeaderNav } from "@/app/components/HeaderNav.client";
import LoyaltyRail from "@/app/components/LoyaltyRail.client";
import { ServicesGrid } from "@/app/components/ServicesGrid";
import { SiteFooter } from "@/app/components/SiteFooter";

import styles from "./RoadUsersPage.module.css";
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
          <p className={styles.eyebrow}>Пользователям автодорог</p>
          <h1 id="road-users-title">Всё для уверенной поездки</h1>
          <p className={styles.intro}>
            Планируйте маршрут, оплачивайте проезд и получайте помощь в пути.
          </p>
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
          <div className={styles.calculator}>
            <form className={styles.routeForm} aria-label="Параметры поездки">
              <h3>Параметры поездки</h3>
              <div className={styles.fields}>
                <label>Откуда<select defaultValue="Москва"><option>Москва</option><option>Санкт-Петербург</option></select></label>
                <label>Куда<select defaultValue="Краснодар"><option>Краснодар</option><option>Ростов-на-Дону</option></select></label>
                <label>Дата поездки<input type="text" defaultValue="12 августа" /></label>
                <label>Транспорт<select defaultValue="Легковой автомобиль"><option>Легковой автомобиль</option><option>Мотоцикл</option></select></label>
              </div>
              <button type="button">Рассчитать маршрут <ArrowIcon direction="right" /></button>
            </form>
            <article className={styles.result} aria-labelledby="result-title">
              <h3 id="result-title">Результат расчёта</h3>
              <dl><div><dt>протяжённость маршрута</dt><dd>1 346 км</dd></div><div><dt>ориентировочная стоимость</dt><dd>3 240 ₽</dd></div></dl>
              <p className={styles.route}>М-4 «Дон» <span>•</span> 15 ч 40 мин</p>
              <ul className={styles.facts}><li>Ремонт: 2 участка</li><li>МФЗ: 8</li><li>АЗС: 24</li></ul>
            </article>
          </div>
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
