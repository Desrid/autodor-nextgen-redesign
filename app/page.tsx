import { ContactsTabs } from "@/app/components/ContactsTabs.client";
import { CardTiltController } from "@/app/components/CardTiltController.client";
import { ArrowIcon } from "@/app/components/ArrowIcon";
import { FutureProjectsMap } from "@/app/components/FutureProjectsMap.client";
import { HeaderNav } from "@/app/components/HeaderNav.client";
import ImportantStories from "@/app/components/ImportantStories.client";
import LoyaltyRail from "@/app/components/LoyaltyRail.client";
import { MediaGallery } from "@/app/components/MediaGallery.client";
import { NewsGrid } from "@/app/components/NewsGrid";
import { ServicesGrid } from "@/app/components/ServicesGrid";
import { RoadNetworkHeroQuery } from "@/app/components/RoadNetworkHeroQuery.client";
import { StatisticsBlock } from "@/app/components/StatisticsBlock";
import {
  FOOTER_CONTACTS,
  FOOTER_LEGAL_LINKS,
  GOVERNMENT_LINKS,
  SOCIAL_COMMITMENTS,
  SOCIAL_LINKS,
  SUBSIDIARY_SERVICES,
} from "@/app/data/home-content";
import { FUTURE_PROJECTS } from "@/app/data/future-projects";
import Image from "next/image";

const MEDIA_GALLERY = [
  {
    id: "bridge",
    media: "bridge-viaduct",
    title: "Мост через большую реку",
    description:
      "Современный мостовой переход связывает берега и продолжает скоростную магистраль.",
    alt: "Сгенерированный образ современного дорожного моста. Не является документальной съёмкой конкретного объекта",
  },
  {
    id: "construction",
    media: "road-construction",
    title: "Строительство новой трассы",
    description:
      "Подготовка основания и инженерных сооружений будущей автомобильной дороги.",
    alt: "Сгенерированный образ строительства федеральной автомагистрали без привязки к конкретному объекту",
  },
  {
    id: "tunnel",
    media: "tunnel-portal",
    title: "Портал дорожного тоннеля",
    description:
      "Современный тоннель помогает сохранить устойчивый маршрут в сложном рельефе.",
    alt: "Сгенерированный образ портала дорожного тоннеля. Не является документальной съёмкой конкретного объекта",
  },
] as const;

const GENERATED_MEDIA = [
  [
    "gallery-01",
    "Вантовый мост на рассвете",
    "Новый мостовой переход над широкой рекой в мягком утреннем свете.",
  ],
  [
    "gallery-02",
    "Магистраль среди холмов",
    "Плавная трасса проходит через зелёный холмистый ландшафт.",
  ],
  [
    "gallery-03",
    "Строительство развязки",
    "Дорожная техника формирует многоуровневую транспортную развязку.",
  ],
  [
    "gallery-04",
    "Тоннель в вечернем свете",
    "Освещённый портал современного тоннеля в сумерках.",
  ],
  [
    "gallery-05",
    "Многоуровневая развязка",
    "Воздушный вид на распределение транспортных потоков.",
  ],
  [
    "gallery-06",
    "Зимняя дорога",
    "Безопасная магистраль проходит через заснеженный хвойный лес.",
  ],
  ["gallery-07", "Прибрежное шоссе", "Дорога следует вдоль морского побережья и скал."],
  [
    "gallery-08",
    "Пункт взимания платы",
    "Современная инфраструктура скоростной дороги на рассвете.",
  ],
  ["gallery-09", "Виадук над долиной", "Протяжённый мост пересекает осеннюю долину."],
  [
    "gallery-10",
    "Ночная магистраль",
    "Световые линии подчёркивают геометрию ночной дороги.",
  ],
  [
    "gallery-11",
    "Зона отдыха",
    "Современное пространство для остановки на длинном маршруте.",
  ],
  [
    "gallery-12",
    "Инженерный контроль",
    "Специалисты проверяют готовность нового мостового полотна.",
  ],
  [
    "gallery-13",
    "Дорога среди полей",
    "Свежая магистраль пересекает открытый сельский ландшафт.",
  ],
  [
    "gallery-14",
    "Городская кольцевая дорога",
    "Транспортный коридор проходит рядом с современным городом.",
  ],
  [
    "gallery-15",
    "Горный перевал",
    "Защищённая барьерами дорога проходит сквозь утренний туман.",
  ],
  [
    "gallery-16",
    "Большая дорожная стройка",
    "Общий вид на комплексное строительство нового участка трассы.",
  ],
  [
    "gallery-17",
    "Шумозащитные экраны",
    "Современные экраны снижают влияние магистрали на городскую среду.",
  ],
  [
    "gallery-18",
    "Мост над лесом",
    "Скоростная дорога бережно пересекает зелёный массив.",
  ],
  [
    "gallery-19",
    "Закат над трассой",
    "Свободная магистраль уходит к горизонту в тёплом свете.",
  ],
  [
    "gallery-20",
    "Интерьер тоннеля",
    "Разметка и освещение обеспечивают понятное движение внутри тоннеля.",
  ],
] as const;

