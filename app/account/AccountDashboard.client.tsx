"use client";

import { FormEvent, Fragment, PointerEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";

type Plate = { id: string; number: string; region: string; label: string; debt: string };
type DragPosition = { id: string; left: number; top: number; width: number; height: number; offsetX: number; offsetY: number };

function CloseIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>;
}

function NoticeIcon() { return <svg className="account-svg-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" /><path d="M12 10v5m0-8v.01" /></svg>; }
function WarningIcon() { return <svg className="account-svg-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 6v8m0 4v.01" /></svg>; }
function SparkleIcon() { return <svg className="account-svg-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z" /></svg>; }
function CheckIcon() { return <svg className="account-svg-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m7 12 3.2 3.2L17 8.5" /></svg>; }
function InfoIcon() { return <svg className="account-svg-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" /><path d="M12 11v5m0-8v.01" /></svg>; }
function TransponderIcon() {
  return <svg className="account-svg-icon transponder-device-icon" viewBox="90 45 220 260" aria-hidden="true">
    <rect x="127.90963" y="63.229168" width="163.55885" height="230.33963" ry="13.599422" transform="matrix(1,0,-0.19444649,0.98091313,0,0)" style={{ fill: "#ffffff", stroke: "#fe613b", strokeWidth: 19.224823, strokeLinecap: "round", strokeLinejoin: "round", strokeMiterlimit: 4 }} />
    <path d="m 130.91121,117.88325 -6.49849,27.71806 119.93221,-11.59709 6.23629,-27.04327 z" style={{ fill: "#fe613b" }} />
    <path d="m 143.6079,239.97756 21.59457,-93.57645 h 39.41522 l -22.21956,95.97585 -16.39587,-13.59659 z" style={{ fill: "#fe613b" }} />
    <path d="m 132.211,287.97768 3.499,-15.22107 -25.29375,-0.3872 51.98692,-30.39236 37.59053,31.19216 -25.99347,-1.1997 -3.86741,15.98183 z" style={{ fill: "#fe613b" }} />
    <path d="m 160.51324,240.97297 -1.94455,9.28078 4.41942,0 1.98874,-9.28077 z" style={{ fill: "#fefffc" }} />
    <path d="m 157.08819,257.94353 -1.94455,9.28078 h 4.41942 l 1.98874,-9.28077 z" style={{ fill: "#fefffc" }} />
    <path d="m 153.81782,274.42797 -1.94455,9.28078 h 4.41942 l 1.98874,-9.28077 z" style={{ fill: "#fefffc" }} />
  </svg>;
}

const MAX_PLATES = 5;
const navigation = ["Поездки", "Финансы", "Абонементы", "Транспондеры", "Госномера", "Дополнительные услуги", "Выписка"];
const initialPlates: Plate[] = [
  { id: "a001", number: "A 001 AA", region: "77", label: "Семейный автомобиль", debt: "Нет задолженности" },
  { id: "m777", number: "M 777 MM", region: "197", label: "Рабочий автомобиль", debt: "1 856 ₽" },
];
const transponders = [
  { id: "4725", title: "Основной транспондер", number: "3041655 0000 4725 2066", discount: "Скидка 15% на проезд по T-PASS", subscription: "Осталось 5 поездок до 31.08.2026" },
  { id: "4726", title: "Запасной транспондер", number: "3041655 0000 4725 2084", discount: "Скидка активируется при подключении тарифа" },
];

