import { SERVICES } from "@/app/data/home-content";

const ROW_SIZE = 3;

type ServiceId = (typeof SERVICES)[number]["id"];

function ServiceIcon({ id }: Readonly<{ id: ServiceId }>) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 2.25,
  };

  if (id === "mobile-app") {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <rect x="19" y="8" width="26" height="48" rx="7" {...common} />
        <path d="M28 14h8M30 49h4" {...common} />
      </svg>
    );
  }

  if (id === "max") {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <rect x="9" y="9" width="46" height="46" rx="13" {...common} />
        <path
          d="M20 38c0-9 5.8-15 14.3-15 6.2 0 10.7 4 10.7 9.7 0 6.8-5.7 11.3-13.5 11.3H25l-6 5 1-11Z"
          {...common}
        />
      </svg>
    );
  }

  if (id === "legal-account") {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <rect x="7" y="12" width="50" height="40" rx="9" {...common} />
        <circle cx="22" cy="27" r="6" {...common} />
        <path
          d="M12 44c1.7-6 5.3-9 10-9s8.3 3 10 9M39 25h10M39 34h10M39 43h7"
          {...common}
        />
      </svg>
    );
  }

  if (id === "online-store") {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path d="M12 23h40l-3 31H15l-3-31Z" {...common} />
        <path d="M22 25v-6c0-6 4-10 10-10s10 4 10 10v6" {...common} />
        <circle cx="23" cy="34" r="1.5" fill="currentColor" />
        <circle cx="41" cy="34" r="1.5" fill="currentColor" />
      </svg>
    );
  }

  if (id === "plate-payment") {
    return (
      <svg viewBox="0 0 96 64" aria-hidden="true">
        <rect x="4" y="14" width="88" height="36" rx="7" {...common} />
        <path
          d="M15 26l10 12M25 26 15 38M33 29c0-2 1.5-3 4-3s4 1 4 3v6c0 2-1.5 3-4 3s-4-1-4-3v-6ZM48 29c0-2 1.5-3 4-3s4 1 4 3v6c0 2-1.5 3-4 3s-4-1-4-3v-6ZM66 29c0-2 1.5-3 4-3s4 1 4 3v6c0 2-1.5 3-4 3s-4-1-4-3v-6ZM81 27h5M81 32h5M81 37h5"
          {...common}
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M12 10h40v44H12z" {...common} />
      <path d="m12 41 13-13 11 10 16-18M20 18h.1M45 47h.1" {...common} />
      <circle cx="20" cy="18" r="4" {...common} />
      <circle cx="45" cy="47" r="4" {...common} />
    </svg>
  );
}

