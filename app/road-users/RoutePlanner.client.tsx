"use client";

import { useEffect, useRef, useState } from "react";

import { ArrowIcon } from "@/app/components/ArrowIcon";

import styles from "./RoutePlanner.module.css";

type Place = { label: string; lat: number; lon: number };
type PoiKind = "fuel" | "rest" | "sight";
type Poi = { id: string; kind: PoiKind; name: string; description: string; image: string; lat: number; lon: number };
type RouteData = { distance: number; duration: number; coordinates: [number, number][] };

const DEFAULT_PLACES: Record<string, Place> = {
  "Москва": { label: "Москва", lat: 55.7558, lon: 37.6173 },
  "Краснодар": { label: "Краснодар", lat: 45.0355, lon: 38.9753 },
  "Ростов-на-Дону": { label: "Ростов-на-Дону", lat: 47.2357, lon: 39.7015 },
  "Санкт-Петербург": { label: "Санкт-Петербург", lat: 59.9343, lon: 30.3351 },
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
  const path = kind === "fuel" ? "M7 21h10M8 21V5a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v16M10 7h4M10 11h4M16 10h2a2 2 0 0 1 2 2v5" : kind === "rest" ? "M4 20V8m16 12V8M4 12h16M7 8V5m10 3V5M7 20v-3m10 3v-3" : "m12 3 2.8 5.7L21 9.6l-4.5 4.4 1.1 6.2L12 17.2l-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z";
  return `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${path}"/></svg>`;
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
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&accept-language=ru&q=${encodeURIComponent(query)}`;
  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) return [];
  const data: { display_name: string; lat: string; lon: string }[] = await response.json();
  return data.map((item) => ({ label: item.display_name, lat: Number(item.lat), lon: Number(item.lon) }));
}

async function buildRoute(from: Place, to: Place): Promise<RouteData> {
  const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${from.lon},${from.lat};${to.lon},${to.lat}?overview=full&geometries=geojson`, { headers: { Accept: "application/json" } });
  if (!response.ok) return interpolateRoute(from, to);
  const data: { routes?: { distance: number; duration: number; geometry: { coordinates: [number, number][] } }[] } = await response.json();
  const route = data.routes?.[0];
  if (!route) return interpolateRoute(from, to);
  return { distance: Math.round(route.distance / 1000), duration: Math.round(route.duration / 60), coordinates: route.geometry.coordinates.map(([lon, lat]) => [lat, lon]) };
}

