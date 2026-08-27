import Image from "next/image";
import Link from "next/link";

import { ArrowIcon } from "@/app/components/ArrowIcon";
import { HeaderNav } from "@/app/components/HeaderNav.client";
import { SiteFooter } from "@/app/components/SiteFooter";
import { Icon } from "@/app/components/icons";
import { SUBSIDIARY_SERVICES } from "@/app/data/home-content";

import { HistoryMapOverlay } from "./HistoryMapOverlay.client";
import { AboutVideo } from "./AboutVideo.client";

import "./page.css";

const activities = [
  {
    title: "Строительство и реконструкция дорог",
    text: "Скоростные магистрали и обходы населённых пунктов для безопасных и быстрых поездок между городами.",
    href: "https://russianhighways.ru/about/activity/",
    image: "/media/optimized/road-construction/road-construction-desktop-640.avif",
  },
  {
    title: "Ремонт и эксплуатация дорог",
    text: "Мониторинг состояния, ремонт, содержание и комплексное обустройство дорожной сети.",
    href: "https://russianhighways.ru/about/activity/",
    image: "/media/optimized/bridge-viaduct/bridge-viaduct-desktop-640.avif",
  },
  {
    title: "Придорожный сервис",
    text: "Многофункциональные зоны отдыха с топливом, кафе, магазинами и сервисами для путешественников.",
    href: "https://russianhighways.ru/about/activity/",
    image: "/media/news/pskov-roadside.png",
  },
  {
    title: "Инновации",
    text: "Интеллектуальное управление дорогами, новые материалы и современные технологии проектирования.",
    href: "https://russianhighways.ru/about/activity/",
    image: "/media/road-user-stories/transponder.png",
  },
  {
    title: "Экология",
    text: "«Зелёный стандарт»: ресурсосбережение и снижение воздействия строительства и эксплуатации на природу.",
    href: "https://russianhighways.ru/about/activity/",
    image: "/media/important/road-infrastructure.png",
  },
  {
    title: "Просветительская и образовательная деятельности",
    text: "Совместные программы с ведущими вузами, практики, стажировки и прикладные исследования.",
    href: "https://russianhighways.ru/about/activity/",
    image: "/media/news/madi-graduates.png",
  },
  {
    title: "Восстановление дорожной инфраструктуры в исторических регионах",
    text: "Восстановление федеральных и региональных дорог, связывающих города и населённые пункты.",
    href: "https://russianhighways.ru/about/activity/",
    image: "/media/news/perm-development.png",
  },
] as const;

const companyFacts = [
  {
    value: "5 954,3",
    unit: "км",
    label: "Общая протяжённость дорог в доверительном управлении",
  },
  { value: "3 679,5", unit: "км", label: "Протяжённость дорог в платной эксплуатации" },
  {
    value: "130",
    unit: "км/ч",
    label: "Максимальная разрешённая скорость на платных участках",
  },
  { value: "164", label: "Экипажа службы аварийных комиссаров" },
  {
    value: "Свободный поток",
    label:
      "Перспективная технология взимания платы без шлагбаумов и без снижения скорости автомобилей",
  },
  { value: "138", label: "Многофункциональных зон сервиса" },
  { value: "20", label: "Проектов насчитывает инвестиционный портфель" },
  { value: "*2323", label: "Единый номер вызова помощи на дорогах" },
] as const;

function SectionHeading({
  id,
  children,
  lead,
}: Readonly<{ id: string; children: string; lead: string }>) {
  return (
    <header className="about-section-heading">
      <h2 id={id}>{children}</h2>
      <p>{lead}</p>
    </header>
  );
}