function RoutePreview() {
  return (
    <svg className="route-preview" viewBox="0 0 520 220" aria-hidden="true">
      <defs>
        <linearGradient id="route-fade" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#ff6b00" />
          <stop offset="0.5" stopColor="#ff5100" />
          <stop offset="1" stopColor="#ff8a00" />
        </linearGradient>
        <clipPath id="route-map-clip">
          <rect width="520" height="220" />
        </clipPath>
        <filter id="route-road-edge-blur" x="-12%" y="-18%" width="124%" height="136%">
          <feGaussianBlur stdDeviation="13" />
        </filter>
        <mask
          id="route-road-edge-fade"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="520"
          height="220"
        >
          <rect
            x="10"
            y="8"
            width="500"
            height="204"
            fill="white"
            filter="url(#route-road-edge-blur)"
          />
        </mask>
      </defs>
      <g
        className="route-preview__street-network"
        clipPath="url(#route-map-clip)"
        mask="url(#route-road-edge-fade)"
      >
        <g className="route-preview__roads route-preview__roads--primary">
          <path d="M62.8 227.7L14.7 209.5L2.9 204.8" />
          <path d="M2.9 204.8L-57.2 181.2" />
        </g>
        <g className="route-preview__roads route-preview__roads--tertiary">
          <path d="M388.7 -87.0L392.5 -77.8L394.1 -74.9L395.7 -72.3L401.8 -62.1L411.9 -45.9L417.6 -36.0L425.6 -22.1L427.0 -19.8L431.2 -12.6L435.1 -6.0L436.7 -3.2L440.1 2.6L441.5 5.2L442.2 6.4L447.9 16.7L453.8 27.3L457.7 34.3L460.0 38.4" />
          <path d="M460.0 38.4L462.5 43.2L468.9 55.3L472.2 61.5L479.2 75.5L500.9 119.1L503.0 123.7" />
          <path d="M503.0 123.7L510.3 140.7L517.6 156.4L524.1 170.9L525.6 174.3L538.8 203.4" />
        </g>
        <g className="route-preview__roads route-preview__roads--residential">
          <path d="M503.0 123.7L507.1 124.4L513.0 125.0L518.4 125.0L549.6 122.7L563.2 121.7L597.9 119.1L608.2 118.3L614.1 117.8L642.2 115.5L666.9 113.5L746.7 106.8L780.1 103.7L814.4 100.5L847.1 97.5L853.8 96.8L875.2 94.6L884.6 93.4L891.2 92.1L905.8 87.7L919.8 82.9L928.0 79.9L931.5 78.6L986.5 56.8L999.5 52.5L1013.7 49.1" />
          <path d="M172.0 184.9L178.8 182.4L188.9 179.0L190.2 178.6L221.8 168.1L230.2 165.4L263.9 154.3L270.6 152.4L318.4 143.0L350.8 136.7L352.1 136.5L359.6 135.5L392.8 132.3L419.4 129.8L425.6 129.2L488.4 123.7L494.4 123.4L497.5 123.4L503.0 123.7" />
          <path d="M270.6 152.4L254.9 135.1L247.5 127.0L244.6 122.6L242.5 117.5L241.5 115.0L239.9 112.8L221.1 88.7L216.3 83.9L211.5 79.7L208.1 77.6L164.7 52.0L140.5 37.5L126.6 29.1L121.1 25.8L108.8 18.0L92.6 5.7L74.3 -9.1L64.7 -16.8" />
          <path d="M216.3 83.9L211.3 88.1L204.7 91.0L141.1 113.0L119.8 120.3L108.8 124.2L105.5 125.3L88.5 131.2L74.2 136.1L41.3 147.1L34.1 149.6L-46.4 177.5L-57.2 181.2" />
          <path d="M460.0 38.4L444.6 41.0L360.3 55.2L342.8 58.2L319.1 62.2L306.7 64.3L291.3 66.9L266.4 71.1L229.0 77.8L225.3 78.9L221.4 80.3L216.3 83.9" />
          <path d="M110.2 208.1L113.4 206.8L121.2 203.7L127.1 201.3L132.4 199.2L172.0 184.9" />
          <path d="M79.0 221.1L110.2 208.1" />
        </g>
        <g className="route-preview__roads route-preview__roads--unclassified">
          <path d="M538.8 203.4L522.7 204.7L507.6 206.3L500.1 207.7L490.7 209.7L477.6 213.2L444.7 221.8L432.9 224.8L428.8 225.8L385.0 236.9L376.0 239.3L315.7 255.9L310.2 257.9L306.9 259.2L303.9 260.4L236.9 288.7L226.3 293.2" />
        </g>
        <g className="route-preview__roads route-preview__roads--service">
          <path d="M164.8 23.2L171.8 21.8L178.0 20.6L195.4 17.2L208.3 14.7L209.8 13.9L210.4 12.8L209.9 11.9L203.2 6.3L198.8 2.7L190.9 -3.8L185.4 -8.3L184.1 -9.4L183.9 -10.1L184.4 -10.9L185.7 -11.3L196.4 -13.5L198.9 -14.0L200.8 -14.7L202.9 -15.5L206.1 -16.4L207.3 -16.7L231.5 -21.6L233.7 -22.1L238.8 -23.1L256.2 -26.6L259.1 -26.9L262.2 -26.9L265.0 -26.9L267.7 -27.0L271.0 -27.4L275.0 -28.0L276.9 -28.2L279.0 -27.6L285.0 -22.4L287.5 -21.1L291.1 -20.2L296.0 -19.9L301.3 -20.2L316.0 -22.6" />
          <path d="M105.8 51.9L93.8 54.3L80.3 54.0L79.3 54.1L78.3 54.3L77.4 54.5L63.5 57.9L62.3 58.3L61.2 58.8L60.4 59.3L59.8 59.9L56.8 64.3L37.8 61.9L36.5 61.7L35.2 61.3L34.1 60.9L33.2 60.4L29.2 57.5L16.6 48.5L15.0 47.7L12.8 47.1L10.3 46.9L7.8 47.0L5.4 47.3L-15.9 52.9" />
          <path d="M472.2 61.5L458.9 62.6L442.6 64.2L432.6 65.2L425.6 65.9L413.4 68.1L402.2 69.1L400.7 69.3L399.4 69.6L398.2 69.9L397.1 70.4L392.9 72.8L392.0 73.4L391.5 74.1L391.3 74.8L391.5 75.5L394.6 81.8L403.0 98.8L409.3 111.6L413.2 118.7L417.7 126.5L417.9 127.0L418.2 127.5L419.4 129.8" />
          <path d="M230.2 165.4L226.9 163.9L225.2 163.2L207.4 153.4L206.3 152.6L206.1 151.7L206.8 150.9L208.3 150.2L215.3 148.0L223.6 145.5L224.9 145.0L226.0 144.4L226.8 143.8L227.5 143.2L229.5 140.5L230.3 139.7L231.5 139.0L232.9 138.4L234.6 137.9L236.5 137.6L251.2 135.6L252.6 135.4L254.9 135.1" />
          <path d="M318.9 78.1L324.0 83.9L329.7 91.4L330.7 92.1L332.3 92.7L334.3 93.0L336.4 92.9L341.2 92.4L370.6 89.2L372.5 88.8L374.0 88.1L374.7 87.3L374.5 86.4L370.8 81.1L368.6 77.1L368.1 75.5L368.9 73.9L370.1 72.2L371.1 71.1L371.3 69.7" />
          <path d="M-138.4 90.9L-135.1 91.7L-131.3 91.9L-127.5 91.6L-124.2 90.8L-107.6 84.5L-104.7 83.7L-101.4 83.4L-97.9 83.5L-94.8 84.0L-92.1 84.8L-64.4 97.3L-54.5 101.7L-34.9 110.5L-23.4 115.8L-3.8 125.3L31.0 142.2L37.5 145.3L38.4 145.7L41.3 147.1" />
          <path d="M129.6 60.4L123.9 62.1L82.9 73.7L71.5 66.9L70.6 66.4L69.6 66.1L68.4 65.8L67.1 65.6L56.8 64.3L54.0 68.5L53.4 69.1L52.6 69.6L51.5 70.1L50.2 70.5L13.7 79.5L28.3 88.7L35.8 93.6" />
          <path d="M121.6 96.4L130.9 93.6L147.6 88.5L155.5 86.1L157.3 85.3L158.5 84.4L158.8 83.4L158.4 82.3L157.2 81.4L144.2 74.2L134.1 68.6L132.3 67.6L131.5 66.9L131.3 66.2L131.6 65.4L132.6 64.8L134.4 63.9" />
          <path d="M352.1 136.5L350.5 134.5L349.8 133.7L342.7 124.1L337.6 117.3L337.2 115.9L337.9 114.4L339.7 113.1L342.4 112.2L345.8 111.6L367.1 109.7L383.4 108.2L387.8 116.2L389.2 119.0L386.9 121.1L387.2 121.7" />
          <path d="M463.7 15.2L467.0 14.9L470.7 14.5L474.2 14.0L477.3 13.1L479.7 11.9L481.2 10.5L481.8 9.0L481.4 7.4L480.1 6.0L477.9 4.7L475.0 3.8L471.5 3.1L467.8 2.9L464.0 3.0L457.0 3.7" />
          <path d="M394.6 81.8L405.5 80.9L408.5 80.9L411.4 81.2L414.0 81.9L415.8 82.8L416.9 84.0L419.2 88.8L421.5 93.3L421.6 94.5L420.8 95.7L419.1 96.8L416.7 97.5L413.9 98.0L403.0 98.8" />
          <path d="M132.4 199.2L127.6 197.0L106.2 188.0L81.9 177.5L80.6 177.1L79.0 176.9L77.4 177.0L76.0 177.4L52.7 186.7L50.6 187.3L48.1 187.6L45.5 187.6L43.1 187.3L41.0 186.6" />
        </g>
        <g className="route-preview__roads route-preview__roads--detail">
          <path d="M16 182L42 173L72 165L100 157L124 143L145 126" />
          <path d="M26 107L51 114L78 119L101 117L126 103L149 95" />
          <path d="M74 22L95 34L114 49L134 64L154 77" />
          <path d="M153 32L175 45L193 58L209 73" />
          <path d="M278 14L294 31L310 47L328 61L347 70" />
          <path d="M283 98L303 105L322 112L342 119L363 126" />
          <path d="M302 146L319 159L333 173L345 190L352 211" />
          <path d="M365 88L388 96L410 105L431 116L451 129" />
          <path d="M421 45L440 58L458 72L476 87L493 102" />
          <path d="M390 175L414 169L439 163L465 157L497 150" />
        </g>
      </g>
      <path
        className="route-preview__route-shadow"
        d="M54 170C84 161 112 164 143 150C169 140 183 135 212 131L233 130C244 129 251 122 246 110C241 97 237 87 217 76C204 69 201 62 221 57C244 51 255 54 279 47L344 39L398 34"
      />
      <path
        className="route-preview__route-line"
        d="M54 170C84 161 112 164 143 150C169 140 183 135 212 131L233 130C244 129 251 122 246 110C241 97 237 87 217 76C204 69 201 62 221 57C244 51 255 54 279 47L344 39L398 34"
      />
      <path
        className="route-preview__active-route"
        d="M318 175C318 153 307 137 324 116C342 92 363 83 359 59C355 35 372 21 388 14C399 8 399 8 402 8"
      />
      <g className="route-preview__destination">
        <circle cx="410" cy="42" r="12" />
        <circle cx="410" cy="42" r="4" />
      </g>
      <g className="route-preview__vehicle">
        <path d="m15 0-30 12 5-12-5-12L15 0Z" />
      </g>
    </svg>
  );
}

export function ServicesGrid() {
  const rows = [SERVICES.slice(0, ROW_SIZE), SERVICES.slice(ROW_SIZE)];

  return (
    <div className="services-grid" data-testid="services-grid">
      {rows.map((row, rowIndex) => (
        <div className="services-row" key={`services-row-${rowIndex + 1}`}>
          {row.map((service) => (
            <details
              key={service.id}
              className="service-card"
              data-service-id={service.id}
              data-testid={`service-${service.id}`}
              data-node-id={service.nodeId}
            >
              <summary>
                <span className="service-card__title">{service.title}</span>
                <span className="service-card__visual" aria-hidden="true">
                  <span>
                    {service.id === "route-calculator" ? (
                      <RoutePreview />
                    ) : (
                      <ServiceIcon id={service.id} />
                    )}
                  </span>
                </span>
                <span className="service-card__teaser" aria-hidden="true">
                  {service.description}
                </span>
              </summary>
              <div className="service-card__body">
                <p>{service.description}</p>
                <a href={service.href}>
                  Открыть сервис <span aria-hidden="true">↗</span>
                </a>
              </div>
            </details>
          ))}
        </div>
      ))}
    </div>
  );
}
