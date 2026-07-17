import type { Coordinate, VerifiedLineGeometry } from "@/app/data/map-contracts";
import type { CSSProperties } from "react";

type RouteMarker = Readonly<{
  label: string;
  coordinate: Coordinate;
  dx: number;
  dy: number;
  anchor: "start" | "middle" | "end";
  emphasis?: boolean;
}>;

const WIDTH = 640;
const HEIGHT = 420;
const PLOT = { left: 42, right: 600, top: 48, bottom: 372 } as const;

// The city sequence follows the official Avtodor route presentation.
const M1_MARKERS: readonly RouteMarker[] = [
  {
    label: "Граница РБ",
    coordinate: [30.99259, 54.69094],
    dx: 12,
    dy: -14,
    anchor: "start",
  },
  {
    label: "Смоленск",
    coordinate: [32.04613, 54.78141],
    dx: 0,
    dy: -18,
    anchor: "middle",
    emphasis: true,
  },
  {
    label: "Вязьма",
    coordinate: [34.29952, 55.21036],
    dx: 0,
    dy: 26,
    anchor: "middle",
  },
  {
    label: "Можайск",
    coordinate: [36.02131, 55.50648],
    dx: 0,
    dy: 26,
    anchor: "middle",
  },
  {
    label: "Москва",
    coordinate: [37.60639, 55.62558],
    dx: -8,
    dy: -16,
    anchor: "end",
    emphasis: true,
  },
] as const;

const ROUTE_MARKERS: Readonly<Record<string, readonly RouteMarker[]>> = {
  "m-1": M1_MARKERS,
  "m-3": [
    { label: "Граница", coordinate: [32.0, 52.12], dx: 10, dy: -12, anchor: "start" },
    { label: "Брянск", coordinate: [34.37, 53.24], dx: 0, dy: 25, anchor: "middle" },
    {
      label: "Калуга",
      coordinate: [36.28, 54.51],
      dx: 0,
      dy: -16,
      anchor: "middle",
      emphasis: true,
    },
    {
      label: "Москва",
      coordinate: [37.56, 55.67],
      dx: -8,
      dy: -15,
      anchor: "end",
      emphasis: true,
    },
  ],
  "m-4": [
    {
      label: "Москва",
      coordinate: [37.62, 55.75],
      dx: -8,
      dy: -15,
      anchor: "end",
      emphasis: true,
    },
    {
      label: "Воронеж",
      coordinate: [39.2, 51.66],
      dx: 0,
      dy: -16,
      anchor: "middle",
      emphasis: true,
    },
    {
      label: "Ростов-на-Дону",
      coordinate: [39.7, 47.24],
      dx: 0,
      dy: 26,
      anchor: "middle",
    },
    { label: "Краснодар", coordinate: [38.97, 45.04], dx: 0, dy: 26, anchor: "middle" },
    {
      label: "Новороссийск",
      coordinate: [37.77, 44.72],
      dx: 10,
      dy: 20,
      anchor: "start",
    },
  ],
  "m-11": [
    {
      label: "Москва",
      coordinate: [37.62, 55.75],
      dx: -8,
      dy: -15,
      anchor: "end",
      emphasis: true,
    },
    {
      label: "Тверь",
      coordinate: [35.91, 56.86],
      dx: 0,
      dy: -16,
      anchor: "middle",
      emphasis: true,
    },
    {
      label: "Великий Новгород",
      coordinate: [31.27, 58.52],
      dx: 0,
      dy: 26,
      anchor: "middle",
    },
    {
      label: "Санкт-Петербург",
      coordinate: [30.3, 59.93],
      dx: 10,
      dy: -13,
      anchor: "start",
      emphasis: true,
    },
  ],
  "m-12": [
    {
      label: "Москва",
      coordinate: [37.62, 55.75],
      dx: -8,
      dy: -15,
      anchor: "end",
      emphasis: true,
    },
    {
      label: "Владимир",
      coordinate: [40.41, 56.13],
      dx: 0,
      dy: -16,
      anchor: "middle",
      emphasis: true,
    },
    { label: "Арзамас", coordinate: [43.84, 55.39], dx: 0, dy: 26, anchor: "middle" },
    {
      label: "Чебоксары",
      coordinate: [47.25, 56.15],
      dx: 0,
      dy: -16,
      anchor: "middle",
    },
    {
      label: "Казань",
      coordinate: [49.1, 55.79],
      dx: -8,
      dy: 26,
      anchor: "end",
      emphasis: true,
    },
  ],
  "a-113": [
    { label: "Истра", coordinate: [36.7, 56.06], dx: 10, dy: -14, anchor: "start" },
    {
      label: "Ногинск",
      coordinate: [37.89, 55.75],
      dx: 0,
      dy: -16,
      anchor: "middle",
      emphasis: true,
    },
    {
      label: "Подольск",
      coordinate: [37.72, 55.25],
      dx: 0,
      dy: 26,
      anchor: "middle",
      emphasis: true,
    },
    { label: "Звенигород", coordinate: [36.55, 55.54], dx: -8, dy: 24, anchor: "end" },
  ],
  "a-289": [
    {
      label: "Краснодар",
      coordinate: [38.97, 45.04],
      dx: -8,
      dy: -15,
      anchor: "end",
      emphasis: true,
    },
    {
      label: "Славянск-на-Кубани",
      coordinate: [38.03, 45.26],
      dx: 0,
      dy: -16,
      anchor: "middle",
    },
    {
      label: "Темрюк",
      coordinate: [37.41, 45.28],
      dx: 0,
      dy: 26,
      anchor: "middle",
      emphasis: true,
    },
    { label: "А-290", coordinate: [36.77, 45.35], dx: 10, dy: -13, anchor: "start" },
  ],
  "a-105": [
    {
      label: "Москва",
      coordinate: [37.62, 55.75],
      dx: -8,
      dy: -15,
      anchor: "end",
      emphasis: true,
    },
    {
      label: "Домодедово",
      coordinate: [37.9, 55.42],
      dx: -8,
      dy: 25,
      anchor: "end",
      emphasis: true,
    },
  ],
  "a-107": [
    { label: "Истра", coordinate: [36.85, 55.94], dx: 0, dy: -16, anchor: "middle" },
    {
      label: "Ногинск",
      coordinate: [38.15, 55.86],
      dx: 0,
      dy: -16,
      anchor: "middle",
      emphasis: true,
    },
    { label: "Бронницы", coordinate: [38.2, 55.55], dx: 10, dy: 22, anchor: "start" },
    { label: "Голицыно", coordinate: [36.88, 55.36], dx: 0, dy: 26, anchor: "middle" },
  ],
};

