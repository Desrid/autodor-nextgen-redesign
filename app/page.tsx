import { ContactsTabs } from "@/app/components/ContactsTabs.client";
import { FloatingUtilities } from "@/app/components/FloatingUtilities.client";
import { HeaderNav } from "@/app/components/HeaderNav.client";
import { RoadNetworkHero } from "@/app/components/RoadNetworkHero.client";
import {
  GOVERNMENT_LINKS,
  NEWS,
  SERVICES,
  SOCIAL_LINKS,
  SUBSIDIARY_SERVICES,
} from "@/app/data/home-content";
import { FUTURE_PROJECTS, FUTURE_PROJECT_TIMELINE } from "@/app/data/future-projects";
import {
  TARIFF_INDEXING_SOURCE,
  TARIFF_PRIMARY_SOURCE,
  TARIFF_STATISTICS_CONTEXT,
  VEHICLE_CATEGORY_TARIFFS,
} from "@/app/data/statistics";
import Image from "next/image";

type HomePageProps = Readonly<{
  searchParams?: Promise<Readonly<{ car?: string | readonly string[] }>>;
}>;

const MEDIA_GALLERY = [
  {
    id: "bridge",
    media: "bridge-viaduct",
    alt: "Сгенерированный образ современного дорожного моста. Не является документальной съёмкой конкретного объекта",
  },
  {
    id: "construction",
    media: "road-construction",
    alt: "Сгенерированный образ строительства федеральной автомагистрали без привязки к конкретному объекту",
  },
  {
    id: "tunnel",
    media: "tunnel-portal",
    alt: "Сгенерированный образ портала дорожного тоннеля. Не является документальной съёмкой конкретного объекта",
  },
] as const;

function SectionHeading({ id, children }: Readonly<{ id: string; children: string }>) {
  return (
    <div className="section-heading">
      <h2 id={id}>{children}</h2>
    </div>
  );
}

function MediaPicture({ media, alt }: Readonly<{ media: string; alt: string }>) {
  return (
    <picture>
      <source
        type="image/avif"
        media="(max-width: 767px)"
        srcSet={`/media/optimized/${media}/${media}-mobile-320.avif 320w, /media/optimized/${media}/${media}-mobile-480.avif 480w, /media/optimized/${media}/${media}-mobile-720.avif 720w`}
        sizes="88vw"
      />
      <source
        type="image/webp"
        media="(max-width: 767px)"
        srcSet={`/media/optimized/${media}/${media}-mobile-320.webp 320w, /media/optimized/${media}/${media}-mobile-480.webp 480w, /media/optimized/${media}/${media}-mobile-720.webp 720w`}
        sizes="88vw"
      />
      <source
        type="image/avif"
        srcSet={`/media/optimized/${media}/${media}-desktop-640.avif 640w, /media/optimized/${media}/${media}-desktop-960.avif 960w, /media/optimized/${media}/${media}-desktop-1440.avif 1440w`}
        sizes="(max-width: 1200px) 72vw, 820px"
      />
      <img
        src={`/media/optimized/${media}/${media}-desktop-960.webp`}
        alt={alt}
        width="960"
        height="640"
        loading="lazy"
      />
    </picture>
  );
}

