import Image from "next/image";

import { ArrowIcon } from "@/app/components/ArrowIcon";
import { NEWS } from "@/app/data/home-content";

import styles from "./NewsGrid.module.css";

const ALL_NEWS_URL = "https://www.russianhighways.ru/press/news/";

const NEWS_EXCERPTS: Record<(typeof NEWS)[number]["href"], string> = {
  "https://russianhighways.ru/press/news/149487/":
    "Автодор продолжает создавать скоростную дорожную сеть России. Новые транспортные коридоры поддерживают развитие регионов, логистики и внутреннего туризма.",
  "https://russianhighways.ru/press/news/149367/":
    "На рабочей встрече в Перми обсудили развитие придорожной инфраструктуры М-12 «Восток» и перспективные проекты на территории края.",
  "https://russianhighways.ru/press/news/149323/":
    "Автодор поздравил выпускников Московского автомобильно-дорожного государственного технического университета с окончанием обучения.",
  "https://russianhighways.ru/press/news/149261/":
    "Соглашение предусматривает создание в Псковской области современных зон дорожного сервиса для комфортных и безопасных семейных путешествий.",
  "https://russianhighways.ru/press/news/149242/":
    "За пять лет система «Свободный поток» зафиксировала почти 410 млн проездов. ЦКАД помогает сокращать время в пути и выводит транзит за пределы городов.",
};

export function NewsGrid() {
  return (
    <section
      className="news-bento"
      data-testid="news-grid"
      aria-label="Последние новости Автодора"
    >
      {NEWS.map((item, index) => (
        <article
          className={`news-card news-card--${index + 1} ${styles.card}`}
          data-news-item
          key={item.href}
        >
          <a
            className={`news-card__link ${styles.link}`}
            href={item.href}
            aria-label={`Читать новость: ${item.title}. Опубликовано ${item.date}.`}
          >
            <Image
              className="news-card__image"
              src={item.image}
              alt={item.imageAlt}
              fill
              priority={index === 0}
              sizes={
                index === 0
                  ? "(max-width: 767px) 100vw, (max-width: 1023px) 100vw, 50vw"
                  : "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 25vw"
              }
            />
            <span className="news-card__shade" aria-hidden="true" />
            <div className={`news-card__content ${styles.content}`}>
              <div className={`news-card__meta ${styles.meta}`}>
                <time
                  className={`${styles.date} card-eyebrow-tab`}
                  data-news-date
                  dateTime={item.dateTime}
                >
                  {item.date}
                </time>
              </div>
              <div className={`news-card__copy ${styles.copy}`}>
                <h3 className={styles.title}>{item.title}</h3>
                <p className={styles.excerpt} data-news-excerpt>
                  {NEWS_EXCERPTS[item.href]}
                </p>
                <span
                  className={`news-card__cta ${styles.cta} card-cta`}
                  aria-hidden="true"
                >
                  Читать новость
                  <ArrowIcon
                    className="news-card__cta-icon card-cta__icon"
                    direction="right"
                  />
                </span>
              </div>
            </div>
          </a>
        </article>
      ))}
      <a className="news-bento__all" href={ALL_NEWS_URL}>
        <span>Все новости</span>
        <ArrowIcon className="news-card__cta-icon card-cta__icon" direction="right" />
        <span className="visually-hidden">на официальном сайте Автодора</span>
      </a>
    </section>
  );
}