// Each badge sits on a route segment clear of city markers and their labels.
const BADGE_COORDINATES: Readonly<Record<string, Coordinate>> = {
  "m-1": [34.74767, 55.40887],
  "m-3": [35.63, 54.16],
  "m-4": [40.1, 48.7],
  "m-11": [33.54, 57.15],
  "m-12": [46.04, 55.2],
  "a-113": [37.35, 55.98],
  "a-289": [38.62, 45.13],
  "a-105": [37.82, 55.52],
  "a-107": [37.78, 55.32],
};

function lineCoordinates(geometry: VerifiedLineGeometry): readonly Coordinate[] {
  if (geometry.geometry.type === "LineString") {
    return geometry.geometry.coordinates as readonly Coordinate[];
  }

  return geometry.geometry.coordinates.flat() as readonly Coordinate[];
}

function bounds(coordinates: readonly Coordinate[]) {
  const longitudes = coordinates.map(([longitude]) => longitude);
  const latitudes = coordinates.map(([, latitude]) => latitude);

  return {
    minLongitude: Math.min(...longitudes),
    maxLongitude: Math.max(...longitudes),
    minLatitude: Math.min(...latitudes),
    maxLatitude: Math.max(...latitudes),
  };
}

function project(
  [longitude, latitude]: Coordinate,
  routeBounds: ReturnType<typeof bounds>,
) {
  const longitudeRange = routeBounds.maxLongitude - routeBounds.minLongitude || 1;
  const latitudeRange = routeBounds.maxLatitude - routeBounds.minLatitude || 1;
  const normalizedLongitude = Math.max(
    0,
    Math.min(1, (longitude - routeBounds.minLongitude) / longitudeRange),
  );
  const normalizedLatitude = Math.max(
    0,
    Math.min(1, (latitude - routeBounds.minLatitude) / latitudeRange),
  );

  return {
    x: PLOT.left + normalizedLongitude * (PLOT.right - PLOT.left),
    y: PLOT.bottom - normalizedLatitude * (PLOT.bottom - PLOT.top),
  };
}