export default function AboutPage() {
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
      <main id="main-content" className="about-page" tabIndex={-1}>
        <section className="about-hero" aria-labelledby="about-title">
          <Image
            className="about-hero__image"
            src="/media/optimized/road-construction/road-construction-desktop-1440.avif"
            alt="Строительство современной автомобильной дороги"
            fill
            priority
            sizes="(max-width: 767px) 100vw, 1464px"
          />
          <div className="about-hero__scrim" aria-hidden="true" />
          <div className="about-hero__content">
            <nav className="about-breadcrumbs" aria-label="Хлебные крошки">
              <Link href="/">Главная</Link>
              <Icon name="chevronRight" size={16} />
              <span aria-current="page">О компании</span>
            </nav>
            <h1 id="about-title">О компании</h1>
            <p className="about-hero__lead">
              Мы создаём современную дорожную инфраструктуру, которая объединяет регионы
              и открывает возможности.
            </p>
            <aside className="about-mission">
              <span>Миссия</span>
              <p>Безопасные дороги, развитие территорий и комфорт пользователей.</p>
            </aside>
          </div>
          <aside className="about-quote" aria-label="Слово председателя правления">
            <div className="about-quote__copy">
              <svg
                className="about-quote__mark"
                aria-hidden="true"
                viewBox="0 0 96 66"
                focusable="false"
              >
                <path d="M0 66V42.5L18.5 0H39L25.5 39H42V66H0Z" />
                <path
                  d="M0 66V42.5L18.5 0H39L25.5 39H42V66H0Z"
                  transform="translate(54)"
                />
              </svg>
              <blockquote>
                «Скорость — отличительная черта дорог Автодора. Комфорт, безопасность,
                экологичность — ключевые требования наших клиентов — пользователей
                дорог»
              </blockquote>
              <footer>
                <span>Председатель правления Государственной компании «Автодор»</span>
                <strong>Вячеслав Петушенко</strong>
              </footer>
            </div>
            <Image
              className="about-quote__portrait"
              src="/media/about-petushenko.png"
              alt="Вячеслав Петушенко, председатель правления Государственной компании «Автодор»"
              width={560}
              height={690}
              sizes="(max-width: 767px) 44vw, 32vw"
            />
          </aside>
        </section>

        <AboutVideo />

        <section className="about-foundation" aria-labelledby="foundation-date">
          <div className="about-foundation__date">
            <span className="about-foundation__day" aria-hidden="true">
              17
            </span>
            <h2 id="foundation-date" aria-label="17 июля 2009 года">
              июля
            </h2>
            <span className="about-foundation__year" aria-hidden="true">
              2009 года
            </span>
          </div>
          <p>
            Вступил в силу Федеральный закон № 145-ФЗ «О Государственной компании
            „Российские автомобильные дороги“», который стал отправной точкой
            деятельности Государственной компании и фактическим днём её создания.
          </p>
        </section>

        <section className="about-today" aria-labelledby="about-today-title">
          <h2 id="about-today-title">Автодор сегодня</h2>
          <div className="about-today__facts">
            {companyFacts.map((fact) => (
              <article className="about-today__fact" key={fact.value}>
                <p className="about-today__value">
                  <strong>{fact.value}</strong>
                  {"unit" in fact ? <span>{fact.unit}</span> : null}
                </p>
                <p>{fact.label}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          className="about-section future-section"
          aria-labelledby="future-title"
        >
          <header className="about-section-heading">
            <h2 id="future-title">История Автодора</h2>
          </header>
          <HistoryMapOverlay />
        </section>

        <section
          className="about-section about-activity"
          aria-labelledby="activity-title"
        >
          <header className="about-activity__heading">
            <div>
              <h2 id="activity-title">Деятельность компании</h2>
            </div>
            <div className="about-activity__intro">
              <p>
                Автодор развивает дорожную сеть на всём жизненном цикле — от
                строительства и эксплуатации до сервисов, инноваций и образования.
              </p>
              <a href="https://russianhighways.ru/about/activity/">
                Подробнее о деятельности
                <ArrowIcon direction="right" />
              </a>
            </div>
          </header>
          <ol className="about-activity__grid">
            {activities.map((activity) => (
              <li className="about-activity__item" key={activity.title}>
                <a href={activity.href}>
                  <Image
                    className="about-activity__image"
                    src={activity.image}
                    alt=""
                    fill
                    sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 42vw"
                  />
                  <span className="about-activity__shade" aria-hidden="true" />
                  <span className="about-activity__content">
                    <strong>{activity.title}</strong>
                    <small>{activity.text}</small>
                  </span>
                  <ArrowIcon className="about-activity__arrow" direction="right" />
                </a>
              </li>
            ))}
          </ol>
        </section>

        <section
          className="about-section about-structure"
          aria-labelledby="structure-title"
        >
          <SectionHeading
            id="structure-title"
            lead="Система управления и взаимосвязь компаний группы"
          >
            Структура ГК
          </SectionHeading>
          <div
            className="about-structure__diagram"
            aria-label="Иерархия управления Государственной компании Автодор"
          >
            <div className="about-structure__top">
              <a
                className="about-structure__node about-structure__node--government"
                href="http://government.ru/"
              >
                <Image
                  className="about-structure__government-logo"
                  src="/brand/government-rf.svg"
                  width={144}
                  height={72}
                  alt=""
                />
                <span className="about-structure__copy">
                  <small>Учредитель</small>
                  <strong>Правительство Российской Федерации</strong>
                </span>
                <ArrowIcon className="about-structure__link-arrow" direction="right" />
              </a>

              <span className="about-structure__side-flow" aria-hidden="true" />

              <a
                className="about-structure__node about-structure__node--mintrans"
                href="https://mintrans.gov.ru/"
              >
                <Image
                  className="about-structure__mintrans-logo"
                  src="/brand/mintrans-rf.svg"
                  width={59}
                  height={64}
                  alt=""
                />
                <span className="about-structure__copy">
                  <small>Отраслевое кураторство</small>
                  <strong>Министерство транспорта Российской Федерации</strong>
                </span>
                <ArrowIcon className="about-structure__link-arrow" direction="right" />
              </a>
            </div>

            <span className="about-structure__flow" aria-hidden="true" />

            <a
              id="structure-01"
              className="about-structure__council"
              href="https://russianhighways.ru/about/structure/#structure-01"
            >
              <span>Высший орган управления</span>
              <h3>Наблюдательный совет</h3>
              <ArrowIcon className="about-structure__link-arrow" direction="right" />
            </a>

            <span className="about-structure__flow" aria-hidden="true" />

            <a
              className="about-structure__company"
              href="https://russianhighways.ru/about/structure"
            >
              <Image
                className="about-structure__company-logo"
                src="/brand/autodor-logo.svg"
                width={242}
                height={41}
                alt=""
              />
              <span className="about-structure__copy">
                <small>Государственная компания</small>
                <strong>«Российские автомобильные дороги»</strong>
              </span>
              <ArrowIcon className="about-structure__link-arrow" direction="right" />
            </a>

            <span
              className="about-structure__flow about-structure__flow--branch"
              aria-hidden="true"
            />

            <a
              className="about-structure__dzo"
              href="https://russianhighways.ru/about/affiliates/"
            >
              <span className="about-structure__copy">
                <small>Дочерние и зависимые общества</small>
                <strong>ДЗО</strong>
                <span>Компании группы и направления работы</span>
              </span>
              <ArrowIcon className="about-structure__link-arrow" direction="right" />
            </a>
          </div>
        </section>

        <section
          className="about-section subsidiary-section"
          aria-labelledby="compliance-title"
        >
          <SectionHeading
            id="compliance-title"
            lead="Документы и обязательное раскрытие информации"
          >
            Комплаенс
          </SectionHeading>
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
          id="contacts"
          className="about-section about-contacts"
          aria-labelledby="contacts-title"
        >
          <SectionHeading id="contacts-title" lead="Государственная компания «Автодор»">
            Контакты
          </SectionHeading>
          <div className="about-contact-map">
            <Image
              src="/media/about-contacts-map.png"
              alt="Схема расположения офиса Государственной компании «Автодор» в Москве"
              fill
              sizes="(max-width: 767px) 100vw, 1464px"
            />
            <div className="about-contact-map__scrim" aria-hidden="true" />
            <article className="about-contact-card">
              <dl>
                <div>
                  <dt>Наш адрес</dt>
                  <dd>127006, Москва, Страстной бульвар, 9</dd>
                </div>
                <div>
                  <dt>Контактные телефоны</dt>
                  <dd>
                    <a href="tel:+74957271195">+7 (495) 727-11-95</a>
                    <span>/ многоканальный</span>
                  </dd>
                  <dd>
                    <a href="tel:+74955809841">+7 (495) 580-98-41</a>
                    <span>/ ситуационный центр</span>
                  </dd>
                </div>
                <div>
                  <dt>Электронная почта</dt>
                  <dd>
                    <a href="mailto:info@russianhighways.ru">info@russianhighways.ru</a>
                  </dd>
                </div>
              </dl>
            </article>
            <svg
              className="about-contact-map__pin"
              aria-hidden="true"
              viewBox="0 0 48 56"
              focusable="false"
            >
              <path d="M24 0C10.75 0 0 10.75 0 24c0 18 24 32 24 32s24-14 24-32C48 10.75 37.25 0 24 0Zm0 32a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z" />
            </svg>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
