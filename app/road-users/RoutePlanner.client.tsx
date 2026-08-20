"use client";

import { useEffect, useRef, useState } from "react";

import styles from "./RoutePlanner.module.css";

type Place = { label: string; lat: number; lon: number };
type PoiKind = "fuel" | "rest" | "sight";
type Poi = { id: string; kind: PoiKind; name: string; description: string; image: string; lat: number; lon: number };
type RouteData = { distance: number; duration: number; coordinates: [number, number][] };
type Stop = { id: string; value: string };
type RouteField = "origin" | "destination" | `stop-${number}`;
type LeafletMarker = { bindTooltip: (html: string, options: unknown) => void };
type LeafletMap = { fitBounds: (bounds: unknown, options: unknown) => void; setZoom: (zoom: number) => void; getZoom: () => number; setView: (coordinates: [number, number], zoom: number) => void; remove: () => void; removeLayer: (marker: LeafletMarker) => void };
type LeafletApi = {
  map: (element: HTMLElement, options: unknown) => LeafletMap;
  tileLayer: (url: string, options: unknown) => { addTo: (map: LeafletMap) => void };
  polyline: (coordinates: [number, number][], options: unknown) => { addTo: (map: LeafletMap) => { getBounds: () => unknown } };
  markerClusterGroup: (options: unknown) => { addLayers: (markers: LeafletMarker[]) => { addTo: (map: LeafletMap) => void } };
  marker: (coordinates: [number, number], options: unknown) => LeafletMarker;
  divIcon: (options: unknown) => unknown;
};

const DEFAULT_PLACES: Record<string, Place> = {
  "Москва": { label: "Москва", lat: 55.7558, lon: 37.6173 },
  "Краснодар": { label: "Краснодар", lat: 45.0355, lon: 38.9753 },
  "Ростов-на-Дону": { label: "Ростов-на-Дону", lat: 47.2357, lon: 39.7015 },
  "Санкт-Петербург": { label: "Санкт-Петербург", lat: 59.9343, lon: 30.3351 },
  "Тула": { label: "Тула", lat: 54.1931, lon: 37.6173 },
  "Воронеж": { label: "Воронеж", lat: 51.6755, lon: 39.2089 },
  "Липецк": { label: "Липецк", lat: 52.6103, lon: 39.5947 },
};

const POI_DATA: Omit<Poi, "lat" | "lon">[] = [
  { id: "fuel", kind: "fuel", name: "АЗС на маршруте", description: "Круглосуточная заправка и магазин в пути.", image: "/media/route-planner/fuel-stop.png" },
  { id: "rest", kind: "rest", name: "Место отдыха", description: "Парковка, санитарная зона и место для короткой паузы.", image: "/media/route-planner/rest-stop.png" },
  { id: "sight", kind: "sight", name: "Точка по пути", description: "Место, где можно сделать остановку и посмотреть окрестности.", image: "/media/route-planner/landmark-stop.png" },
];

const FILTERS: { kind: PoiKind; label: string }[] = [
  { kind: "fuel", label: "Заправки" },
  { kind: "rest", label: "Отдых" },
  { kind: "sight", label: "Достопримечательности" },
];

function poiIcon(kind: PoiKind) {
  const path = kind === "fuel"
    ? "M7 21h10M8 21V5a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v16M10 7h4M10 11h4M16 9h2a2 2 0 0 1 2 2v5"
    : kind === "rest"
      ? "M5 8h11v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V8m11 2h2a2 2 0 0 1 0 4h-2M7 4h10M8 2v2m4-2v2m4-2v2"
      : "M4 20h16M6 20v-7h12v7M4 13h16M8 13V8h8v5M10 8V5h4v3M12 5V3";
  return `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${path}"/></svg>`;
}

