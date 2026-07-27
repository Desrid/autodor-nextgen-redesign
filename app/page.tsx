import { ContactsTabs } from "@/app/components/ContactsTabs.client";
import { FloatingUtilities } from "@/app/components/FloatingUtilities.client";
import { HeaderNav } from "@/app/components/HeaderNav.client";
import LoyaltyRail from "@/app/components/LoyaltyRail.client";
import { MediaGallery } from "@/app/components/MediaGallery.client";
import { ServicesGrid } from "@/app/components/ServicesGrid";
import { StatisticsBlock } from "@/app/components/StatisticsBlock";
import {
  type HeroVariant,
  RoadNetworkHero,
} from "@/app/components/RoadNetworkHero.client";
import {
  GOVERNMENT_LINKS,
  NEWS,
  SOCIAL_LINKS,
  SUBSIDIARY_SERVICES,
} from "@/app/data/home-content";
import { FUTURE_PROJECTS, FUTURE_PROJECT_TIMELINE } from "@/app/data/future-projects";
import Image from "next/image";

type HomePageProps = Readonly<{
  searchParams?: Promise<
    Readonly<{
      car?: string | readonly string[];
      hero?: string | readonly string[];
    }>
  >;
}>;

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

function SectionHeading({ id, children }: Readonly<{ id: string; children: string }>) {
  return (
    <div className="section-heading">
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

export default async function HomePage({
  searchParams = Promise.resolve({}),
}: HomePageProps = {}) {
  const query = await searchParams;
  const carValue = Array.isArray(query.car) ? query.car[0] : query.car;
  const heroValue = Array.isArray(query.hero) ? query.hero[0] : query.hero;
  const withCar = carValue !== "off";
  const heroVariant: HeroVariant =
    heroValue === "atlas" || heroValue === "signal" ? heroValue : "cinematic";

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
          <RoadNetworkHero withCar={withCar} variant={heroVariant} />
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
          <div className="news-bento" data-testid="news-grid">
            {NEWS.map((item, index) => (
              <article
                key={item.href}
                className={`news-card news-card--${index + 1}`}
                data-news-item
              >
                <a
                  className="news-card__link"
                  href={item.href}
                  aria-label={`${item.title}. ${item.date}.`}
                >
                  <Image
                    className="news-card__image"
                    src={item.image}
                    alt={item.imageAlt}
                    fill
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
                    </div>
                    <div className="news-card__copy">
                      <h3>{item.title}</h3>
                      <span className="news-card__cta" aria-hidden="true">
                        Читать
                      </span>
                    </div>
                  </div>
                </a>
              </article>
            ))}
            <a
              className="news-bento__all"
              href="https://www.russianhighways.ru/press/news/"
            >
              Все новости
            </a>
          </div>
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
                src="/brand/autodor-network-map.svg"
                alt="Схема направлений развития сети дорог Автодора: действующие дороги, перспективные проекты, строящиеся участки и морские порты. Не предназначена для навигации"
                width="1600"
                height="760"
                loading="lazy"
              />
              <p className="visually-hidden">
                Статический режим карты. Названия и ориентир по сроку подтверждены
                официальным проспектом; точная геометрия не публикуется как проверенная.
              </p>
              <ol className="future-timeline" aria-label="Шкала лет из Figma">
                {FUTURE_PROJECT_TIMELINE.map((item) => (
                  <li key={item.year} data-node-id={item.figmaNodeId}>
                    <time>{item.year}</time>
                  </li>
                ))}
              </ol>
            </div>
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
              <span className="footer-contact" data-node-id="1767:8053">
                <Image src="/brand/footer-location.svg" alt="" width={24} height={24} />
                <span>Москва, Страстной бульвар, 9</span>
              </span>
              <a
                className="footer-contact"
                href="mailto:info@russianhighways.ru"
                data-node-id="1767:8058"
              >
                <Image src="/brand/footer-email.svg" alt="" width={24} height={24} />
                <span>info@russianhighways.ru</span>
              </a>
              <a
                className="footer-contact"
                href="tel:+74957271195"
                data-node-id="1767:8063"
              >
                <Image src="/brand/footer-phone.svg" alt="" width={24} height={24} />
                <span>+7&nbsp;495&nbsp;727-11-95</span>
              </a>
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
              </a>
            ))}
          </nav>

          <nav
            className="footer-legal"
            aria-label="Правовая информация"
            data-node-id="1767:9207"
          >
            <a
              href="https://russianhighways.ru/about/regulatory-information/disc_inform/"
              data-node-id="1767:9209"
            >
              Раскрытие информации
            </a>
            <a href="https://russianhighways.ru/about/" data-node-id="1767:9210">
              Противодействие коррупции
            </a>
            <a
              href="https://russianhighways.ru/upload/docs/politika_PD.pdf"
              data-node-id="1767:9211"
            >
              Политика обработки персональных данных
            </a>
          </nav>

          <p className="footer-copyright" data-node-id="1767:9215">
            © 2009–2026&nbsp;Государственная компания «Российские автомобильные дороги»
          </p>
        </div>
      </footer>

      <FloatingUtilities />
    </>
  );
}
