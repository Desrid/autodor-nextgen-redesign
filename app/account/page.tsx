import { HeaderNav } from "@/app/components/HeaderNav.client";
import Link from "next/link";

import { AccountDashboard } from "./AccountDashboard.client";

import "./page.css";

const accountNavigation = ["Поездки", "Финансы", "Абонементы", "Транспондеры", "Госномера", "Дополнительные услуги", "Выписка"] as const;

const plates = [
  { number: "A 001 AA", region: "77", status: "Отсутствует", tone: "clear" },
  { number: "M 777 MM", region: "197", status: "1 856 ₽", tone: "debt" },
] as const;

const transponders = ["3041655 0000 4725 2066", "3041655 0000 4725 2066"] as const;

export default function AccountPage() {
  return <><header className="site-header"><HeaderNav /></header><div id="header-scroll-sentinel" className="header-scroll-sentinel" aria-hidden="true" /><AccountDashboard /></>;
}

// Kept as the route's static reference while interactive states live in AccountDashboard.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function LegacyAccountPage() {
  return <>
    <header className="site-header"><HeaderNav /></header>
    <div id="header-scroll-sentinel" className="header-scroll-sentinel" aria-hidden="true" />
    <main id="main-content" className="account-page" tabIndex={-1}>
      <div className="account-prototype">
        <aside className="account-sidebar" aria-label="Разделы личного кабинета">
          <div className="account-profile"><strong>Алексей Смирнов</strong><span>Лицевой счёт № 4230 7812</span></div>
          <Link className="account-home" href="/account" aria-current="page">Главная</Link>
          <nav><ul>{accountNavigation.map((item) => <li key={item}><a href="#account-content">{item}</a></li>)}</ul></nav>
        </aside>
        <section className="account-workspace" id="account-content" aria-label="Личный кабинет">
          <div className="account-notice" role="status"><span aria-hidden="true">i</span><p>Добавить неперсонифицированный транспондер к Вашему Лицевому счету теперь легко — с новой услугой «Перемещение транспондера».</p></div>
          <div className="account-columns">
            <div className="account-primary">
              <section className="account-panel account-balance" aria-labelledby="balance-title">
                <h1 id="balance-title">Лицевой счет</h1>
                <div className="account-rule" />
                <p>Баланс на сегодня <time dateTime="18:03">18:03</time></p>
                <strong>1 453,00 ₽</strong>
                <button type="button">Пополнить счет</button>
              </section>
              <section className="account-panel account-discounts" aria-labelledby="discounts-title">
                <h2 id="discounts-title">Скидки</h2>
                <div className="account-rule" />
                <p>Бонусные баллы</p>
                <strong>8 400 баллов</strong>
                <div className="discount-detail"><p>Скидка 15% на проезд по T-PASS</p><p>на период 01.07.2026 – 31.07.2026</p></div>
                <div className="subscription-detail"><h3>Абонементы</h3><p>Действующих абонементов нет</p></div>
                <button type="button">Купить</button>
              </section>
            </div>
            <div className="account-secondary">
              <section className="plates-panel" aria-labelledby="plates-title">
                <h2 id="plates-title">Ваши госномера</h2>
                <div className="plates-list">{plates.map((plate) => <div className="plate-row" key={plate.number}>
                  <div className="license-plate" aria-label={`Госномер ${plate.number}, регион ${plate.region}`}><strong>{plate.number}</strong><span>{plate.region}<small>RUS</small></span></div>
                  <p className={`plate-status plate-status--${plate.tone}`}><span>Задолженность</span><strong>{plate.status}</strong></p>
                </div>)}</div>
                <button type="button">Добавить гос номер</button>
              </section>
              <section className="transponders-panel" aria-labelledby="transponders-title">
                <h2 id="transponders-title">Транспондеры</h2>
                <div className="transponder-list">{transponders.map((value, index) => <div className="transponder" key={`${value}-${index}`}><span aria-hidden="true">T</span><p>{value}</p><b aria-label="Подключено">✓</b></div>)}</div>
                <p className="interoperability"><span aria-hidden="true">✓</span>Интероперабельность подключена</p>
              </section>
            </div>
          </div>
        </section>
      </div>
    </main>
  </>;
}