export function AccountDashboard() {
  const [plates, setPlates] = useState(initialPlates);
  const [toast, setToast] = useState("По номеру M 777 MM обнаружена задолженность 1 856 ₽");
  const [noticeVisible, setNoticeVisible] = useState(true);
  const [alternativeBalance, setAlternativeBalance] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editingPlate, setEditingPlate] = useState<Plate | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
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
  const dragPositionRef = useRef<DragPosition | null>(null);
  const dropTargetRef = useRef<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(""), 7500);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    const toggleAlternativeBalance = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (event.code !== "KeyS" || event.metaKey || event.ctrlKey || event.altKey || target?.closest("input, textarea, select, [contenteditable='true']")) return;
      event.preventDefault();
      setAlternativeBalance((current) => !current);
    };
    window.addEventListener("keydown", toggleAlternativeBalance);
    return () => window.removeEventListener("keydown", toggleAlternativeBalance);
  }, []);

  const addPlate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedNumber = number.trim().replace(/\s+/g, " ");
    if (!/^[A-ZА-Я]\s?\d{3}\s?[A-ZА-Я]{2}$/u.test(normalizedNumber) || region.length < 2) {
      setFormError("Введите номер в формате А 123 АА и регион из 2–3 цифр.");
      return;
    }
    if (editingPlate) {
      setPlates((items) => items.map((item) => item.id === editingPlate.id ? { ...item, number: normalizedNumber, region, label: label.trim() || "Без подписи" } : item));
      setToast(`Данные номера ${normalizedNumber} обновлены`);
    } else {
      setPlates((items) => [...items, { id: `${normalizedNumber}-${region}-${Date.now()}`, number: normalizedNumber, region, label: label.trim() || "Без подписи", debt: "Нет задолженности" }]);
      setToast("Госномер добавлен");
    }
    setNumber(""); setRegion(""); setLabel(""); setFormError(""); setEditingPlate(null); setAddOpen(false);
  };
  const requestAdd = () => {
    if (plates.length >= MAX_PLATES) setToast(`Можно добавить не более ${MAX_PLATES} госномеров`);
    else { setEditingPlate(null); setNumber(""); setRegion(""); setLabel(""); setFormError(""); setAddOpen(true); }
  };
  const requestEdit = (plate: Plate) => {
    setEditingPlate(plate); setNumber(plate.number); setRegion(plate.region); setLabel(plate.label); setFormError(""); setAddOpen(true);
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
  const startPointerDrag = (event: PointerEvent<HTMLElement>, id: string) => {
    if ((event.target as HTMLElement).closest("button")) return;
    event.preventDefault();
    const source = event.currentTarget;
    const rect = source.getBoundingClientRect();
    const position = { id, left: rect.left, top: rect.top, width: rect.width, height: rect.height, offsetX: event.clientX - rect.left, offsetY: event.clientY - rect.top };
    source.setPointerCapture(event.pointerId);
    dragPositionRef.current = position;
    dropTargetRef.current = null;
    setDraggingPlateId(id);
    setDropTargetId(null);
    setDragPosition(position);
  };
  const movePointerDrag = (event: PointerEvent<HTMLElement>, id: string) => {
    const current = dragPositionRef.current;
    if (!current || current.id !== id) return;
    const next = { ...current, left: event.clientX - current.offsetX, top: event.clientY - current.offsetY };
    dragPositionRef.current = next;
    setDragPosition(next);
    const targetId = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>("[data-plate-id]")?.dataset.plateId;
    if (targetId && targetId !== id && targetId !== dropTargetRef.current) {
      dropTargetRef.current = targetId;
      setDropTargetId(targetId);
    }
  };
  const endPointerDrag = (event: PointerEvent<HTMLElement>, id: string) => {
    if (dragPositionRef.current?.id !== id) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    finishPlateDrag();
  };

  return <main id="main-content" className="account-page account-app" tabIndex={-1}>
    {toast && <div className="account-toast" role="status"><span aria-hidden="true"><WarningIcon /></span><p>{toast}</p><button type="button" aria-label="Закрыть уведомление" onClick={() => setToast("")}><CloseIcon /></button></div>}
    <div className="account-prototype">
      <div className="account-sidebar-slot">
      <aside className="account-sidebar" aria-label="Разделы личного кабинета">
        <div className="account-profile"><strong>Алексей Смирнов</strong><span>Лицевой счёт № 4230 7812</span></div>
        <a className="account-home" href="/account" aria-current="page">Главная</a>
        <nav><ul>{navigation.map((item) => <li key={item}><a href="#account-content">{item}</a></li>)}</ul></nav>
      </aside>
      </div>
      <section className="account-workspace" id="account-content" aria-label="Личный кабинет">
        {noticeVisible && <div className="account-notice"><span aria-hidden="true"><NoticeIcon /></span><p>Перемещайте неперсонифицированный транспондер между лицевыми счетами в пару кликов.</p><button className="account-notice__close" type="button" aria-label="Закрыть информационное сообщение" onClick={() => setNoticeVisible(false)}><CloseIcon /></button></div>}
        <div className="account-columns">
          <div className="account-primary">
            <section className={`account-panel account-balance ${alternativeBalance ? "account-balance--negative" : ""}`} aria-labelledby="balance-title">
              <div className="account-panel__heading"><h1 id="balance-title">Лицевой счёт</h1><span>Сегодня, 18:03</span></div>
              <div className="account-balance__summary"><div className="account-balance__available"><p>Доступно для оплаты</p><strong>{alternativeBalance ? "−1 856,00 ₽" : "1 453,00 ₽"}</strong></div><div className="bonus-badge"><span>Бонусные баллы</span><strong>{alternativeBalance ? "146" : "8 400"}</strong></div></div>
              <div className={`account-celebration ${alternativeBalance ? "account-celebration--unavailable" : ""}`}><span aria-hidden="true">{alternativeBalance ? <InfoIcon /> : <SparkleIcon />}</span><div><strong>{alternativeBalance ? "Скидка пока недоступна" : "Вам доступна скидка 5%!"}</strong><p>{alternativeBalance ? "Для покупки скидки нужно накопить еще 1 074 балла" : "Активируйте её перед следующей поездкой."}</p></div><button type="button" onClick={() => setToast("Условия скидки доступны в разделе «Финансы»")}>Перейти</button></div>
              <button className="account-button" type="button" onClick={() => setToast("Пополнение счёта будет доступно в следующем шаге")}>Пополнить счёт</button>
            </section>
            <section className="account-panel account-hint"><div><h2>Абонементы</h2><p>Подключайте абонементы для транспондеров — остаток поездок показывается рядом с устройством.</p></div><button type="button" onClick={() => setToast("Подбор абонемента будет доступен в следующем шаге")}>Подобрать</button></section>
          </div>
          <div className="account-secondary">
            <section className="plates-panel" aria-labelledby="plates-title">
              <div className="section-heading"><div><h2 id="plates-title">Ваши госномера</h2><span>{plates.length} из {MAX_PLATES}</span></div><button className="account-add-button" type="button" onClick={requestAdd} aria-label="Добавить госномер" title="Добавить госномер"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v16M4 12h16" /></svg></button></div>
              {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
              <div className="plates-list">{plates.map((plate, index) => { const hasDebt = plate.debt !== "Нет задолженности"; const isDragging = draggingPlateId === plate.id; const sourceIndex = plates.findIndex((item) => item.id === draggingPlateId); const targetIndex = plates.findIndex((item) => item.id === dropTargetId); const placeholderStyle = dragPosition ? { height: `${dragPosition.height}px` } : undefined; const before = dropTargetId === plate.id && sourceIndex > targetIndex; const after = dropTargetId === plate.id && sourceIndex < targetIndex; return <Fragment key={plate.id}>{before && <div className="plate-drop-placeholder" style={placeholderStyle} aria-hidden="true" />} {isDragging && !dropTargetId && <div className="plate-drop-placeholder" style={placeholderStyle} aria-hidden="true" />}<article className={`plate-row ${hasDebt ? "plate-row--debt" : "plate-row--clear"} ${isDragging ? "plate-row--dragging" : ""} ${recentlyMovedId === plate.id ? "plate-row--moved" : ""}`} data-plate-id={plate.id} style={isDragging && dragPosition ? { left: `${dragPosition.left}px`, top: `${dragPosition.top}px`, width: `${dragPosition.width}px`, height: `${dragPosition.height}px` } : undefined} onPointerDown={(event) => startPointerDrag(event, plate.id)} onPointerMove={(event) => movePointerDrag(event, plate.id)} onPointerUp={(event) => endPointerDrag(event, plate.id)} onPointerCancel={finishPlateDrag}><div className="plate-title"><span>{plate.label}</span></div><button className="plate-icon-button plate-edit" type="button" onClick={() => requestEdit(plate)} aria-label={`Редактировать номер ${plate.number}`} title="Изменить"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14.7 4.7 4.6 4.6M4 20l4.2-1 10.7-10.7a1.6 1.6 0 0 0 0-2.2l-1-1a1.6 1.6 0 0 0-2.2 0L5 15.8 4 20Z" /></svg></button><div className="plate-number-line"><div className="license-plate"><strong>{plate.number}</strong><span>{plate.region}<small>RUS</small></span></div></div><button className="plate-icon-button plate-remove" type="button" onClick={() => setRemovingPlate(plate)} aria-label={`Удалить номер ${plate.number}`} title="Удалить"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3m-9 0 1 13h10l1-13M10 11v5m4-5v5" /></svg></button><p className="plate-status">{hasDebt ? `Задолженность — ${plate.debt}` : "Нет задолженности"}</p></article>{after && <div className="plate-drop-placeholder" style={placeholderStyle} aria-hidden="true" />}</Fragment>; })}</div>
            </section>
            <section className="transponders-panel" aria-labelledby="transponders-title">
              <div className="section-heading"><div><h2 id="transponders-title">Транспондеры</h2><span>2 активных</span></div></div>
              <div className="transponder-list">{transponders.map((item) => <article className="transponder-card" key={item.id}><div className="transponder-card__top"><span className="transponder-token" aria-hidden="true"><TransponderIcon /></span><div><strong>{item.title}</strong><p>{item.number}</p></div><span className="check-mark" aria-label="Подключено"><CheckIcon /></span></div><div className="transponder-card__benefits"><p><span>Скидка</span>{item.discount}</p>{item.subscription && <p className="subscription-status"><span>Абонемент</span>{item.subscription}</p>}</div></article>)}</div>
              <div className="interoperability" onMouseLeave={() => setInfoOpen(false)}><div><span className="interoperability-icon-slot" aria-hidden="true">{interoperable ? <span className="check-mark interoperability-state--on"><CheckIcon /></span> : <span className="interoperability-state interoperability-state--off"><WarningIcon /></span>}</span><div><div className="interoperability__title-row"><strong>Интероперабельность</strong><button className="info-button" type="button" onMouseEnter={() => setInfoOpen(true)} onFocus={() => setInfoOpen(true)} onBlur={() => setInfoOpen(false)} onClick={() => setInfoOpen((isOpen) => !isOpen)} aria-label="Подробнее об интероперабельности" aria-expanded={infoOpen} aria-controls="interoperability-info"><InfoIcon /></button></div><p>{interoperable ? "Подключена" : "Отключена"}</p></div></div><div className="interoperability__actions"><button className={`switch ${interoperable ? "switch--on" : ""}`} type="button" role="switch" aria-label="Интероперабельность" aria-checked={interoperable} onClick={() => interoperable ? setConfirmOpen(true) : (setInteroperable(true), setToast("Интероперабельность подключена"))}><span /></button></div>{infoOpen && <div id="interoperability-info" className="interoperability__tooltip" role="tooltip"><Image src="/media/account/interoperability-diagram.png" alt="" width={320} height={180} /><p>Интероперабельность транспондера «Автодора» — это бесплатная услуга, которая позволяет одним транспондером T-pass оплачивать проезд по платным дорогам разных операторов. Проще говоря: один транспондер — для всех подключённых платных трасс, без покупки дополнительных устройств.</p></div>}</div>
            </section>
          </div>
        </div>
      </section>
    </div>
    {addOpen && <div className="account-dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setAddOpen(false); }}><section className="account-dialog" role="dialog" aria-modal="true" aria-labelledby="add-title"><header className="account-dialog__header"><h2 id="add-title">{editingPlate ? "Редактировать госномер" : "Добавить госномер"}</h2><button className="dialog-close" type="button" aria-label="Закрыть" onClick={() => setAddOpen(false)}><CloseIcon /></button></header><div className="account-dialog__body"><p>Сейчас добавлено {plates.length} из {MAX_PLATES} номеров.</p><form onSubmit={addPlate}><label>Госномер<input value={number} onChange={(event) => setNumber(event.target.value.toUpperCase().replace(/[^A-ZА-Я0-9\s]/gu, "").slice(0, 9))} placeholder="А 123 АА" required /></label><label>Регион<input value={region} onChange={(event) => setRegion(event.target.value.replace(/\D/gu, "").slice(0, 3))} inputMode="numeric" placeholder="77" required /></label><label>Подпись<input value={label} onChange={(event) => setLabel(event.target.value.slice(0, 42))} placeholder="Например, семейный автомобиль" /></label>{formError && <p className="form-error" role="alert">{formError}</p>}<div className="dialog-actions"><button type="button" onClick={() => setAddOpen(false)}>Отмена</button><button type="submit">{editingPlate ? "Сохранить" : "Добавить"}</button></div></form></div></section></div>}
    {confirmOpen && <div className="account-dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setConfirmOpen(false); }}><section className="account-dialog account-dialog--confirm" role="alertdialog" aria-modal="true" aria-labelledby="disable-title"><header className="account-dialog__header"><h2 id="disable-title">Отключить интероперабельность?</h2><button className="dialog-close" type="button" aria-label="Закрыть" onClick={() => setConfirmOpen(false)}><CloseIcon /></button></header><div className="account-dialog__body"><p>Транспондером T-pass нельзя будет оплачивать проезд по трассам подключённых операторов. Услугу можно включить снова в любой момент.</p><div className="dialog-actions"><button type="button" onClick={() => setConfirmOpen(false)}>Отмена</button><button className="dialog-danger" type="button" onClick={() => { setInteroperable(false); setConfirmOpen(false); setToast("Интероперабельность отключена"); }}>Отключить</button></div></div></section></div>}
    {removingPlate && <div className="account-dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setRemovingPlate(null); }}><section className="account-dialog account-dialog--confirm" role="alertdialog" aria-modal="true" aria-labelledby="remove-title"><header className="account-dialog__header"><h2 id="remove-title">Удалить госномер?</h2><button className="dialog-close" type="button" aria-label="Закрыть" onClick={() => setRemovingPlate(null)}><CloseIcon /></button></header><div className="account-dialog__body"><p>Номер {removingPlate.number} будет удалён из личного кабинета. Это действие нельзя отменить.</p><div className="dialog-actions"><button type="button" onClick={() => setRemovingPlate(null)}>Отмена</button><button className="dialog-danger" type="button" onClick={() => removePlate(removingPlate)}>Удалить</button></div></div></section></div>}
  </main>;
}