function smoothRoutePath(
  coordinates: readonly Coordinate[],
  routeBounds: ReturnType<typeof bounds>,
) {
  const points = coordinates.map((coordinate) => project(coordinate, routeBounds));
  const firstPoint = points[0];

  if (!firstPoint) return "";
  if (points.length === 1) return `M ${firstPoint.x} ${firstPoint.y}`;

  let path = `M ${firstPoint.x.toFixed(1)} ${firstPoint.y.toFixed(1)}`;

  for (let index = 1; index < points.length - 1; index += 1) {
    const point = points[index];
    const nextPoint = points[index + 1];
    if (!point || !nextPoint) continue;

    const midpointX = (point.x + nextPoint.x) / 2;
    const midpointY = (point.y + nextPoint.y) / 2;
    path += ` Q ${point.x.toFixed(1)} ${point.y.toFixed(1)} ${midpointX.toFixed(1)} ${midpointY.toFixed(1)}`;
  }

  const lastPoint = points[points.length - 1];
  if (!lastPoint) return path;

  return `${path} Q ${lastPoint.x.toFixed(1)} ${lastPoint.y.toFixed(1)} ${lastPoint.x.toFixed(1)} ${lastPoint.y.toFixed(1)}`;
}

export function RoadRouteMap({
  geometry,
  roadId,
  routeLabel,
}: Readonly<{
  geometry: VerifiedLineGeometry;
  roadId: string;
  routeLabel: string;
}>) {
  const coordinates = lineCoordinates(geometry);
  const firstCoordinate = coordinates[0];
  if (!firstCoordinate) return null;

  const routeBounds = bounds(coordinates);
  const routePath = smoothRoutePath(coordinates, routeBounds);
  const badgeCoordinate =
    BADGE_COORDINATES[roadId] ??
    coordinates[Math.floor(coordinates.length / 2)] ??
    firstCoordinate;
  const badgePoint = project(badgeCoordinate, routeBounds);
  const markers = ROUTE_MARKERS[roadId] ?? [];
  const markerAnimationOrder = [...markers]
    .sort((first, second) => second.coordinate[0] - first.coordinate[0])
    .map((marker) => marker.label);
  const maskId = `${roadId}-route-reveal-mask`;
  const shieldWidth = Math.max(48, routeLabel.length * 13);

  return (
    <div
      className="road-route-map"
      data-map-source={geometry.source.url}
      data-testid={`road-route-map-${roadId}`}
    >
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <mask id={maskId}>
            <rect
              className="road-route-map__reveal"
              width={WIDTH}
              height={HEIGHT}
              fill="white"
            />
          </mask>
        </defs>

        <g>
          <g mask={`url(#${maskId})`}>
            <path
              className="road-route-map__line road-route-map__line--active"
              pathLength="100"
              d={routePath}
            />
          </g>

          <g>
            {markers.map((marker) => {
              const point = project(marker.coordinate, routeBounds);
              const animationOrder = markerAnimationOrder.indexOf(marker.label);

              return (
                <g
                  className="road-route-map__marker"
                  key={marker.label}
                  style={
                    {
                      "--marker-delay": `${620 + animationOrder * 150}ms`,
                      animationDuration: "350ms",
                    } as CSSProperties
                  }
                >
                  <circle cx={point.x} cy={point.y} r={marker.emphasis ? 8 : 6} />
                  <circle cx={point.x} cy={point.y} r={marker.emphasis ? 3.2 : 2.4} />
                  <text
                    className={marker.emphasis ? "is-emphasized" : undefined}
                    x={point.x + marker.dx}
                    y={point.y + marker.dy}
                    textAnchor={marker.anchor}
                  >
                    {marker.label}
                  </text>
                </g>
              );
            })}

            <g
              className="road-route-map__shield"
              transform={`translate(${badgePoint.x - shieldWidth / 2} ${badgePoint.y - 16})`}
            >
              <rect width={shieldWidth} height="32" rx="6" />
              <text x={shieldWidth / 2} y="21" textAnchor="middle">
                {routeLabel}
              </text>
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
