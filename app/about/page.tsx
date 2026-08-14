import Image from "next/image";
import Link from "next/link";

import { ArrowIcon } from "@/app/components/ArrowIcon";
import { ContactsTabs } from "@/app/components/ContactsTabs.client";
import { FloatingUtilities } from "@/app/components/FloatingUtilities.client";
import { HeaderNav } from "@/app/components/HeaderNav.client";
import { SiteFooter } from "@/app/components/SiteFooter";

import "./page.css";

const directions = [
  ["Строительство", "Новые автомагистрали и обходы", "https://russianhighways.ru/about/activity/"],
  ["Эксплуатация", "Содержание и безопасность дорог", "https://russianhighways.ru/for_drivers/"],
  ["Инвестиции", "Концессии и инфраструктурные проекты", "https://russianhighways.ru/for_investor/"],
  ["Цифровые сервисы", "ИТС, оплата и пользовательские продукты", "/road-users"],
  ["Придорожная инфраструктура", "МФЗ, АЗС и сервисные зоны", "https://russianhighways.ru/for_drivers/"],
  ["Международное сотрудничество", "Партнёрские и отраслевые проекты", "https://russianhighways.ru/about/activity/"],
] as const;

const compliance = [
  ["Раскрытие информации", "https://russianhighways.ru/about/regulatory-information/disc_inform/"],
  ["Инсайдерам", "https://russianhighways.ru/for_investor/disclosure/insayderam"],
  ["Антимонопольный комплаенс", "https://russianhighways.ru/about/antimonopolnyy-komplaens/"],
  ["Отозванные доверенности", "https://russianhighways.ru/about/otozvannye-doverennosti/"],
  ["Нормативно-правовая документация", "https://russianhighways.ru/about/regulatory-information/"],
] as const;

function SectionHeading({ id, children, lead }: Readonly<{ id: string; children: string; lead: string }>) {
  return <header className="about-section-heading"><h2 id={id}>{children}</h2><p>{lead}</p></header>;
}

function Card({ title, text, href }: Readonly<{ title: string; text?: string; href: string }>) {
  return <a className="about-card" href={href}><span><strong>{title}</strong>{text ? <small>{text}</small> : null}</span><ArrowIcon className="about-card__arrow" direction="right" /></a>;
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

      <section className="about-section about-history" aria-labelledby="history-title">
        <SectionHeading id="history-title" lead="Развитие дорожной сети по годам">История Автодора</SectionHeading>
        <div className="about-history__map">
          <Image src="/media/about-history-map.png" alt="Карта развития дорожной сети Автодора" fill sizes="(max-width: 767px) 100vw, 1464px" />
          <ol className="about-history__timeline" aria-label="Ключевые годы развития"><li>2018</li><li>2020</li><li>2022</li><li>2024</li><li><strong>2026</strong></li></ol>
        </div>
      </section>

      <section className="about-section" aria-labelledby="directions-title">
        <SectionHeading id="directions-title" lead="Основные направления одновременно ведут в профильные разделы">Направления деятельности</SectionHeading>
        <div className="about-grid about-grid--directions">{directions.map(([title, text, href]) => <Card key={title} title={title} text={text} href={href} />)}</div>
      </section>

      <section className="about-section" aria-labelledby="structure-title">
        <SectionHeading id="structure-title" lead="Переход к структуре дочерних обществ и филиалов">Структура ГК</SectionHeading>
        <div className="about-grid about-grid--structure"><Card title="Дочерние общества" text="Компании группы и направления работы" href="https://russianhighways.ru/about/affiliates/" /><Card title="Филиалы" text="Региональная структура Государственной компании" href="https://russianhighways.ru/about/structure/" /></div>
      </section>

      <section className="about-section" aria-labelledby="compliance-title">
        <SectionHeading id="compliance-title" lead="Документы и обязательное раскрытие информации">Комплаенс</SectionHeading>
        <div className="about-grid about-grid--compliance">{compliance.map(([title, href]) => <Card key={title} title={title} href={href} />)}</div>
      </section>

      <section id="contacts" className="about-section about-contacts" aria-labelledby="contacts-title">
        <SectionHeading id="contacts-title" lead="Адреса, телефоны и контакты организаций группы">Контакты</SectionHeading>
        <ContactsTabs />
      </section>
    </main>
    <SiteFooter />
    <FloatingUtilities />
  </>;
}