export function RoutePlanner() {
  const mapElement = useRef<HTMLDivElement>(null);
  const mapApi = useRef<{ map: any; route: any; points: any[] } | null>(null);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [suggestions, setSuggestions] = useState<Place[]>([]);
  const [field, setField] = useState<"origin" | "destination" | null>(null);
  const [route, setRoute] = useState<RouteData>(() => interpolateRoute(DEFAULT_PLACES["Москва"]!, DEFAULT_PLACES["Краснодар"]!));
  const [isLoading, setLoading] = useState(false);
  const [isExpanded, setExpanded] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [activeFilters, setActiveFilters] = useState<PoiKind[]>(FILTERS.map((filter) => filter.kind));

  useEffect(() => {
    if (!field) return;
    const value = field === "origin" ? origin : destination;
    if (value.length < 3) return setSuggestions([]);
    const timeout = window.setTimeout(() => { void geocode(value).then(setSuggestions).catch(() => setSuggestions([])); }, 280);
    return () => window.clearTimeout(timeout);
  }, [origin, destination, field]);

  useEffect(() => {
    void buildRoute(DEFAULT_PLACES["Москва"]!, DEFAULT_PLACES["Краснодар"]!)
      .then(setRoute)
      .catch(() => undefined);
  }, []);

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
      const L = (window as Window & { L?: any }).L;
      if (disposed || !L || !mapElement.current) return;
      const map = L.map(mapElement.current, { zoomControl: false, attributionControl: true });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18, attribution: "© OpenStreetMap contributors" }).addTo(map);
      L.control.zoom({ position: "bottomright" }).addTo(map);
      const routeLine = L.polyline(route.coordinates, { color: "#ff5100", weight: 5, opacity: .95 }).addTo(map);
      map.fitBounds(routeLine.getBounds(), { padding: [72, 72] });
      map.setZoom(Math.max(map.getZoom(), 5));
      const cluster = L.markerClusterGroup({ maxClusterRadius: 64, showCoverageOnHover: false });
      const points = (hasCalculated ? routePois(route.coordinates) : []).filter((poi) => activeFilters.includes(poi.kind)).map((poi) => {
        const marker = L.marker([poi.lat, poi.lon], { icon: L.divIcon({ className: styles.poiMarker, html: poiIcon(poi.kind), iconSize: [40, 40], iconAnchor: [20, 20] }) }).addTo(map);
        marker.bindTooltip(`<article class="${styles.tooltip}"><img src="${poi.image}" alt=""><strong>${poi.name}</strong><span>${poi.description}</span></article>`, { direction: "top", offset: [0, -20], opacity: 1 });
        return marker;
      });
      points.forEach((marker) => map.removeLayer(marker));
      cluster.addLayers(points).addTo(map);
      mapApi.current = { map, route: routeLine, points };
    };
    void setup();
    return () => { disposed = true; mapApi.current?.map.remove(); mapApi.current = null; };
  }, [route, activeFilters, hasCalculated, isExpanded]);

  const choose = (place: Place) => { if (field === "origin") setOrigin(place.label); if (field === "destination") setDestination(place.label); setSuggestions([]); setField(null); };
  const calculate = async () => {
    setLoading(true);
    const from = DEFAULT_PLACES[origin] ?? (origin ? (await geocode(origin))[0] : undefined) ?? DEFAULT_PLACES["Москва"]!;
    const to = DEFAULT_PLACES[destination] ?? (destination ? (await geocode(destination))[0] : undefined) ?? DEFAULT_PLACES["Краснодар"]!;
    const result = await buildRoute(from, to).catch(() => interpolateRoute(from, to));
    setRoute(result); setHasCalculated(true); setLoading(false);
  };
  const duration = `${Math.floor(route.duration / 60)} ч ${route.duration % 60} мин`;

  return <section className={`${styles.mapShell} ${isExpanded ? styles.expanded : ""}`} aria-label="Построение маршрута">
    <div className={styles.map} ref={mapElement} />
    <form className={styles.form} onSubmit={(event) => { event.preventDefault(); void calculate(); }}>
      <div className={styles.routeFields}>
        {(["origin", "destination"] as const).map((name) => <label key={name} className={styles.routeField}><span aria-hidden="true" /><input aria-label={name === "origin" ? "Откуда" : "Куда"} placeholder={name === "origin" ? "Откуда" : "Куда"} value={name === "origin" ? origin : destination} onFocus={() => setField(name)} onChange={(event) => name === "origin" ? setOrigin(event.target.value) : setDestination(event.target.value)} autoComplete="off" />{field === name && suggestions.length > 0 && <ul className={styles.suggestions}>{suggestions.map((place) => <li key={`${place.lat}-${place.lon}`}><button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => choose(place)}>{place.label}</button></li>)}</ul>}</label>)}
        <button type="button" className={styles.addStop} disabled>Добавить остановку</button>
      </div>
      <label className={styles.selectField}><span>Транспорт</span><select defaultValue="car"><option value="car">Легковой автомобиль</option><option value="motorcycle">Мотоцикл</option></select><ArrowIcon direction="right" /></label>
      <label className={styles.selectField}><span>Время отправления</span><input type="datetime-local" defaultValue="2026-08-12T09:00" /><ArrowIcon direction="right" /></label>
      <button className={styles.calculate} type="submit" disabled={isLoading}>{isLoading ? "Строим маршрут…" : "Рассчитать стоимость"}</button>
      <small>Условия использования</small>
      {hasCalculated && <div className={styles.summary} aria-live="polite"><b>{route.distance} км</b><span>{duration} · ~{Math.round(route.distance * .2 + 520).toLocaleString("ru-RU")} ₽</span></div>}
    </form>
    <button type="button" className={styles.expand} onClick={() => setExpanded((value) => !value)} aria-label={isExpanded ? "Свернуть карту" : "Развернуть карту"}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3H3v5M16 3h5v5M21 16v5h-5M3 16v5h5" /></svg></button>
    {hasCalculated && <div className={styles.filters}>{FILTERS.map((filter) => <label key={filter.kind}><input type="checkbox" checked={activeFilters.includes(filter.kind)} onChange={() => setActiveFilters((active) => active.includes(filter.kind) ? active.filter((item) => item !== filter.kind) : [...active, filter.kind])} />{filter.label}</label>)}</div>}
  </section>;
}