const FUTURE_PROJECT_MEDIA = [
  "/media/news/ckad-traffic.png",
  "/media/source/road-construction.png",
  "/media/source/bridge-viaduct.png",
] as const;

function SectionHeading({
  id,
  children,
  layer,
}: Readonly<{ id: string; children: string; layer?: number }>) {
  return (
    <div
      className="section-heading"
      style={layer === undefined ? undefined : { position: "relative", zIndex: layer }}
    >
      <h2 id={id}>{children}</h2>
    </div>
  );
}

function MediaPicture({
  media,
  src,
  alt,
  priority = false,
}: Readonly<{ media?: string; src?: string; alt: string; priority?: boolean }>) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        width={960}
        height={640}
        sizes="(max-width: 767px) 82vw, (max-width: 1200px) 48vw, 736px"
        unoptimized
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
      />
    );
  }

  if (!media) return null;
  return (
    <picture>
      <source
        type="image/avif"
        media="(max-width: 767px)"
        srcSet={`/media/optimized/${media}/${media}-mobile-320.avif 320w, /media/optimized/${media}/${media}-mobile-480.avif 480w, /media/optimized/${media}/${media}-mobile-720.avif 720w`}
        sizes="(max-width: 479px) 88vw, 72vw"
      />
      <source
        type="image/webp"
        media="(max-width: 767px)"
        srcSet={`/media/optimized/${media}/${media}-mobile-320.webp 320w, /media/optimized/${media}/${media}-mobile-480.webp 480w, /media/optimized/${media}/${media}-mobile-720.webp 720w`}
        sizes="(max-width: 479px) 88vw, 72vw"
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
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
      />
    </picture>
  );
}

