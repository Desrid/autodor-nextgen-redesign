"use client";

import {
  FormEvent,
  Fragment,
  PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/app/components/icons";
import { TransponderDeviceIcon as TransponderIcon } from "./TransponderDeviceIcon";

type Plate = {
  id: string;
  number: string;
  region: string;
  label: string;
  debt: string;
  paymentNote?: string;
};
type DragPosition = {
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
};
type DebtAlert = {
  level: "low" | "medium" | "high" | "critical";
  title: string;
  days: number;
  timing: string;
  detail: string;
};

function CloseIcon() {
  return <Icon className="account-svg-icon" name="close" size={24} />;
}

function NoticeIcon() {
  return <Icon className="account-svg-icon" name="info" size={24} />;
}
function WarningIcon() {
  return <Icon className="account-svg-icon" name="warning" size={24} />;
}
function SparkleIcon() {
  return <Icon className="account-svg-icon" name="sparkle" size={24} />;
}
function CheckIcon() {
  return <Icon className="account-svg-icon" name="check" size={24} />;
}
function InfoIcon() {
  return <Icon className="account-svg-icon" name="info" size={24} />;
}
function DownloadIcon() {
  return <Icon className="account-svg-icon" name="download" size={24} />;
}
function BellIcon() {
  return <Icon className="account-svg-icon" name="bell" size={24} />;
}
function OpenServiceArrowIcon() {
  return <Icon className="account-svg-icon" name="arrowRight" size={24} />;
}
function EditIcon() {
  return (
    <Icon className="account-svg-icon account-action-icon" name="edit" size={20} />
  );
}
function MoveIcon() {
  return (
    <Icon className="account-svg-icon account-action-icon" name="move" size={20} />
  );
}
function DetailsIcon() {
  return (
    <Icon className="account-svg-icon account-action-icon" name="details" size={20} />
  );
}
function PlusIcon() {
  return <Icon className="account-svg-icon" name="plusPlain" size={24} />;
}

function EmptyPlatesState() {
  return (
    <div className="plates-empty-state">
      <span aria-hidden="true">
        <Icon className="account-svg-icon" name="vehicle" size={24} />
      </span>
      <strong>Госномера не добавлены</strong>
      <p>Добавьте номер автомобиля, чтобы видеть начисления и задолженности.</p>
    </div>
  );
}

const MAX_PLATES = 5;
const navigation = [
  "Детализация",
  "Мои транспортные средства",
  "Программа лояльности",
  "Абонементы",
  "Конструктор путешествий",
  "Аналитика",
  "Отчёт",
  "Дополнительные услуги",
  "История обращений",
];
const initialPlates: Plate[] = [
  {
    id: "m777",
    number: "M 777 MM",
    region: "197",
    label: "Рабочий автомобиль",
    debt: "1 800 ₽",
    paymentNote: "Вынесено постановление",
  },
  {
    id: "a001",
    number: "A 001 AA",
    region: "77",
    label: "Мой автомобиль",
    debt: "Нет задолженности",
  },
];
const transponders = [
  {
    id: "4725",
    title: "Основной транспондер",
    number: "3041655 0000 4725 2066",
    discount: "15% на проезд по T-PASS",
    discountPeriod: "с 01.08.2026",
    discountEndsAt: "31.08.2026",
    subscription: "Осталось 5 поездок",
    subscriptionEndsAt: "31.08.2026",
  },
  {
    id: "4726",
    title: "Запасной транспондер",
    number: "3041655 0000 4725 2084",
    discount: "Скидка не подключена. Нужно накопить ещё 74 балла",
    subscription: "Подобрать",
    subscriptionEndsAt: undefined,
  },
];
const debtAlertTimeline = [
  { daysFromAccrual: 3 },
  { daysFromAccrual: 12, daysSinceDecision: 8 },
  { daysFromAccrual: 31, daysSinceDecision: 25 },
  { daysFromAccrual: 39, daysSinceDecision: 34 },
];

function getDebtAlert(
  daysFromAccrual: number,
  daysSinceDecision?: number,
): DebtAlert | null {
  if (daysSinceDecision === undefined)
    return {
      level: "low",
      title: "Задолженность ожидает оплаты",
      days: daysFromAccrual,
      timing: "С момента начисления прошло",
      detail: "Оплатите в течение 5 дней.",
    };
  if (daysSinceDecision <= 20)
    return {
      level: "medium",
      title: "Есть время оплатить задолженность",
      days: daysSinceDecision,
      timing: "С постановления прошло",
      detail: "При оплате в этот период штраф отменяется.",
    };
  if (daysSinceDecision <= 30)
    return {
      level: "high",
      title: "На задолженность начислен штраф",
      days: daysSinceDecision,
      timing: "С постановления прошло",
      detail: "На штраф действует скидка 25%.",
    };
  if (daysSinceDecision <= 60)
    return {
      level: "critical",
      title: "Оплатите задолженность до передачи приставам",
      days: daysSinceDecision,
      timing: "С постановления прошло",
      detail: "После 60 дней материалы будут переданы приставам.",
    };
  return null;
}

export function AccountHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const updateScrollState = () => setIsScrolled(window.scrollY > 8);
    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);
  useEffect(() => {
    if (!notificationsOpen) return;
    const closeOnOutsideClick = (event: globalThis.PointerEvent) => {
      if (!notificationsRef.current?.contains(event.target as Node))
        setNotificationsOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setNotificationsOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [notificationsOpen]);
  return (
    <div
      className={`account-header-shell ${isScrolled ? "account-header-shell--scrolled" : ""}`}
    >
      <Link
        className="account-header-brand"
        href="/"
        aria-label="Автодор, главная страница"
      >
        <Image
          src="/brand/autodor-logo.svg"
          alt=""
          width={726}
          height={123}
          priority
          unoptimized
        />
      </Link>
      <div className="account-header-actions">
        <a
          className="account-header-help"
          href="#account-content"
          aria-label="Помощь"
          title="Помощь"
        >
          <Icon name="help" size={20} />
        </a>
        <div className="account-header-notifications" ref={notificationsRef}>
          <button
            className={
              notificationsOpen
                ? "account-header-bell account-header-bell--open"
                : "account-header-bell"
            }
            type="button"
            aria-label="Уведомления"
            data-hint="Уведомления"
            aria-expanded={notificationsOpen}
            aria-controls="account-notifications-menu"
            onClick={() => setNotificationsOpen((isOpen) => !isOpen)}
          >
            <BellIcon />
            <span className="account-header-bell__badge" aria-hidden="true">
              2
            </span>
          </button>
          {notificationsOpen && (
            <section
              id="account-notifications-menu"
              className="account-notifications-menu"
              aria-label="Уведомления"
            >
              <header>
                <strong>Уведомления</strong>
                <button
                  type="button"
                  aria-label="Закрыть уведомления"
                  data-hint="Закрыть"
                  onClick={() => setNotificationsOpen(false)}
                >
                  <CloseIcon />
                </button>
              </header>
              <ul>
                <li className="account-notification account-notification--debt">
                  <span aria-hidden="true">
                    <WarningIcon />
                  </span>
                  <div>
                    <strong>Задолженность 1 856 ₽</strong>
                    <p>По номеру M 777 MM. Оплатите до передачи приставам.</p>
                  </div>
                </li>
                <li className="account-notification">
                  <span aria-hidden="true">
                    <SparkleIcon />
                  </span>
                  <div>
                    <strong>Скидка 5% доступна</strong>
                    <p>Осталось 1 000 бонусов до скидки 7%.</p>
                  </div>
                </li>
              </ul>
              <a href="#balance-title" onClick={() => setNotificationsOpen(false)}>
                Перейти к лицевому счёту
              </a>
            </section>
          )}
        </div>
        <button
          className="account-header-user"
          type="button"
          aria-label="Профиль Алексея Смирнова, физическое лицо"
        >
          <span className="account-header-user__copy">
            <b>Алексей Смирнов</b>
            <small>+7 916 000-00-00</small>
            <small>Физическое лицо</small>
          </span>
          <span className="account-header-user__avatar" aria-hidden="true">
            АС
          </span>
        </button>
      </div>
    </div>
  );
}

export function AccountDashboard() {
  const [plates, setPlates] = useState(initialPlates);
  const [toast, setToast] = useState("");
  const [alternativeBalance, setAlternativeBalance] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editingPlate, setEditingPlate] = useState<Plate | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [discountInfoOpen, setDiscountInfoOpen] = useState(false);
  const [interoperable, setInteroperable] = useState(true);
  const [number, setNumber] = useState("");
  const [region, setRegion] = useState("");
  const [label, setLabel] = useState("");
  const [formError, setFormError] = useState("");
  const [removingPlate, setRemovingPlate] = useState<Plate | null>(null);
  const [draggingPlateId, setDraggingPlateId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const [recentlyMovedId, setRecentlyMovedId] = useState<string | null>(null);
  const [dragPosition, setDragPosition] = useState<DragPosition | null>(null);
  const [debtAlertStageIndex, setDebtAlertStageIndex] = useState(0);
  const [newsBelowBalance, setNewsBelowBalance] = useState(false);
  const [newsDragging, setNewsDragging] = useState(false);
  const dragPositionRef = useRef<DragPosition | null>(null);
  const dropTargetRef = useRef<string | null>(null);
  const debtAlertStage =
    debtAlertTimeline[debtAlertStageIndex] ?? debtAlertTimeline[0]!;
  const debtAlert = getDebtAlert(
    debtAlertStage.daysFromAccrual,
    debtAlertStage.daysSinceDecision,
  );
  const advanceDebtAlert = () =>
    setDebtAlertStageIndex((index) => (index + 1) % debtAlertTimeline.length);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(""), 7500);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    const toggleAlternativeBalance = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        event.code !== "KeyS" ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        target?.closest("input, textarea, select, [contenteditable='true']")
      )
        return;
      event.preventDefault();
      setAlternativeBalance((current) => !current);
    };
    window.addEventListener("keydown", toggleAlternativeBalance);
    return () => window.removeEventListener("keydown", toggleAlternativeBalance);
  }, []);

  const addPlate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedNumber = number.trim().replace(/\s+/g, " ");
    if (
      !/^[A-ZА-Я]\s?\d{3}\s?[A-ZА-Я]{2}$/u.test(normalizedNumber) ||
      region.length < 2
    ) {
      setFormError("Введите номер в формате А 123 АА и регион из 2–3 цифр.");
      return;
    }
    if (editingPlate) {
      setPlates((items) =>
        items.map((item) =>
          item.id === editingPlate.id
            ? {
                ...item,
                number: normalizedNumber,
                region,
                label: label.trim() || "Без подписи",
              }
            : item,
        ),
      );
      setToast(`Данные номера ${normalizedNumber} обновлены`);
    } else {
      setPlates((items) => [
        ...items,
        {
          id: `${normalizedNumber}-${region}-${Date.now()}`,
          number: normalizedNumber,
          region,
          label: label.trim() || "Без подписи",
          debt: "Нет задолженности",
        },
      ]);
      setToast("Госномер добавлен");
    }
    setNumber("");
    setRegion("");
    setLabel("");
    setFormError("");
    setEditingPlate(null);
    setAddOpen(false);
  };
  const requestAdd = () => {
    if (plates.length >= MAX_PLATES)
      setToast(`Можно добавить не более ${MAX_PLATES} госномеров`);
    else {
      setEditingPlate(null);
      setNumber("");
      setRegion("");
      setLabel("");
      setFormError("");
      setAddOpen(true);
    }
  };
  const requestEdit = (plate: Plate) => {
    setEditingPlate(plate);
    setNumber(plate.number);
    setRegion(plate.region);
    setLabel(plate.label);
    setFormError("");
    setAddOpen(true);
  };
  const removePlate = (plate: Plate) => {
    setPlates((items) => items.filter((item) => item.id !== plate.id));
    setToast(`Госномер ${plate.number} удалён`);
    setRemovingPlate(null);
  };
  const moveDraggedPlate = (targetId: string) => {
    const draggingId = dragPositionRef.current?.id;
    if (!draggingId || draggingId === targetId) return;
    setPlates((items) => {
      const from = items.findIndex((item) => item.id === draggingId);
      const to = items.findIndex((item) => item.id === targetId);
      if (from < 0 || to < 0) return items;
      const next = [...items];
      const [moved] = next.splice(from, 1);
      if (!moved) return items;
      next.splice(to, 0, moved);
      return next;
    });
  };
  const finishPlateDrag = () => {
    const dragged = dragPositionRef.current;
    if (!dragged) return;
    const targetId = dropTargetRef.current;
    if (targetId && targetId !== dragged.id) moveDraggedPlate(targetId);
    setRecentlyMovedId(dragged.id);
    window.setTimeout(() => setRecentlyMovedId(null), 320);
    dragPositionRef.current = null;
    dropTargetRef.current = null;
    setDraggingPlateId(null);
    setDropTargetId(null);
    setDragPosition(null);
  };
  const startPointerDrag = (event: ReactPointerEvent<HTMLElement>, id: string) => {
    if ((event.target as HTMLElement).closest("button, a")) return;
    event.preventDefault();
    const source = event.currentTarget;
    const rect = source.getBoundingClientRect();
    const position = {
      id,
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
    };
    source.setPointerCapture(event.pointerId);
    dragPositionRef.current = position;
    dropTargetRef.current = null;
    setDraggingPlateId(id);
    setDropTargetId(null);
    setDragPosition(position);
  };
  const movePointerDrag = (event: ReactPointerEvent<HTMLElement>, id: string) => {
    const current = dragPositionRef.current;
    if (!current || current.id !== id) return;
    const next = {
      ...current,
      left: event.clientX - current.offsetX,
      top: event.clientY - current.offsetY,
    };
    dragPositionRef.current = next;
    setDragPosition(next);
    const targetId = document
      .elementFromPoint(event.clientX, event.clientY)
      ?.closest<HTMLElement>("[data-plate-id]")?.dataset.plateId;
    if (targetId && targetId !== id && targetId !== dropTargetRef.current) {
      dropTargetRef.current = targetId;
      setDropTargetId(targetId);
    }
  };
  const endPointerDrag = (event: ReactPointerEvent<HTMLElement>, id: string) => {
    if (dragPositionRef.current?.id !== id) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
    finishPlateDrag();
  };

  return (
    <main id="main-content" className="account-page account-app" tabIndex={-1}>
      {debtAlert && (
        <aside
          className={`account-debt-alert account-debt-alert--${debtAlert.level}`}
          role="alert"
          tabIndex={0}
          aria-label="Уведомление о задолженности. Нажмите, чтобы посмотреть следующий уровень критичности"
          onClick={advanceDebtAlert}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              advanceDebtAlert();
            }
          }}
        >
          <span className="account-debt-alert__icon" aria-hidden="true">
            <WarningIcon />
          </span>
          <div>
            <strong>{debtAlert.title}</strong>
            <p>
              По номеру M 777 MM — <b>1 856 ₽</b>.
              <span className="account-debt-alert__detail">
                {debtAlert.timing} <b>{debtAlert.days} дн.</b> {debtAlert.detail}
              </span>
            </p>
          </div>
          <button
            className="account-compact-action account-compact-action--primary"
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setToast("Переходим к оплате задолженности");
            }}
          >
            Оплатить
          </button>
        </aside>
      )}
      {toast && (
        <div className="account-toast" role="status">
          <span aria-hidden="true">
            <NoticeIcon />
          </span>
          <p>{toast}</p>
          <button
            type="button"
            aria-label="Закрыть уведомление"
            data-hint="Закрыть"
            onClick={() => setToast("")}
          >
            <CloseIcon />
          </button>
        </div>
      )}
      <div className="account-prototype">
        <div className="account-sidebar-slot">
          <aside className="account-sidebar" aria-label="Разделы личного кабинета">
            <div className="account-profile">
              <strong>Алексей Смирнов</strong>
              <span>Лицевой счёт № 4230 7812</span>
            </div>
            <a className="account-home" href="/account" aria-current="page">
              Главная
            </a>
            <nav>
              <ul>
                {navigation.map((item) => (
                  <li key={item}>
                    <a href="#account-content">{item}</a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </div>
        <section
          className="account-workspace"
          id="account-content"
          aria-label="Личный кабинет"
        >
          <div
            className={`account-columns ${newsBelowBalance ? "account-columns--news-below" : ""}`}
          >
            <div className="account-primary">
              <section
                className={`account-important-news ${newsDragging ? "account-important-news--dragging" : ""}`}
                draggable
                onDragStart={(event) => {
                  event.dataTransfer.effectAllowed = "move";
                  event.dataTransfer.setData("text/plain", "account-news");
                  setNewsDragging(true);
                }}
                onDragEnd={() => setNewsDragging(false)}
                aria-label="Важные изменения условий"
              >
                <span className="account-important-news__icon" aria-hidden="true">
                  <NoticeIcon />
                </span>
                <div>
                  <h2>Важные изменения условий</h2>
                  <p>
                    Проверьте обновлённые условия программы лояльности и абонементов
                    перед следующей поездкой.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setToast("Полные условия будут доступны в следующем шаге")
                  }
                >
                  Подробнее
                </button>
              </section>
              <section
                className={`account-panel account-balance ${alternativeBalance ? "account-balance--negative" : ""}`}
                aria-labelledby="balance-title"
              >
                <div
                  className="account-balance-card"
                  onDragOver={(event) => {
                    if (newsDragging) event.preventDefault();
                  }}
                  onDrop={(event) => {
                    if (!newsDragging) return;
                    event.preventDefault();
                    setNewsBelowBalance(true);
                    setNewsDragging(false);
                  }}
                >
                  <div className="account-panel__heading">
                    <h1 id="balance-title">Лицевой счёт</h1>
                    <span>Сегодня, 18:03</span>
                  </div>
                  <div className="account-balance__summary">
                    <div className="account-balance__available">
                      <p>Доступно для оплаты</p>
                      <strong>
                        {alternativeBalance ? "−1 856,00 ₽" : "1 453,00 ₽"}
                      </strong>
                    </div>
                  </div>
                  <button
                    className="account-button"
                    type="button"
                    onClick={() =>
                      setToast("Пополнение счёта будет доступно в следующем шаге")
                    }
                  >
                    Пополнить счёт
                  </button>
                  {newsDragging && !newsBelowBalance && (
                    <div className="account-news-drop-target" aria-hidden="true">
                      Переместить под лицевой счёт
                    </div>
                  )}
                </div>
                <div
                  className={`account-loyalty-card ${alternativeBalance ? "account-loyalty-card--unavailable" : ""}`}
                >
                  <div className="bonus-badge">
                    <span>Бонусные баллы</span>
                    <strong>{alternativeBalance ? "146" : "8 400"}</strong>
                  </div>
                  <div
                    className={`account-celebration ${alternativeBalance ? "account-celebration--unavailable" : ""}`}
                  >
                    <div
                      className="discount-message"
                      onMouseLeave={() => setDiscountInfoOpen(false)}
                    >
                      <div className="interoperability__title-row discount-message__title">
                        <strong>
                          {alternativeBalance
                            ? "Скидка пока недоступна"
                            : "Вам доступна скидка 5%!"}
                        </strong>
                        <span className="discount-info-anchor">
                          <button
                            className="info-button"
                            type="button"
                            onMouseEnter={() => setDiscountInfoOpen(true)}
                            onFocus={() => setDiscountInfoOpen(true)}
                            onBlur={() => setDiscountInfoOpen(false)}
                            onClick={() => setDiscountInfoOpen((isOpen) => !isOpen)}
                            aria-label="Стоимость скидок в баллах"
                            aria-expanded={discountInfoOpen}
                            aria-controls="discount-costs"
                          >
                            <InfoIcon />
                          </button>
                          {discountInfoOpen && (
                            <div
                              id="discount-costs"
                              className="discount-costs-tooltip"
                              role="tooltip"
                            >
                              <strong>Стоимость скидок в баллах</strong>
                              <ul>
                                <li>
                                  <span>3%</span>
                                  <b>500 баллов</b>
                                </li>
                                <li>
                                  <span>5%</span>
                                  <b>1 000 баллов</b>
                                </li>
                                <li>
                                  <span>7%</span>
                                  <b>2 000 баллов</b>
                                </li>
                                <li>
                                  <span>10%</span>
                                  <b>4 000 баллов</b>
                                </li>
                                <li>
                                  <span>15%</span>
                                  <b>6 000 баллов</b>
                                </li>
                              </ul>
                            </div>
                          )}
                        </span>
                      </div>
                      <p>
                        {alternativeBalance ? (
                          "Для покупки скидки нужно накопить еще 1 074 балла"
                        ) : (
                          <>Активируйте её перед следующей поездкой.</>
                        )}
                        <span
                          className="loyalty-progress-track"
                          role="progressbar"
                          aria-label="Прогресс до следующей скидки"
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-valuenow={alternativeBalance ? 12 : 50}
                        >
                          <span style={{ width: alternativeBalance ? "12%" : "50%" }} />
                        </span>
                        {!alternativeBalance && (
                          <span className="discount-progress">
                            Осталось 1 000 бонусов до скидки 7%.
                          </span>
                        )}
                      </p>
                    </div>
                    <button
                      className="loyalty-link-button"
                      type="button"
                      onClick={() =>
                        setToast("Условия скидки доступны в разделе «Финансы»")
                      }
                    >
                      <span>Перейти</span>
                      <OpenServiceArrowIcon />
                    </button>
                  </div>
                </div>
              </section>
            </div>
            <div className="account-secondary">
              <section className="plates-panel" aria-labelledby="plates-title">
                <div className="section-heading">
                  <div>
                    <h2 id="plates-title">Ваши транспортные средства</h2>
                    <span>
                      {alternativeBalance ? 0 : plates.length} из {MAX_PLATES}
                    </span>
                  </div>
                  <div className="plates-heading-actions">
                    {!alternativeBalance &&
                      plates.some((plate) => plate.debt !== "Нет задолженности") && (
                        <button
                          className="account-compact-action account-compact-action--primary plates-pay-all-button"
                          type="button"
                          onClick={() =>
                            setToast("Переходим к оплате всех задолженностей")
                          }
                        >
                          Оплатить всё
                        </button>
                      )}
                    <button
                      className="account-add-button"
                      type="button"
                      onClick={requestAdd}
                      aria-label="Добавить госномер"
                      data-hint="Добавить госномер"
                      title="Добавить госномер"
                    >
                      <PlusIcon />
                    </button>
                  </div>
                </div>
                <div
                  className="account-data-table__header account-data-table__header--vehicles"
                  role="row"
                >
                  <span>Наименование транспортного средства</span>
                  <span>Государственный номер</span>
                  <span>Сумма / статус</span>
                  <span>Действия</span>
                </div>
                <div className="plates-list">
                  {alternativeBalance ? (
                    <EmptyPlatesState />
                  ) : (
                    plates.map((plate) => {
                      const hasDebt = plate.debt !== "Нет задолженности";
                      const isDragging = draggingPlateId === plate.id;
                      const sourceIndex = plates.findIndex(
                        (item) => item.id === draggingPlateId,
                      );
                      const targetIndex = plates.findIndex(
                        (item) => item.id === dropTargetId,
                      );
                      const placeholderStyle = dragPosition
                        ? { height: `${dragPosition.height}px` }
                        : undefined;
                      const before =
                        dropTargetId === plate.id && sourceIndex > targetIndex;
                      const after =
                        dropTargetId === plate.id && sourceIndex < targetIndex;
                      return (
                        <Fragment key={plate.id}>
                          {before && (
                            <div
                              className="plate-drop-placeholder"
                              style={placeholderStyle}
                              aria-hidden="true"
                            />
                          )}
                          {isDragging && !dropTargetId && (
                            <div
                              className="plate-drop-placeholder"
                              style={placeholderStyle}
                              aria-hidden="true"
                            />
                          )}
                          <article
                            className={`plate-row ${hasDebt ? "plate-row--debt" : "plate-row--clear"} ${isDragging ? "plate-row--dragging" : ""} ${recentlyMovedId === plate.id ? "plate-row--moved" : ""}`}
                            data-plate-id={plate.id}
                            style={
                              isDragging && dragPosition
                                ? {
                                    left: `${dragPosition.left}px`,
                                    top: `${dragPosition.top}px`,
                                    width: `${dragPosition.width}px`,
                                    height: `${dragPosition.height}px`,
                                  }
                                : undefined
                            }
                            onPointerDown={(event) => startPointerDrag(event, plate.id)}
                            onPointerMove={(event) => movePointerDrag(event, plate.id)}
                            onPointerUp={(event) => endPointerDrag(event, plate.id)}
                            onPointerCancel={finishPlateDrag}
                          >
                            <div className="plate-title">
                              <span>{plate.label}</span>
                            </div>
                            <div className="plate-number-line">
                              <div className="license-plate">
                                <strong>{plate.number}</strong>
                                <span>
                                  {plate.region}
                                  <small>RUS</small>
                                </span>
                              </div>
                            </div>
                            <div className="plate-status-row">
                              <div className="plate-status-payment">
                                <div>
                                  <p className="plate-status">
                                    {hasDebt
                                      ? `Задолженность — ${plate.debt}`
                                      : "Нет задолженности"}
                                  </p>
                                  {hasDebt && plate.paymentNote && (
                                    <span className="plate-payment-note">
                                      {plate.paymentNote}
                                    </span>
                                  )}
                                </div>
                                {hasDebt && (
                                  <button
                                    className="plate-pay-button account-compact-action account-compact-action--primary"
                                    type="button"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      setToast(
                                        `Переходим к оплате задолженности ${plate.debt}`,
                                      );
                                    }}
                                  >
                                    Оплатить
                                  </button>
                                )}
                              </div>
                            </div>
                            <div className="plate-table-actions">
                              <Link
                                className="plate-debt-details plate-debt-details--table"
                                href="/account?section=details"
                                onClick={(event) => event.stopPropagation()}
                              >
                                Подробнее
                              </Link>
                              <button
                                className="plate-icon-button plate-edit"
                                type="button"
                                onClick={() => requestEdit(plate)}
                                aria-label={`Редактировать номер ${plate.number}`}
                                data-hint="Изменить"
                              >
                                <EditIcon />
                              </button>
                              <button
                                className="plate-icon-button plate-details"
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setToast(
                                    `Открываем детализацию по номеру ${plate.number}`,
                                  );
                                }}
                                aria-label={`Детализация по номеру ${plate.number}`}
                                data-hint="Детализация"
                              >
                                <DetailsIcon />
                              </button>
                            </div>
                          </article>
                          {after && (
                            <div
                              className="plate-drop-placeholder"
                              style={placeholderStyle}
                              aria-hidden="true"
                            />
                          )}
                        </Fragment>
                      );
                    })
                  )}
                </div>
              </section>
              <section
                className="transponders-panel"
                aria-labelledby="transponders-title"
              >
                <div className="section-heading">
                  <div>
                    <h2 id="transponders-title">Транспондеры</h2>
                    <span>2 активных</span>
                  </div>
                  <button
                    className="account-add-button transponder-add-button"
                    type="button"
                    onClick={() =>
                      setToast(
                        "Добавление транспондера будет доступно в следующем шаге",
                      )
                    }
                    aria-label="Добавить транспондер"
                    data-hint="Добавить транспондер"
                    title="Добавить транспондер"
                  >
                    <PlusIcon />
                  </button>
                </div>
                <div className="transponders-notice">
                  <span aria-hidden="true">
                    <NoticeIcon />
                  </span>
                  <p>
                    Перемещайте неперсонифицированный транспондер между лицевыми счетами
                    в пару кликов.
                  </p>
                </div>
                <div
                  className="account-data-table__header account-data-table__header--transponders"
                  role="row"
                >
                  <span>Наименование и номер</span>
                  <span>Скидка</span>
                  <span>Период действия</span>
                  <span>Абонемент</span>
                  <span className="table-interop-heading">
                    Интероперабельность{" "}
                    <button
                      className="info-button table-interop-info-button"
                      type="button"
                      onMouseEnter={() => setInfoOpen(true)}
                      onMouseLeave={() => setInfoOpen(false)}
                      onFocus={() => setInfoOpen(true)}
                      onBlur={() => setInfoOpen(false)}
                      onClick={() => setInfoOpen(true)}
                      aria-label="Подробнее об интероперабельности"
                      aria-expanded={infoOpen}
                      aria-controls="interoperability-info"
                    >
                      <InfoIcon />
                    </button>
                    {infoOpen && (
                      <span
                        id="interoperability-info"
                        className="interoperability__tooltip"
                        role="tooltip"
                      >
                        <Image
                          src="/media/account/interoperability-diagram.png"
                          alt=""
                          width={320}
                          height={180}
                        />
                        <span>
                          Интероперабельность транспондера «Автодора» — бесплатная
                          услуга: одним T-pass можно оплачивать проезд по платным
                          дорогам разных операторов.
                        </span>
                      </span>
                    )}
                  </span>
                  <span>Действия</span>
                </div>
                <div className="transponder-list" role="table">
                  {transponders.map((item) => (
                    <article className="transponder-card" role="row" key={item.id}>
                      <div className="transponder-card__identity" role="cell">
                        <span className="transponder-token" aria-hidden="true">
                          <TransponderIcon />
                        </span>
                        <div>
                          <strong>{item.title}</strong>
                          <p>{item.number}</p>
                        </div>
                      </div>
                      <p
                        className="transponder-cell transponder-cell--discount"
                        role="cell"
                      >
                        {item.discount}
                      </p>
                      <p
                        className="transponder-cell transponder-cell--period"
                        role="cell"
                      >
                        {item.discountPeriod ? (
                          <>
                            <span>{item.discountPeriod}</span>
                            <strong>до {item.discountEndsAt}</strong>
                          </>
                        ) : (
                          "—"
                        )}
                      </p>
                      <p
                        className="transponder-cell transponder-cell--subscription subscription-status"
                        role="cell"
                      >
                        {item.subscription === "Подобрать" ? (
                          <button
                            className="account-compact-action account-compact-action--secondary"
                            type="button"
                            onClick={() =>
                              setToast(
                                "Подбор абонемента будет доступен в следующем шаге",
                              )
                            }
                          >
                            Подобрать
                          </button>
                        ) : (
                          <>
                            <span>{item.subscription}</span>
                            {item.subscriptionEndsAt && (
                              <strong>до {item.subscriptionEndsAt}</strong>
                            )}
                          </>
                        )}
                      </p>
                      <div className="transponder-interop-cell" role="cell">
                        <span
                          className={
                            interoperable
                              ? "check-mark"
                              : "interoperability-state interoperability-state--off"
                          }
                          aria-hidden="true"
                        >
                          {interoperable ? <CheckIcon /> : <WarningIcon />}
                        </span>
                        <span>{interoperable ? "Подключена" : "Отключена"}</span>
                        <button
                          className={`switch ${interoperable ? "switch--on" : ""}`}
                          type="button"
                          role="switch"
                          aria-label={`Интероперабельность: ${item.title}`}
                          data-hint={
                            interoperable
                              ? "Отключить интероперабельность"
                              : "Включить интероперабельность"
                          }
                          aria-checked={interoperable}
                          onClick={() =>
                            interoperable
                              ? setConfirmOpen(true)
                              : (setInteroperable(true),
                                setToast("Интероперабельность подключена"))
                          }
                        >
                          <span />
                        </button>
                      </div>
                      <div className="transponder-card__actions" role="cell">
                        <button
                          type="button"
                          aria-label={`Редактировать ${item.title}`}
                          data-hint="Изменить"
                          onClick={() =>
                            setToast(
                              `Редактирование «${item.title}» будет доступно в следующем шаге`,
                            )
                          }
                        >
                          <EditIcon />
                        </button>
                        <button
                          type="button"
                          aria-label={`Переместить ${item.title}`}
                          data-hint="Переместить"
                          onClick={() =>
                            setToast(
                              "Выберите лицевой счёт для перемещения транспондера",
                            )
                          }
                        >
                          <MoveIcon />
                        </button>
                        <button
                          type="button"
                          aria-label={`Детализация ${item.title}`}
                          data-hint="Детализация"
                          onClick={() =>
                            setToast(
                              `Детализация «${item.title}» будет доступна в следующем шаге`,
                            )
                          }
                        >
                          <DetailsIcon />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </section>
      </div>
      <footer className="account-footer" aria-label="Полезные сервисы личного кабинета">
        <div className="account-footer__frame">
          <a className="account-footer__help" href="tel:*2323">
            <strong>*2323</strong>
            <span>Круглосуточная помощь</span>
          </a>
          <a
            className="account-footer__application"
            href="https://tpass.me/"
            target="_blank"
            rel="noreferrer"
          >
            <span>
              <DownloadIcon />
              Скачать
            </span>
            <p>
              Мобильное приложение <b>Автодор</b>
            </p>
          </a>
          <div className="account-footer__actions">
            <a href="https://tpass.me/" target="_blank" rel="noreferrer">
              Интернет-магазин
            </a>
          </div>
        </div>
      </footer>
      {addOpen && (
        <div
          className="account-dialog-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setAddOpen(false);
          }}
        >
          <section
            className="account-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-title"
          >
            <header className="account-dialog__header">
              <h2 id="add-title">
                {editingPlate ? "Редактировать госномер" : "Добавить госномер"}
              </h2>
              <button
                className="dialog-close"
                type="button"
                aria-label="Закрыть"
                data-hint="Закрыть"
                onClick={() => setAddOpen(false)}
              >
                <CloseIcon />
              </button>
            </header>
            <div className="account-dialog__body">
              <p>
                Сейчас добавлено {plates.length} из {MAX_PLATES} номеров.
              </p>
              <form onSubmit={addPlate}>
                <label>
                  Госномер
                  <input
                    value={number}
                    onChange={(event) =>
                      setNumber(
                        event.target.value
                          .toUpperCase()
                          .replace(/[^A-ZА-Я0-9\s]/gu, "")
                          .slice(0, 9),
                      )
                    }
                    placeholder="А 123 АА"
                    required
                    disabled={Boolean(editingPlate)}
                  />
                </label>
                <label>
                  Регион
                  <input
                    value={region}
                    onChange={(event) =>
                      setRegion(event.target.value.replace(/\D/gu, "").slice(0, 3))
                    }
                    inputMode="numeric"
                    placeholder="77"
                    required
                    disabled={Boolean(editingPlate)}
                  />
                </label>
                <label>
                  Подпись
                  <input
                    value={label}
                    onChange={(event) => setLabel(event.target.value.slice(0, 42))}
                    placeholder="Например, семейный автомобиль"
                  />
                </label>
                {formError && (
                  <p className="form-error" role="alert">
                    {formError}
                  </p>
                )}
                <div className="dialog-actions">
                  <button type="button" onClick={() => setAddOpen(false)}>
                    Отмена
                  </button>
                  <button type="submit">
                    {editingPlate ? "Сохранить" : "Добавить"}
                  </button>
                </div>
              </form>
            </div>
          </section>
        </div>
      )}
      {confirmOpen && (
        <div
          className="account-dialog-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setConfirmOpen(false);
          }}
        >
          <section
            className="account-dialog account-dialog--confirm"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="disable-title"
          >
            <header className="account-dialog__header">
              <h2 id="disable-title">Отключить интероперабельность?</h2>
              <button
                className="dialog-close"
                type="button"
                aria-label="Закрыть"
                data-hint="Закрыть"
                onClick={() => setConfirmOpen(false)}
              >
                <CloseIcon />
              </button>
            </header>
            <div className="account-dialog__body">
              <p>
                Транспондером T-pass нельзя будет оплачивать проезд по трассам
                подключённых операторов. Услугу можно включить снова в любой момент.
              </p>
              <div className="dialog-actions">
                <button type="button" onClick={() => setConfirmOpen(false)}>
                  Отмена
                </button>
                <button
                  className="dialog-danger"
                  type="button"
                  onClick={() => {
                    setInteroperable(false);
                    setConfirmOpen(false);
                    setToast("Интероперабельность отключена");
                  }}
                >
                  Отключить
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
      {removingPlate && (
        <div
          className="account-dialog-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setRemovingPlate(null);
          }}
        >
          <section
            className="account-dialog account-dialog--confirm"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="remove-title"
          >
            <header className="account-dialog__header">
              <h2 id="remove-title">Удалить госномер?</h2>
              <button
                className="dialog-close"
                type="button"
                aria-label="Закрыть"
                data-hint="Закрыть"
                onClick={() => setRemovingPlate(null)}
              >
                <CloseIcon />
              </button>
            </header>
            <div className="account-dialog__body">
              <p>
                Номер {removingPlate.number} будет удалён из личного кабинета. Это
                действие нельзя отменить.
              </p>
              <div className="dialog-actions">
                <button type="button" onClick={() => setRemovingPlate(null)}>
                  Отмена
                </button>
                <button
                  className="dialog-danger"
                  type="button"
                  onClick={() => removePlate(removingPlate)}
                >
                  Удалить
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