function UiIcon({ name }: Readonly<{ name: "plus" | "minus" | "car" | "calendar" | "chevron" | "filter" | "expand" | "landmark" | "fuel" | "rest" | "sight" | "drag" | "clear" | "remove" }>) {
  const paths = {
    plus: <><circle cx="12" cy="12" r="8.5" /><path d="M12 8v8M8 12h8" /></>,
    minus: <path d="M8 12h8" />,
    car: <><path d="m4 15 1.8-5.4A2 2 0 0 1 7.7 8h8.6a2 2 0 0 1 1.9 1.6L20 15" /><path d="M3.5 15h17v4.5h-2.2v-2h-13v2H3.5zM7 15h.01M17 15h.01" /></>,
    calendar: <><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M8 3v4M16 3v4M4 10h16" /></>,
    chevron: <path d="m8 10 4 4 4-4" />,
    filter: <path d="M4 6h16M7 12h10M10 18h4" />,
    expand: <path d="M8 3H3v5M16 3h5v5M21 16v5h-5M3 16v5h5" />,
    landmark: <><path d="m4 20 8-16 8 16M6.5 15h11M9 15v5M15 15v5" /><path d="M12 4v11" /></>,
    fuel: <><path d="M7 21h10M8 21V5a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v16M10 7h4M10 11h4M16 9h2a2 2 0 0 1 2 2v5" /></>,
    rest: <><path d="M5 8h11v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V8m11 2h2a2 2 0 0 1 0 4h-2M7 4h10M8 2v2m4-2v2m4-2v2" /></>,
    sight: <><path d="M4 20h16M6 20v-7h12v7M4 13h16M8 13V8h8v5M10 8V5h4v3M12 5V3" /></>,
    drag: <><circle cx="8" cy="6" r=".7" fill="currentColor" /><circle cx="16" cy="6" r=".7" fill="currentColor" /><circle cx="8" cy="12" r=".7" fill="currentColor" /><circle cx="16" cy="12" r=".7" fill="currentColor" /><circle cx="8" cy="18" r=".7" fill="currentColor" /><circle cx="16" cy="18" r=".7" fill="currentColor" /></>,
    clear: <path d="m8 8 8 8m0-8-8 8" />,
    remove: <><path d="M4 7h16M9 7V4h6v3m-9 0 1 13h10l1-13M10 11v5m4-5v5" /></>,
  };

  return <svg className={styles.uiIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function routePois(coordinates: [number, number][]) {
  const steps = [.14, .18, .25, .33, .38, .47, .55, .60, .68, .72, .80, .86];
  return steps.map((ratio, index) => {
    const point = coordinates[Math.min(coordinates.length - 1, Math.max(0, Math.round((coordinates.length - 1) * ratio)))]!;
    const template = POI_DATA[index % POI_DATA.length]!;
    return { ...template, id: `${template.id}-${index}`, lat: point[0] + (index % 2 ? .04 : -.025), lon: point[1] + (index % 2 ? -.035 : .02) };
  });
}

function interpolateRoute(from: Place, to: Place): RouteData {
  const coordinates = Array.from({ length: 20 }, (_, index) => {
    const ratio = index / 19;
    return [from.lat + (to.lat - from.lat) * ratio, from.lon + (to.lon - from.lon) * ratio] as [number, number];
  });
  const latKm = (to.lat - from.lat) * 111;
  const lonKm = (to.lon - from.lon) * 72;
  const distance = Math.round(Math.hypot(latKm, lonKm) * 1.18);
  return { coordinates, distance, duration: Math.round(distance / 78 * 60) };
}

async function geocode(query: string): Promise<Place[]> {
  const normalizedQuery = query.trim().toLocaleLowerCase("ru-RU");
  const localMatches = Object.values(DEFAULT_PLACES).filter((place) => place.label.toLocaleLowerCase("ru-RU").includes(normalizedQuery));
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&accept-language=ru&q=${encodeURIComponent(query)}`;
  try {
    const response = await fetch(url, { headers: { Accept: "application/json" } });
    if (!response.ok) return localMatches;
    const data: { display_name: string; lat: string; lon: string }[] = await response.json();
    const remoteMatches = data.map((item) => ({ label: item.display_name, lat: Number(item.lat), lon: Number(item.lon) }));
    return [...localMatches, ...remoteMatches.filter((place) => !localMatches.some((local) => local.label === place.label))].slice(0, 5);
  } catch {
    return localMatches;
  }
}

async function buildRoute(points: Place[]): Promise<RouteData> {
  const [from, to] = [points[0], points[points.length - 1]];
  if (!from || !to) return interpolateRoute(DEFAULT_PLACES["Москва"]!, DEFAULT_PLACES["Краснодар"]!);
  const encodedPoints = points.map((point) => `${point.lon},${point.lat}`).join(";");
  const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${encodedPoints}?overview=full&geometries=geojson`, { headers: { Accept: "application/json" } });
  if (!response.ok) return interpolateRoute(from, to);
  const data: { routes?: { distance: number; duration: number; geometry: { coordinates: [number, number][] } }[] } = await response.json();
  const route = data.routes?.[0];
  if (!route) return interpolateRoute(from, to);
  return { distance: Math.round(route.distance / 1000), duration: Math.round(route.duration / 60), coordinates: route.geometry.coordinates.map(([lon, lat]) => [lat, lon]) };
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${value}T12:00:00`));
}

function DatePicker({ value, onChange }: Readonly<{ value: string; onChange: (value: string) => void }>) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(() => new Date(`${value}T12:00:00`));
  const start = new Date(month.getFullYear(), month.getMonth(), 1);
  const end = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  const offset = (start.getDay() + 6) % 7;
  const cells = Array.from({ length: offset + end.getDate() }, (_, index) => index < offset ? null : index - offset + 1);

  const selectDay = (day: number) => {
    const next = new Date(month.getFullYear(), month.getMonth(), day, 12);
    onChange(`${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`);
    setOpen(false);
  };

  return <div className={styles.controlWrap}><button type="button" className={styles.control} onClick={() => setOpen((current) => !current)} aria-expanded={open}><UiIcon name="calendar" /><span><small>Дата поездки</small>{formatDate(value)}</span><UiIcon name="chevron" /></button>{open && <div className={styles.calendar} role="dialog" aria-label="Выбор даты"><header><button type="button" className={styles.previousMonth} aria-label="Предыдущий месяц" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}><UiIcon name="chevron" /></button><strong>{new Intl.DateTimeFormat("ru-RU", { month: "long", year: "numeric" }).format(month)}</strong><button type="button" aria-label="Следующий месяц" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}><UiIcon name="chevron" /></button></header><div className={styles.week}>{["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((day) => <span key={day}>{day}</span>)}</div><div className={styles.days}>{cells.map((day, index) => day ? <button type="button" key={day} className={value === `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}` ? styles.selectedDay : ""} onClick={() => selectDay(day)}>{day}</button> : <i key={`empty-${index}`} />)}</div></div>}</div>;
}

function VehiclePicker({ value, onChange }: Readonly<{ value: string; onChange: (value: string) => void }>) {
  const [open, setOpen] = useState(false);
  const options = ["Легковой автомобиль", "Мотоцикл", "Автодом"];
  return <div className={styles.controlWrap}><button type="button" className={styles.control} onClick={() => setOpen((current) => !current)} aria-expanded={open}><UiIcon name="car" /><span><small>Транспорт</small>{value}</span><UiIcon name="chevron" /></button>{open && <div className={styles.menu} role="listbox" aria-label="Тип автомобиля">{options.map((option) => <button type="button" role="option" aria-selected={option === value} key={option} onClick={() => { onChange(option); setOpen(false); }}>{option}</button>)}</div>}</div>;
}

export function RoutePlanner() {
  const mapElement = useRef<HTMLDivElement>(null);
  const mapApi = useRef<{ map: LeafletMap; route: unknown; points: LeafletMarker[] } | null>(null);
  const stopSequence = useRef(0);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [stops, setStops] = useState<Stop[]>([]);
  const [pointOrder, setPointOrder] = useState<RouteField[]>(["origin", "destination"]);
  const [draggedPoint, setDraggedPoint] = useState<RouteField | null>(null);
  const [dropTarget, setDropTarget] = useState<RouteField | null>(null);
  const [dragPreview, setDragPreview] = useState<{ label: string; x: number; y: number } | null>(null);
  const [suggestions, setSuggestions] = useState<Place[]>([]);
  const [field, setField] = useState<RouteField | null>(null);
  const [route, setRoute] = useState<RouteData>(() => interpolateRoute(DEFAULT_PLACES["Москва"]!, DEFAULT_PLACES["Краснодар"]!));
  const [isLoading, setLoading] = useState(false);
  const [isExpanded, setExpanded] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [activeFilters, setActiveFilters] = useState<PoiKind[]>(FILTERS.map((filter) => filter.kind));
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [date, setDate] = useState("2026-08-12");
  const [vehicle, setVehicle] = useState("Легковой автомобиль");

  useEffect(() => {
    if (!field) return;
    const value = field === "origin" ? origin : field === "destination" ? destination : stops.find((stop) => stop.id === field)?.value ?? "";
    const timeout = window.setTimeout(() => {
      if (value.length < 3) { setSuggestions([]); return; }
      setSuggestions(Object.values(DEFAULT_PLACES).filter((place) => place.label.toLocaleLowerCase("ru-RU").includes(value.trim().toLocaleLowerCase("ru-RU"))));
      void geocode(value).then(setSuggestions).catch(() => setSuggestions([]));
    }, value.length < 3 ? 0 : 280);
    return () => window.clearTimeout(timeout);
  }, [origin, destination, stops, field]);

  useEffect(() => {
    if (!route || !mapElement.current) return;
    let disposed = false;
    const setup = async () => {
      const load = (source: string, type: "script" | "style") => new Promise<void>((resolve, reject) => {
        if (document.querySelector(`[data-route-map-source="${source}"]`)) return resolve();
        const element = document.createElement(type === "script" ? "script" : "link") as HTMLScriptElement | HTMLLinkElement;
        element.dataset.routeMapSource = source;
        if (type === "script") { (element as HTMLScriptElement).src = source; (element as HTMLScriptElement).defer = true; }
        else { (element as HTMLLinkElement).href = source; (element as HTMLLinkElement).rel = "stylesheet"; }
        element.onload = () => resolve(); element.onerror = () => reject(new Error("Map assets unavailable")); document.head.append(element);
      });
      await load("https://unpkg.com/leaflet@1.9.4/dist/leaflet.css", "style");
      await load("https://unpkg.com/leaflet@1.9.4/dist/leaflet.js", "script");
      await load("https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css", "style");
      await load("https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css", "style");
      await load("https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js", "script");
      const L = (window as Window & { L?: LeafletApi }).L;
      if (disposed || !L || !mapElement.current) return;
      const map = L.map(mapElement.current, { zoomControl: false, attributionControl: false });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18, attribution: "© OpenStreetMap contributors" }).addTo(map);
      const routeLine = hasCalculated ? L.polyline(route.coordinates, { color: "#ff5100", weight: 5, opacity: .95 }).addTo(map) : null;
      if (routeLine) {
        map.fitBounds(routeLine.getBounds(), { padding: [72, 72] });
        map.setZoom(Math.max(map.getZoom(), 5));
      } else {
        map.setView([56, 55], 4);
      }
      const cluster = L.markerClusterGroup({ maxClusterRadius: 64, showCoverageOnHover: false });
      const points = (hasCalculated ? routePois(route.coordinates) : []).filter((poi) => activeFilters.includes(poi.kind)).map((poi) => {
        const markerColor = poi.kind === "fuel" ? styles.poiMarkerFuel : poi.kind === "rest" ? styles.poiMarkerRest : styles.poiMarkerSight;
        const marker = L.marker([poi.lat, poi.lon], { title: poi.name, alt: poi.name, icon: L.divIcon({ className: `${styles.poiMarker} ${markerColor}`, html: poiIcon(poi.kind), iconSize: [40, 40], iconAnchor: [20, 20] }) }).addTo(map);
        marker.bindTooltip(`<article class="${styles.tooltip}"><img src="${poi.image}" alt=""><strong>${poi.name}</strong><span>${poi.description}</span><em>Открыть подробности</em></article>`, { direction: "top", offset: [0, -20], opacity: 1, sticky: true, interactive: true, className: styles.mapTooltip });
        return marker;
      });
      points.forEach((marker) => map.removeLayer(marker));
      cluster.addLayers(points).addTo(map);
      mapApi.current = { map, route: routeLine, points };
    };
    void setup();
    return () => { disposed = true; mapApi.current?.map.remove(); mapApi.current = null; };
  }, [route, activeFilters, hasCalculated, isExpanded]);

  const pointValue = (id: RouteField) => id === "origin" ? origin : id === "destination" ? destination : stops.find((stop) => stop.id === id)?.value ?? "";
  const updateStop = (id: string, value: string) => setStops((current) => current.map((stop) => stop.id === id ? { ...stop, value } : stop));
  const updatePoint = (id: RouteField, value: string) => {
    if (id === "origin") setOrigin(value);
    else if (id === "destination") setDestination(value);
    else updateStop(id, value);
  };
  const clearPoint = (id: RouteField) => {
    updatePoint(id, "");
    if (field === id) { setField(null); setSuggestions([]); }
  };
  const removePoint = (id: RouteField) => {
    if (id === "origin" || id === "destination") return;
    setStops((current) => current.filter((stop) => stop.id !== id));
    setPointOrder((current) => current.filter((point) => point !== id));
    if (field === id) { setField(null); setSuggestions([]); }
  };
  const addStop = () => {
    const id = `stop-${stopSequence.current++}` as RouteField;
    setStops((current) => [...current, { id, value: "" }]);
    setPointOrder((current) => [...current.slice(0, -1), id, current[current.length - 1]!]);
    setField(id);
  };
  const movePoint = (sourceId: RouteField, targetId: RouteField) => {
    if (sourceId === targetId) return;
    setPointOrder((current) => {
      const sourceIndex = current.indexOf(sourceId);
      const targetIndex = current.indexOf(targetId);
      if (sourceIndex < 0 || targetIndex < 0) return current;
      const next = [...current];
      const [source] = next.splice(sourceIndex, 1);
      next.splice(targetIndex, 0, source!);
      return next;
    });
  };
  const choose = (place: Place) => {
    if (field === "origin") setOrigin(place.label);
    else if (field === "destination") setDestination(place.label);
    else if (field) updateStop(field, place.label);
    setSuggestions([]); setField(null);
  };
  const calculate = async () => {
    setLoading(true);
    const routeCandidates = await Promise.all(pointOrder.map(async (id) => {
      const value = pointValue(id);
      return value.trim() ? DEFAULT_PLACES[value] ?? (await geocode(value))[0] : undefined;
    }));
    const routePoints = routeCandidates.filter((place): place is Place => Boolean(place));
    if (!routePoints.length) routePoints.push(DEFAULT_PLACES["Москва"]!, DEFAULT_PLACES["Краснодар"]!);
    else if (routePoints.length === 1) routePoints.push(DEFAULT_PLACES["Краснодар"]!);
    const result = await buildRoute(routePoints).catch(() => interpolateRoute(routePoints[0]!, routePoints[routePoints.length - 1]!));
    setRoute(result); setHasCalculated(true); setLoading(false);
  };
  const duration = `${Math.floor(route.duration / 60)} ч ${route.duration % 60} мин`;
  const showPointSuggestions = Boolean(field && suggestions.length > 0);
  const hasPointOverflow = stops.length >= 4;
  const suggestionOpensUpward = Boolean(field && pointOrder.indexOf(field) >= pointOrder.length - 2);

  return <section className={`${styles.mapShell} ${isExpanded ? styles.expanded : ""}`} aria-label="Построение маршрута">
    <div className={styles.map} ref={mapElement} />
    <small className={styles.mapCopyright}>© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a></small>
    <form className={styles.form} onSubmit={(event) => { event.preventDefault(); void calculate(); }}>
      <div className={styles.routeFields}>
        <div className={`${styles.routePoints} ${hasPointOverflow ? styles.routePointsScrollable : ""} ${showPointSuggestions ? styles.routePointsOpen : ""}`}>
          {pointOrder.map((point, index) => {
          const label = index === 0 ? "Откуда" : index === pointOrder.length - 1 ? "Куда" : "Остановка";
          const value = pointValue(point);
          const previewLabel = value || label;
            return <label key={point} className={`${styles.routeField} ${styles.stopField} ${draggedPoint === point ? styles.draggingStop : ""} ${dropTarget === point && draggedPoint !== point ? styles.dropTarget : ""}`} onDragOver={(event) => { event.preventDefault(); if (draggedPoint !== point) setDropTarget(point); }} onDrop={() => { if (draggedPoint) movePoint(draggedPoint, point); setDraggedPoint(null); setDropTarget(null); setDragPreview(null); }}><button type="button" className={styles.dragHandle} draggable aria-label={`Переместить точку «${previewLabel}»`} title="Перетащите, чтобы изменить порядок" onDragStart={(event) => { event.dataTransfer.effectAllowed = "move"; event.dataTransfer.setData("text/plain", point); setDraggedPoint(point); setDragPreview({ label: previewLabel, x: event.clientX, y: event.clientY }); }} onDrag={(event) => { if (event.clientX || event.clientY) setDragPreview((current) => current ? { ...current, x: event.clientX, y: event.clientY } : current); }} onDragEnd={() => { setDraggedPoint(null); setDropTarget(null); setDragPreview(null); }}><UiIcon name="drag" /></button><input aria-label={label} placeholder={label} value={value} onFocus={() => setField(point)} onKeyDown={(event) => { if (event.key === "Escape") { setField(null); setSuggestions([]); } }} onChange={(event) => updatePoint(point, event.target.value)} autoComplete="off" /><span className={styles.pointActions}>{field === point && pointValue(point) && <button type="button" className={styles.pointAction} aria-label="Очистить поле" title="Очистить поле" onMouseDown={(event) => event.preventDefault()} onClick={() => clearPoint(point)}><UiIcon name="clear" /></button>}{point !== "origin" && point !== "destination" && <button type="button" className={`${styles.pointAction} ${styles.removePoint}`} aria-label="Удалить остановку" title="Удалить остановку" onMouseDown={(event) => event.preventDefault()} onClick={() => removePoint(point)}><UiIcon name="remove" /></button>}</span>{field === point && suggestions.length > 0 && <ul className={`${styles.suggestions} ${suggestionOpensUpward ? styles.suggestionsAbove : ""}`}>{suggestions.map((place) => <li key={`${place.lat}-${place.lon}`}><button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => choose(place)}>{place.label}</button></li>)}</ul>}</label>;
          })}
        </div>
        <button type="button" className={styles.addStop} onClick={addStop}><UiIcon name="plus" />Добавить остановку</button>
      </div>
      <VehiclePicker value={vehicle} onChange={setVehicle} />
      <DatePicker value={date} onChange={setDate} />
      <button className={styles.calculate} type="submit" disabled={isLoading}>{isLoading ? "Строим маршрут…" : "Рассчитать стоимость"}</button>
      <small>Условия использования</small>
      {hasCalculated && <div className={styles.summary} aria-live="polite"><b>{route.distance} км</b><span>{duration} · ~{Math.round(route.distance * .2 + 520).toLocaleString("ru-RU")} ₽</span></div>}
    </form>
    <button type="button" className={styles.expand} onClick={() => setExpanded((value) => !value)} aria-label={isExpanded ? "Свернуть карту" : "Развернуть карту"}><UiIcon name="expand" /></button>
    <div className={styles.zoomControl} aria-label="Масштаб карты"><button type="button" aria-label="Приблизить карту" onClick={() => mapApi.current?.map.zoomIn()}><UiIcon name="plus" /></button><button type="button" aria-label="Отдалить карту" onClick={() => mapApi.current?.map.zoomOut()}><UiIcon name="minus" /></button></div>
    {hasCalculated && <div className={styles.filterControl}><button type="button" className={styles.filterButton} onClick={() => setFiltersOpen((current) => !current)} aria-expanded={filtersOpen}><UiIcon name="filter" />Фильтры</button>{filtersOpen && <div className={styles.filters} role="dialog" aria-label="Фильтрация точек маршрута"><header><strong>На маршруте</strong><button type="button" onClick={() => setActiveFilters(FILTERS.map((filter) => filter.kind))}>Сбросить</button></header>{FILTERS.map((filter) => <label key={filter.kind}><input type="checkbox" checked={activeFilters.includes(filter.kind)} onChange={() => setActiveFilters((active) => active.includes(filter.kind) ? active.filter((item) => item !== filter.kind) : [...active, filter.kind])} /><UiIcon name={filter.kind} />{filter.label}</label>)}</div>}</div>}
    {dragPreview && <div className={styles.dragPreview} style={{ left: dragPreview.x + 14, top: dragPreview.y + 14 }} aria-hidden="true"><UiIcon name="drag" /><span>{dragPreview.label}</span></div>}
  </section>;
}
