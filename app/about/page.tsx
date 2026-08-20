import Image from "next/image";
import Link from "next/link";

import { ArrowIcon } from "@/app/components/ArrowIcon";
import { FloatingUtilities } from "@/app/components/FloatingUtilities.client";
import { HeaderNav } from "@/app/components/HeaderNav.client";
import { SiteFooter } from "@/app/components/SiteFooter";

import { HistoryMapOverlay } from "./HistoryMapOverlay.client";

import "./page.css";

const directions = [
  { title: "Строительство", text: "Новые автомагистрали и обходы", href: "https://russianhighways.ru/about/activity/", image: "/media/optimized/road-construction/road-construction-desktop-640.avif" },
  { title: "Эксплуатация", text: "Содержание и безопасность дорог", href: "https://russianhighways.ru/for_drivers/", image: "/media/optimized/bridge-viaduct/bridge-viaduct-desktop-640.avif" },
  { title: "Инвестиции", text: "Концессии и инфраструктурные проекты", href: "https://russianhighways.ru/for_investor/", image: "/media/news/government-meeting.png" },
  { title: "Цифровые сервисы", text: "ИТС, оплата и пользовательские продукты", href: "/road-users", image: "/media/road-user-stories/transponder.png" },
  { title: "Придорожная инфраструктура", text: "МФЗ, АЗС и сервисные зоны", href: "https://russianhighways.ru/for_drivers/", image: "/media/road-user-stories/roadside-help.png" },
  { title: "Международное сотрудничество", text: "Партнёрские и отраслевые проекты", href: "https://russianhighways.ru/about/activity/", image: "/media/important/transport-complex.png" },
] as const;

const compliance = [
  { title: "Раскрытие информации", href: "https://russianhighways.ru/about/regulatory-information/disc_inform/", image: "/media/news/government-meeting.png" },
  { title: "Инсайдерам", href: "https://russianhighways.ru/for_investor/disclosure/insayderam", image: "/media/news/perm-development.png" },
  { title: "Антимонопольный комплаенс", href: "https://russianhighways.ru/about/antimonopolnyy-komplaens/", image: "/media/news/ckad-traffic.png" },
  { title: "Отозванные доверенности", href: "https://russianhighways.ru/about/otozvannye-doverennosti/", image: "/media/news/pskov-roadside.png" },
  { title: "Нормативно-правовая документация", href: "https://russianhighways.ru/about/regulatory-information/", image: "/media/important/road-infrastructure.png" },
] as const;

function SectionHeading({ id, children, lead }: Readonly<{ id: string; children: string; lead: string }>) {
  return <header className="about-section-heading"><h2 id={id}>{children}</h2><p>{lead}</p></header>;
}

function Card({ title, text, href, image }: Readonly<{ title: string; text?: string; href: string; image: string }>) {
  return <a className="about-card" href={href}><Image className="about-card__image" src={image} alt="" fill sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 33vw" /><span className="about-card__shade" aria-hidden="true" /><span className="about-card__content"><strong>{title}</strong>{text ? <small>{text}</small> : null}</span><ArrowIcon className="about-card__arrow" direction="right" /></a>;
}

export default function AboutPage() {
  return <>
    <header className="site-header"><HeaderNav /></header>
    <div id="header-scroll-sentinel" className="header-scroll-sentinel" aria-hidden="true" />
    <main id="main-content" className="about-page" tabIndex={-1}>
      <section className="about-hero" aria-labelledby="about-title">
        <Image className="about-hero__image" src="/media/optimized/road-construction/road-construction-desktop-1440.avif" alt="Строительство современной автомобильной дороги" fill priority sizes="(max-width: 767px) 100vw, 1464px" />
        <div className="about-hero__scrim" aria-hidden="true" />
        <div className="about-hero__content">
          <nav className="about-breadcrumbs" aria-label="Хлебные крошки">
            <Link href="/">Главная</Link>
            <svg aria-hidden="true" viewBox="0 0 16 16" focusable="false">
              <path d="M6 3.5 10.5 8 6 12.5" />
            </svg>
            <span aria-current="page">О компании</span>
          </nav>
          <h1 id="about-title">О компании</h1>
          <p className="about-hero__lead">Мы создаём современную дорожную инфраструктуру, которая объединяет регионы и открывает возможности.</p>
          <aside className="about-mission"><span>Миссия</span><p>Безопасные дороги, развитие территорий и комфорт пользователей.</p></aside>
        </div>
      </section>

      <section className="about-section future-section" aria-labelledby="future-title">
        <header className="about-section-heading"><h2 id="future-title">История Автодора</h2></header>
        <HistoryMapOverlay />
      </section>

      <section className="about-section" aria-labelledby="directions-title">
        <SectionHeading id="directions-title" lead="Основные направления одновременно ведут в профильные разделы">Направления деятельности</SectionHeading>
        <div className="about-grid about-grid--directions">{directions.map((card) => <Card key={card.title} {...card} />)}</div>
      </section>

      <section className="about-section" aria-labelledby="structure-title">
        <SectionHeading id="structure-title" lead="Переход к структуре дочерних обществ и филиалов">Структура ГК</SectionHeading>
        <div className="about-grid about-grid--structure"><Card title="Дочерние общества" text="Компании группы и направления работы" href="https://russianhighways.ru/about/affiliates/" image="/media/optimized/federal-highway-aerial-hero/federal-highway-aerial-hero-desktop-960.avif" /><Card title="Филиалы" text="Региональная структура Государственной компании" href="https://russianhighways.ru/about/structure/" image="/media/optimized/tunnel-portal/tunnel-portal-desktop-960.avif" /></div>
      </section>

      <section className="about-section" aria-labelledby="compliance-title">
        <SectionHeading id="compliance-title" lead="Документы и обязательное раскрытие информации">Комплаенс</SectionHeading>
        <div className="about-grid about-grid--compliance">{compliance.map((card) => <Card key={card.title} {...card} />)}</div>
      </section>

      <section id="contacts" className="about-section about-contacts" aria-labelledby="contacts-title">
        <SectionHeading id="contacts-title" lead="Государственная компания «Автодор»">Контакты</SectionHeading>
        <div className="about-contact-map">
          <Image src="/media/about-contacts-map.png" alt="Схема расположения офиса Государственной компании «Автодор» в Москве" fill sizes="(max-width: 767px) 100vw, 1464px" />
          <div className="about-contact-map__scrim" aria-hidden="true" />
          <article className="about-contact-card">
            <dl>
              <div><dt>Наш адрес</dt><dd>127006, Москва, Страстной бульвар, 9</dd></div>
              <div><dt>Контактные телефоны</dt><dd><a href="tel:+74957271195">+7 (495) 727-11-95</a><span>/ многоканальный</span></dd><dd><a href="tel:+74955809841">+7 (495) 580-98-41</a><span>/ ситуационный центр</span></dd></div>
              <div><dt>Электронная почта</dt><dd><a href="mailto:info@russianhighways.ru">info@russianhighways.ru</a></dd></div>
            </dl>
          </article>
          <svg className="about-contact-map__pin" aria-hidden="true" viewBox="0 0 48 56" focusable="false"><path d="M24 0C10.75 0 0 10.75 0 24c0 18 24 32 24 32s24-14 24-32C48 10.75 37.25 0 24 0Zm0 32a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z" /></svg>
        </div>
      </section>
    </main>
    <SiteFooter />
    <FloatingUtilities />
  </>;
}
