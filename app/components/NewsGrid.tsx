import Image from "next/image";

import { NEWS } from "@/app/data/home-content";

const ALL_NEWS_URL = "https://www.russianhighways.ru/press/news/";

export function NewsGrid() {
  return (
    <div
      className="news-bento"
      data-testid="news-grid"
      role="list"
      aria-label="Последние новости Автодора"
    >
      {NEWS.map((item, index) => (
        <article
          className={`news-card news-card--${index + 1}`}
          data-news-item
          key={item.href}
          role="listitem"
        >
          <a
            className="news-card__link"
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
            <div className="news-card__content">
              <div className="news-card__meta">
                <time dateTime={item.dateTime}>{item.date}</time>
                <span className="news-card__source">Официальный сайт</span>
              </div>
              <div className="news-card__copy">
                <h3>{item.title}</h3>
                <span className="news-card__cta" aria-hidden="true">
                  Читать новость
                </span>
              </div>
            </div>
          </a>
        </article>
      ))}
      <a className="news-bento__all" href={ALL_NEWS_URL}>
        <span>Все новости</span>
        <span className="visually-hidden">на официальном сайте Автодора</span>
      </a>
    </div>
  );
}