export default async function HomePage({
  searchParams = Promise.resolve({}),
}: HomePageProps = {}) {
  const query = await searchParams;
  const carValue = Array.isArray(query.car) ? query.car[0] : query.car;
  const withCar = carValue === "on";

  return (
    <>
      <header className="site-header" data-section="header" data-node-id="1767:6576">
        <HeaderNav />
      </header>

      <main id="main-content" tabIndex={-1}>
        <div data-section="roads" data-node-id="1767:7102">
          <RoadNetworkHero withCar={withCar} />
        </div>

        <section
          className="section-shell services-section"
          aria-labelledby="services-title"
          data-section="services"
          data-node-id="1767:7168"
        >
          <SectionHeading id="services-title">Сервисы</SectionHeading>
          <div className="services-grid" data-testid="services-grid">
            {SERVICES.map((service) => (
              <details
                key={service.id}
                className="service-card"
                data-service-id={service.id}
                data-testid={`service-${service.id}`}
                data-node-id={service.nodeId}
              >
                <summary>
                  <span>{service.title}</span>
                  <span aria-hidden="true">+</span>
                </summary>
                <div className="service-card__body">
                  <p>{service.description}</p>
                  <a href={service.href}>Открыть сервис</a>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section
          className="section-shell loyalty-section"
          aria-labelledby="loyalty-title"
          data-section="loyalty"
          data-node-id="1767:7270"
        >
          <SectionHeading id="loyalty-title">Программа лояльности</SectionHeading>
          <div
            className="source-state source-state--wide"
            data-testid="loyalty-rail"
            data-loyalty-state="ready"
          >
            <div>
              <p>Действует до 30 сентября 2026 года</p>
              <strong>Поддержка многодетных семей</strong>
              <p data-loyalty-item>
                12 000 бонусных баллов, транспондер T-pass со скидкой 30% и максимальная
                скидка программы лояльности 15%.
              </p>
            </div>
            <a href="https://www.russianhighways.ru/press/news/145160/">
              Условия акции
            </a>
          </div>
        </section>

        <section
          className="section-shell news-section"
          aria-labelledby="news-title"
          data-section="news"
          data-node-id="1767:7305"
        >
          <SectionHeading id="news-title">Новости</SectionHeading>
          <div className="news-bento" data-testid="news-grid">
            {NEWS.map((item, index) => (
              <article
                key={item.href}
                className={`news-card news-card--${index + 1}`}
                data-news-item
              >
                <time>{item.date}</time>
                <h3>
                  <a href={item.href}>{item.title}</a>
                </h3>
              </article>
            ))}
          </div>
          <a className="section-link" href="https://www.russianhighways.ru/press/news/">
            Все новости
          </a>
        </section>

        <section
          className="section-shell important-section"
          aria-labelledby="important-title"
          data-section="important"
          data-node-id="1767:7328"
        >
          <SectionHeading id="important-title">Важная информация</SectionHeading>
          <div className="important-state" data-testid="important-state">
            <div>
              <p>14 июля 2026 года</p>
              <h3>
                Михаил Мишустин встретился с председателем правления Государственной
                компании «Автодор»
              </h3>
              <p>
                В 2026 году введена развязка ЦКАД с Дмитровским шоссе, завершаются
                работы на участках М-1 и М-3.
              </p>
            </div>
            <a href="https://russianhighways.ru/press/news/149487/">
              Читать официальный материал
            </a>
          </div>
        </section>

        <section
          className="media-section"
          aria-label="Дороги, мосты и строительство"
          data-section="media"
          data-node-id="1767:7339"
        >
          <div
            className="media-rail"
            data-testid="media-rail"
            tabIndex={0}
            aria-label="Прокручиваемая медиагалерея"
          >
            {MEDIA_GALLERY.map((item) => (
              <figure key={item.id} data-media-item>
                <MediaPicture media={item.media} alt={item.alt} />
              </figure>
            ))}
          </div>
        </section>

        <section
          className="section-shell contacts-section"
          aria-labelledby="contacts-title"
          data-section="contacts"
          data-node-id="1767:7368"
        >
          <SectionHeading id="contacts-title">Контакты</SectionHeading>
          <ContactsTabs />
        </section>

        <section
          className="section-shell statistics-section"
          aria-labelledby="statistics-title"
          data-section="statistics"
          data-node-id="1767:7415"
        >
          <SectionHeading id="statistics-title">Статистика</SectionHeading>
          <figure className="tariff-statistics" data-testid="tariff-statistics">
            <figcaption className="tariff-statistics__intro">
              <p>{TARIFF_STATISTICS_CONTEXT.metric}</p>
              <h3>
                {TARIFF_STATISTICS_CONTEXT.road}: {TARIFF_STATISTICS_CONTEXT.section}
              </h3>
              <p>
                {TARIFF_STATISTICS_CONTEXT.schedule};{" "}
                {TARIFF_STATISTICS_CONTEXT.discount}. Это тарифы конкретного участка, а
                не общесетевая статистика.
              </p>
            </figcaption>

            <div
              className="tariff-chart"
              role="group"
              aria-label="Базовые тарифы по категориям транспорта: I — 325 рублей, II — 456 рублей, III — 586 рублей, IV — 846 рублей"
            >
              {VEHICLE_CATEGORY_TARIFFS.map((item) => (
                <div
                  className="tariff-chart__row"
                  data-node-id={item.figmaNodeId}
                  key={item.category}
                >
                  <span className="tariff-chart__category">{item.category}</span>
                  <span
                    aria-hidden="true"
                    className="tariff-chart__bar"
                    style={{ width: `${(item.priceRub / 846) * 100}%` }}
                  />
                  <strong>{item.priceRub} ₽</strong>
                  <span className="tariff-tooltip">
                    <button
                      type="button"
                      aria-describedby={`tariff-tip-${item.category}`}
                      aria-label={`Пояснение тарифа категории ${item.category}`}
                    >
                      i
                    </button>
                    <span id={`tariff-tip-${item.category}`} role="tooltip">
                      Категория {item.category}: базовый тариф {item.priceRub} рублей,
                      понедельник — воскресенье, без скидки.
                    </span>
                  </span>
                </div>
              ))}
            </div>

            <div className="tariff-table-wrap">
              <table>
                <caption>Текстовый эквивалент диаграммы тарифов</caption>
                <thead>
                  <tr>
                    <th scope="col">Категория ТС</th>
                    <th scope="col">Базовый тариф, ₽</th>
                  </tr>
                </thead>
                <tbody>
                  {VEHICLE_CATEGORY_TARIFFS.map((item) => (
                    <tr key={item.category}>
                      <th scope="row">{item.category}</th>
                      <td>{item.priceRub}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="tariff-sources">
              <p>{TARIFF_STATISTICS_CONTEXT.sourceNote}</p>
              <a href={TARIFF_PRIMARY_SOURCE.url}>Исходная публикация тарифов</a>
              <a href={TARIFF_INDEXING_SOURCE.url}>
                Проверка после индексации 2026 года
              </a>
            </div>
          </figure>
        </section>

        <section
          className="section-shell subsidiary-section"
          aria-labelledby="subsidiary-title"
          data-section="subsidiary-services"
          data-node-id="1767:7456"
        >
          <SectionHeading id="subsidiary-title">Блок «Услуги»</SectionHeading>
          <div className="subsidiary-bento" data-testid="subsidiary-grid">
            {SUBSIDIARY_SERVICES.map((item, index) => (
              <article
                key={item.id}
                className={`subsidiary-card subsidiary-card--${index + 1}`}
                data-subsidiary-item
              >
                <p>{item.company}</p>
                <h3>{item.service}</h3>
                <p>{item.description}</p>
                <a href={item.href}>Подробнее</a>
              </article>
            ))}
          </div>
        </section>

        <section
          className="section-shell social-section"
          aria-labelledby="social-title"
          data-section="social"
          data-node-id="1767:7501"
        >
          <SectionHeading id="social-title">Соц. обязательства</SectionHeading>
          <div className="social-grid">
            <article data-social-item data-node-id="1767:7504">
              <MediaPicture
                media="bridge-viaduct"
                alt="Сгенерированный образ дорожной инфраструктуры без привязки к конкретной социальной программе"
              />
              <div>
                <h3>Поддержка многодетных семей</h3>
                <p>
                  До 30 сентября 2026 года действует специальная программа с бонусными
                  баллами, скидкой на T-pass и максимальной скидкой программы
                  лояльности.
                </p>
                <a href="https://www.russianhighways.ru/press/news/145160/">
                  Условия программы
                </a>
              </div>
            </article>
            <article data-social-item data-node-id="1767:7506">
              <div>
                <h3>Поддержка МСП</h3>
                <p>
                  Официальный раздел о закупках у субъектов малого и среднего
                  предпринимательства.
                </p>
                <a href="https://russianhighways.ru/msp/">Открыть раздел</a>
              </div>
            </article>
          </div>
        </section>

        <section
          className="section-shell future-section"
          aria-labelledby="future-title"
          data-section="future"
          data-node-id="1767:7508"
        >
          <SectionHeading id="future-title">Будущие проекты</SectionHeading>
          <div className="future-layout" data-testid="future-projects">
            <div className="future-map" data-fallback="no-webgl">
              <Image
                src="/brand/future-projects-map.png"
                alt="Презентационная карта будущих проектов из Figma. Точная геометрия объектов не верифицирована"
                width="736"
                height="463"
                loading="lazy"
              />
              <p>
                Статический режим карты. Названия и ориентир по сроку подтверждены
                официальным проспектом; точная геометрия не публикуется как проверенная.
              </p>
            </div>
            <div>
              <ol className="future-timeline" aria-label="Шкала лет из Figma">
                {FUTURE_PROJECT_TIMELINE.map((item) => (
                  <li key={item.year} data-node-id={item.figmaNodeId}>
                    <time>{item.year}</time>
                  </li>
                ))}
              </ol>
              <div className="future-projects">
                {FUTURE_PROJECTS.map((project, index) => (
                  <article
                    key={project.id}
                    data-future-project
                    data-status={project.publicationStatus}
                    data-node-id={project.figmaCardNodeId}
                  >
                    <p>Проект {index + 1}</p>
                    {project.publicationStatus === "verified" ? (
                      <>
                        <h3>{project.title}</h3>
                        <p>
                          <time dateTime={`${project.deadlineYear}`}>
                            {project.deadlineLabel}
                          </time>
                        </p>
                        <a href={project.detailsUrl}>Официальный источник, стр. 36</a>
                      </>
                    ) : (
                      <>
                        <h3>Название и срок не опубликованы</h3>
                        <p>{project.mapGeometry.reason}</p>
                      </>
                    )}
                  </article>
                ))}
              </div>
              <a
                className="section-link"
                href="https://russianhighways.ru/about/activity/"
              >
                Деятельность компании
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer" data-section="footer" data-node-id="1767:7539">
        <div className="footer-grid">
          <div className="footer-brand">
            <a
              href="https://russianhighways.ru/"
              aria-label="Государственная компания Автодор"
            >
              <Image
                src="/brand/autodor-logo-footer.png"
                alt=""
                width="230"
                height="58"
                loading="lazy"
              />
            </a>
            <address>
              <span>Москва, Страстной бульвар, 9</span>
              <a href="mailto:info@russianhighways.ru">info@russianhighways.ru</a>
              <a href="tel:+74957271195">+7 495 727-11-95</a>
            </address>
          </div>
          <nav className="footer-legal" aria-label="Правовая информация">
            <a href="https://russianhighways.ru/about/regulatory-information/disc_inform/">
              Раскрытие информации
            </a>
            <a href="https://russianhighways.ru/about/">Противодействие коррупции</a>
            <a href="https://russianhighways.ru/upload/docs/politika_PD.pdf">
              Политика обработки персональных данных
            </a>
          </nav>
          <nav className="footer-social" aria-label="Социальные сети">
            {SOCIAL_LINKS.map((item) => (
              <a key={item.label} href={item.href} aria-label={item.label}>
                {item.label}
              </a>
            ))}
          </nav>
        </div>
        <nav className="government-links" aria-label="Государственные ресурсы">
          {GOVERNMENT_LINKS.map((item) => (
            <a key={item.label} href={item.href}>
              <Image
                src={item.image}
                alt={item.label}
                width="220"
                height="64"
                loading="lazy"
              />
            </a>
          ))}
        </nav>
        <p className="copyright">
          © 2009–2026 Государственная компания «Российские автомобильные дороги»
        </p>
      </footer>

      <FloatingUtilities />
    </>
  );
}
