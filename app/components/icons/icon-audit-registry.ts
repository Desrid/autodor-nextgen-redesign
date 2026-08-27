import type { IconName } from "./Icon";

export type IconAuditCategory =
  | "ui"
  | "conditional-ui"
  | "contextual-pictogram"
  | "brand"
  | "map-scene"
  | "decorative";

export type IconAuditStatus = "canonical" | "owner-migration" | "excluded";

export type IconAuditEntry = Readonly<{
  id: string;
  source: string;
  state: string;
  category: IconAuditCategory;
  status: IconAuditStatus;
  icons: readonly IconName[];
  note: string;
}>;

export const ICON_AUDIT_INVENTORY = [
  {
    id: "header-navigation",
    source: "app/components/HeaderNav.client.tsx",
    state: "default, mega menu, search query, language popover, mobile dialog",
    category: "conditional-ui",
    status: "canonical",
    icons: ["appsGrid", "chevronDown", "search", "close", "location", "email", "phone"],
    note: "All interaction pictograms resolve through Icon; flags and social marks are brand exclusions.",
  },
  {
    id: "floating-utilities",
    source: "app/components/FloatingUtilities.client.tsx",
    state: "back-to-top visible, help trigger, help dialog open",
    category: "conditional-ui",
    status: "canonical",
    icons: ["arrowUp", "chat", "close"],
    note: "Hidden scroll state and native dialog close action are covered.",
  },
  {
    id: "contacts-directory",
    source: "app/components/ContactsTabs.client.tsx",
    state: "every tab, available and unavailable contact rows",
    category: "conditional-ui",
    status: "canonical",
    icons: ["phone", "email", "globe", "location", "arrowRight"],
    note: "Animated border beam is decorative and is listed separately.",
  },
  {
    id: "media-gallery",
    source: "app/components/MediaGallery.client.tsx",
    state: "rail, lightbox open, previous, next, close",
    category: "conditional-ui",
    status: "canonical",
    icons: ["arrowLeft", "arrowRight", "close"],
    note: "The former text multiplication sign and local arrows use the shared catalog.",
  },
  {
    id: "road-statistics",
    source: "app/components/RoadStatistics.client.tsx",
    state: "road carousel and category tooltip",
    category: "conditional-ui",
    status: "canonical",
    icons: ["arrowLeft", "arrowRight", "info"],
    note: "Icon-only buttons retain accessible names at button level.",
  },
  {
    id: "road-hero-controls",
    source: "app/components/RoadNetworkHero.client.tsx",
    state: "hero detail CTA and action-card hover/focus",
    category: "ui",
    status: "canonical",
    icons: ["arrowRight"],
    note: "48px animated payment, route, loyalty and tariff drawings are contextual pictograms.",
  },
  {
    id: "services-cta",
    source: "app/components/ServicesGrid.tsx",
    state: "card hover, focus-within and expanded details",
    category: "conditional-ui",
    status: "canonical",
    icons: ["arrowRight"],
    note: "Service artwork, map replicas and branded MAX/T-pass imagery are excluded scenes.",
  },
  {
    id: "route-planner-form",
    source: "app/road-users/RoutePlanner.client.tsx",
    state:
      "base form, date dialog, vehicle listbox, focused point, extra stop, drag preview",
    category: "conditional-ui",
    status: "canonical",
    icons: ["calendar", "car", "chevronDown", "close", "delete", "drag", "plus"],
    note: "All formerly local JSX geometry now maps to the shared catalog.",
  },
  {
    id: "route-planner-map",
    source: "app/road-users/RoutePlanner.client.tsx",
    state: "expanded map, zoom, calculated route, filter dialog, clustered POI markers",
    category: "conditional-ui",
    status: "canonical",
    icons: ["expand", "plus", "minus", "filter", "fuel", "rest", "landmark"],
    note: "Leaflet POI containers mount the same shared Icon components as the filters and controls.",
  },
  {
    id: "useful-stories-modal",
    source: "app/road-users/UsefulStories.client.tsx",
    state: "story modal open, previous, next and close",
    category: "conditional-ui",
    status: "canonical",
    icons: ["close", "arrowLeft", "arrowRight"],
    note: "The close icon was deduplicated; modal buttons own their accessible names.",
  },
  {
    id: "about-video",
    source: "app/about/AboutVideo.client.tsx",
    state: "preview, playing, paused, muted, unmuted, dialog close",
    category: "conditional-ui",
    status: "canonical",
    icons: ["play", "pause", "volume", "volumeMuted", "close"],
    note: "All playback, mute and dialog states now resolve through Icon.",
  },
  {
    id: "about-history",
    source: "app/about/HistoryMapOverlay.client.tsx",
    state: "selected timeline year and source link",
    category: "conditional-ui",
    status: "canonical",
    icons: ["externalLink"],
    note: "The source action uses externalLink; the port legend remains map symbology.",
  },
  {
    id: "about-page-navigation",
    source: "app/about/page.tsx",
    state: "breadcrumbs and directional cards",
    category: "ui",
    status: "canonical",
    icons: ["chevronRight", "arrowRight"],
    note: "Navigation uses the catalog; quote mark and contact-map pin remain content graphics.",
  },
  {
    id: "account-dashboard",
    source: "app/account/AccountDashboard.client.tsx",
    state:
      "notifications, debt levels, toast, loyalty tooltip, empty vehicles, row actions, dialogs",
    category: "conditional-ui",
    status: "canonical",
    icons: [
      "close",
      "info",
      "warning",
      "sparkle",
      "check",
      "download",
      "bell",
      "arrowRight",
      "edit",
      "move",
      "details",
      "plusPlain",
      "vehicle",
    ],
    note: "All account controls use shared icons; the detailed transponder device is a documented contextual exception.",
  },
  {
    id: "account-transponder-device",
    source: "app/account/AccountDashboard.client.tsx",
    state: "transponder identity rows",
    category: "contextual-pictogram",
    status: "excluded",
    icons: [],
    note: "The original detailed T-pass device artwork is intentionally preserved as content imagery, outside the 24px UI-control contract.",
  },
  {
    id: "toll-lane-signs",
    source: "app/road-users/page.tsx",
    state: "transponder, card, cash and closed lanes",
    category: "contextual-pictogram",
    status: "excluded",
    icons: [],
    note: "64px road-sign language is content, not a reusable interface control.",
  },
  {
    id: "road-hero-artwork",
    source: "app/components/RoadNetworkHero.client.tsx",
    state: "payment, route, loyalty and tariff action-card art",
    category: "contextual-pictogram",
    status: "excluded",
    icons: [],
    note: "Animated 48px illustrations intentionally use the hero visual system.",
  },
  {
    id: "services-artwork",
    source: "app/components/ServicesGrid.tsx",
    state: "default, hover/focus and expanded service-card scenes",
    category: "decorative",
    status: "excluded",
    icons: [],
    note: "Phone, map, MAX satellites, legal, store and plate scenes are illustrations.",
  },
  {
    id: "map-rendering",
    source:
      "app/components/RoadRouteMap.tsx; app/components/FutureProjectsMap.client.tsx; public/media/services/route-map-russia.svg",
    state: "road geometry, stage selection and route animation",
    category: "map-scene",
    status: "excluded",
    icons: [],
    note: "Cartographic layers and map symbols keep their domain-specific geometry.",
  },
  {
    id: "decorative-svg",
    source:
      "app/components/ContactsTabs.client.tsx; app/components/RoadNetworkHero.client.tsx; app/about/page.tsx",
    state: "contact border beam, hero shadow, quote and contact-map ornament",
    category: "decorative",
    status: "excluded",
    icons: [],
    note: "Non-interactive effects are outside the 24px icon contract and remain aria-hidden.",
  },
  {
    id: "brand-assets",
    source:
      "app/components/logos/Logo.tsx; app/components/HeaderNav.client.tsx; app/components/SiteFooter.tsx; public/brand/**",
    state: "header, footer, partner marks, flags and social links",
    category: "brand",
    status: "excluded",
    icons: [],
    note: "Logos, flags, social marks and official partner identities must preserve brand artwork.",
  },
] as const satisfies readonly IconAuditEntry[];