export default function HomePage() {
  return (
    <>
      <header className="site-header" data-section="header" data-node-id="1767:6576">
        <HeaderNav />
      </header>
      <div
        id="header-scroll-sentinel"
        className="header-scroll-sentinel"
        aria-hidden="true"
      />

      <main id="main-content" tabIndex={-1}>
        <div data-section="roads" data-node-id="1767:7102">
          <RoadNetworkHeroQuery />
        </div>

        <section
          className="section-shell services-section"
          aria-labelledby="services-title"
          data-section="services"
          data-node-id="1767:7168"
        >
          <div className="services-heading" data-node-id="1767:7220">
            <h2 id="services-title">Сервисы</h2>
          </div>
          <ServicesGrid />
        </section>

        <section
          className="section-shell loyalty-section"
          aria-labelledby="loyalty-title"
          data-section="loyalty"
          data-node-id="1767:7270"
        >
          <div className="loyalty-header">
            <SectionHeading id="loyalty-title">Программа лояльности</SectionHeading>
            <LoyaltyRail />
          </div>
        </section>

        <section
          className="section-shell news-section"
          aria-labelledby="news-title"
          data-section="news"
          data-node-id="1767:7305"
        >
          <SectionHeading id="news-title">Новости</SectionHeading>
          <NewsGrid />
        </section>

        <section
          className="section-shell important-section"
          aria-labelledby="important-title"
          data-section="important"
          data-node-id="1767:7328"
        >
          <div className="important-header">
            <SectionHeading id="important-title">Важная информация</SectionHeading>
            <ImportantStories />
          </div>
        </section>

        <section
          id="media-gallery"
          className="media-section"
          aria-label="Дороги, мосты и строительство"
          data-section="media"
          data-node-id="1767:7339"
        >
          <MediaGallery
            label="Прокручиваемая медиагалерея"
            descriptions={[
              ...MEDIA_GALLERY.map(({ title, description }) => ({
                title,
                description,
              })),
              ...GENERATED_MEDIA.map(([, title, description]) => ({
                title,
                description,
              })),
            ]}
          >
            {MEDIA_GALLERY.map((item, index) => (
              <figure key={item.id}>
                <MediaPicture
                  media={item.media}
                  alt={item.alt}
                  priority={index === 0}
                />
              </figure>
            ))}
            {GENERATED_MEDIA.map(([id, title]) => (
              <figure key={id}>
                <MediaPicture
                  src={`/media/gallery/${id}.webp`}
                  alt={`Сгенерированный образ: ${title.toLocaleLowerCase("ru")}`}
                />
              </figure>
            ))}
          </MediaGallery>
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
          <StatisticsBlock />
        </section>

        <section
          className="section-shell subsidiary-section"
          aria-labelledby="subsidiary-title"
          data-section="subsidiary-services"
          data-node-id="1767:7456"
        >
          <SectionHeading id="subsidiary-title">Услуги</SectionHeading>
          <div className="subsidiary-bento" data-testid="subsidiary-grid">
            {SUBSIDIARY_SERVICES.map((item, index) => (
              <article
                key={item.id}
                className={`subsidiary-card subsidiary-card--${index + 1}${item.href ? " subsidiary-card--linked" : ""}`}
                data-subsidiary-item
                data-subsidiary-service={item.id}
              >
                <div className="subsidiary-card__media" data-subsidiary-media>
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 40vw"
                  />
                </div>
                <div className="subsidiary-card__header">
                  <p className="subsidiary-card__eyebrow card-eyebrow-tab">
                    {item.company}
                  </p>
                  <h3>{item.service}</h3>
                </div>
                <div className="subsidiary-card__details">
                  <p>{item.description}</p>
                </div>
                <a
                  className="subsidiary-card__stretched-link card-stretched-link"
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Подробнее: ${item.service} (откроется в новой вкладке)`}
                />
                <span className="subsidiary-card__cta card-cta" aria-hidden="true">
                  Подробнее
                  <ArrowIcon
                    className="inline-arrow-icon card-cta__icon"
                    direction="right"
                  />
                </span>
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
          <SectionHeading id="social-title">Социальные обязательства</SectionHeading>
          <div className="social-grid">
            {SOCIAL_COMMITMENTS.map((item) => (
              <article
                key={item.id}
                className="social-card"
                data-social-item
                data-social-commitment={item.id}
                data-node-id={item.nodeId}
                aria-labelledby={`social-${item.id}-title`}
              >
                <div className="social-card__media" data-social-media>
                  <MediaPicture src={item.src} alt={item.imageAlt} />
                </div>
                <div className="social-card__content">
                  <p className="social-card__eyebrow card-eyebrow-tab">
                    {item.eyebrow}
                  </p>
                  <h3 id={`social-${item.id}-title`}>{item.title}</h3>
                  <p>{item.description}</p>
                  <a
                    className="card-cta card-stretched-link"
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${item.linkLabel}: ${item.title} (откроется в новой вкладке)`}
                  >
                    {item.linkLabel}
                    <ArrowIcon
                      className="inline-arrow-icon card-cta__icon"
                      direction="right"
                    />
                    <span className="visually-hidden">
                      {" "}
                      (откроется в новой вкладке)
                    </span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          className="section-shell future-section"
          aria-labelledby="future-title"
          data-section="future"
          data-node-id="1767:7508"
        >
          <SectionHeading id="future-title" layer={3}>
            Будущие проекты
          </SectionHeading>
          <div className="future-layout" data-testid="future-projects">
            <FutureProjectsMap />
            <div className="future-projects">
              {FUTURE_PROJECTS.map((project, index) => (
                <article
                  key={project.id}
                  data-future-project
                  data-status={project.publicationStatus}
                  data-node-id={project.figmaCardNodeId}
                >
                  <Image
                    className="future-projects__image"
                    src={FUTURE_PROJECT_MEDIA[index] ?? FUTURE_PROJECT_MEDIA[0]}
                    alt=""
                    width={1200}
                    height={680}
                    loading="lazy"
                  />
                  <div className="future-projects__shade" aria-hidden="true" />
                  {project.publicationStatus === "verified" ? (
                    <a
                      className="future-projects__stretched-link card-stretched-link"
                      href={project.detailsUrl}
                      aria-label={`Подробнее: ${project.title}`}
                    />
                  ) : null}
                  <div className="future-projects__content">
                    <div className="future-projects__meta card-eyebrow-tab">
                      <p>Проект {index + 1}</p>
                      {project.publicationStatus === "verified" ? (
                        <span>{project.shortTitle}</span>
                      ) : null}
                    </div>
                    {project.publicationStatus === "verified" ? (
                      <>
                        <h3 title={project.title} aria-label={project.title}>
                          {project.title}
                        </h3>
                        <p>
                          <time dateTime={`${project.deadlineYear}`}>
                            {project.deadlineLabel}
                          </time>
                        </p>
                        <span
                          className="future-projects__cta card-cta"
                          aria-hidden="true"
                        >
                          Подробнее
                          <ArrowIcon
                            className="inline-arrow-icon card-cta__icon"
                            direction="right"
                          />
                        </span>
                      </>
                    ) : (
                      <>
                        <h3>Название и срок не опубликованы</h3>
                        <p>{project.mapGeometry.reason}</p>
                      </>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer" data-section="footer" data-node-id="1767:7539">
        <div className="footer-frame" data-node-id="1767:7540">
          <div className="footer-top-row" data-node-id="1767:7541">
            <div className="footer-brand" data-node-id="1767:7542">
              <a
                href="https://russianhighways.ru/"
                aria-label="Государственная компания Автодор"
              >
                <Image
                  src="/brand/autodor-logo-footer.svg"
                  alt=""
                  width={241}
                  height={38}
                  loading="lazy"
                />
              </a>
            </div>
            <div className="footer-top-spacer" aria-hidden="true" />
            <address className="footer-contacts" data-node-id="1767:8050">
              {FOOTER_CONTACTS.map((item) => {
                const content = (
                  <>
                    <Image src={item.image} alt="" width={24} height={24} />
                    <span>{item.value}</span>
                  </>
                );

                return item.href ? (
                  <a
                    className="footer-contact"
                    href={item.href}
                    data-node-id={item.nodeId}
                    key={item.label}
                  >
                    {content}
                  </a>
                ) : (
                  <span
                    className="footer-contact"
                    data-node-id={item.nodeId}
                    key={item.label}
                  >
                    {content}
                  </span>
                );
              })}
            </address>
            <nav
              className="footer-social"
              aria-label="Социальные сети"
              data-node-id="1767:8066"
            >
              {SOCIAL_LINKS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  aria-label={item.label}
                  data-node-id={item.nodeId}
                >
                  <Image
                    src={item.image}
                    alt=""
                    width={48}
                    height={48}
                    loading="lazy"
                  />
                </a>
              ))}
            </nav>
          </div>

          <nav
            className="footer-government"
            aria-label="Государственные ресурсы"
            data-node-id="1767:8085"
          >
            {GOVERNMENT_LINKS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                aria-label={item.label}
                data-node-id={item.nodeId}
              >
                <Image
                  src={item.image}
                  alt=""
                  width={item.width}
                  height={64}
                  loading="lazy"
                />
                <span className="footer-government__label">{item.caption}</span>
              </a>
            ))}
          </nav>

          <nav
            className="footer-legal"
            aria-label="Правовая информация"
            data-node-id="1767:9207"
          >
            {FOOTER_LEGAL_LINKS.map((item) => (
              <a href={item.href} data-node-id={item.nodeId} key={item.label}>
                {item.label}
              </a>
            ))}
          </nav>

          <p className="footer-copyright" data-node-id="1767:9215">
            © 2009–2026&nbsp;Государственная компания «Российские автомобильные дороги»
          </p>
        </div>
      </footer>

      <CardTiltController />
    </>
  );
}
