export const integrationBranch = "codex/all-blocks-changes";

export const designContract = {
  figmaRoot: "1767:6575",
  designDials: { variance: 8, motion: 8, density: 4 },
  theme: "light",
  colors: {
    accent: "#FF5100",
    text: "#2D2A26",
    page: "#FFFFFF",
  },
  sections: [
    { key: "header", nodeId: "1767:6576" },
    { key: "roads", nodeId: "1767:7102" },
    { key: "services", nodeId: "1767:7168" },
    { key: "loyalty", nodeId: "1767:7270" },
    { key: "news", nodeId: "1767:7305" },
    { key: "important", nodeId: "1767:7328" },
    { key: "media", nodeId: "1767:7339" },
    { key: "contacts", nodeId: "1767:7368" },
    { key: "statistics", nodeId: "1767:7415" },
    { key: "subsidiary-services", nodeId: "1767:7456" },
    { key: "social", nodeId: "1767:7501" },
    { key: "future", nodeId: "1767:7508" },
    { key: "footer", nodeId: "1767:7539" },
  ],
  hiddenSections: [{ key: "documents", nodeId: "1767:7498" }],
  utilityNodes: {
    backToTop: "1767:9223",
    chat: "1767:9225",
  },
  viewports: [
    "desktop-1920",
    "desktop-1440",
    "desktop-1024",
    "tablet-768",
    "mobile-390",
    "mobile-375",
    "mobile-320",
    "mobile-390-reduced-motion",
  ],
  requiredE2E: [
    "e2e/accessibility.spec.ts",
    "e2e/footer.spec.ts",
    "e2e/header.spec.ts",
    "e2e/hero.spec.ts",
    "e2e/loyalty.spec.ts",
    "e2e/media.spec.ts",
    "e2e/performance.spec.ts",
    "e2e/requirements.spec.ts",
    "e2e/resilience.spec.ts",
    "e2e/services.spec.ts",
    "e2e/smoke.spec.ts",
    "e2e/visual.spec.ts",
  ],
};

const sharedFiles = [
  "app/page.tsx",
  "app/globals.css",
  "app/layout.tsx",
  "docs/requirements/traceability-matrix.md",
];

export const blockProfiles = {
  header: {
    files: [
      "app/components/HeaderNav.client.tsx",
      "app/components/HeaderNav.client.test.tsx",
      "app/data/header-navigation.ts",
      "app/data/header-navigation.test.ts",
      ...sharedFiles,
    ],
    unit: [
      "app/components/HeaderNav.client.test.tsx",
      "app/data/header-navigation.test.ts",
    ],
    e2e: ["e2e/header.spec.ts", "e2e/accessibility.spec.ts"],
  },
  roads: {
    files: [
      "app/components/RoadNetworkHero.client.tsx",
      "app/components/RoadNetworkHero.client.test.tsx",
      "app/components/RoadRouteMap.tsx",
      "app/data/roads.ts",
      ...sharedFiles,
    ],
    unit: ["app/components/RoadNetworkHero.client.test.tsx"],
    e2e: ["e2e/hero.spec.ts", "e2e/media.spec.ts", "e2e/resilience.spec.ts"],
  },
  services: {
    files: ["app/components/ServicesGrid.tsx", ...sharedFiles],
    unit: ["app/page.test.tsx"],
    e2e: ["e2e/services.spec.ts", "e2e/accessibility.spec.ts"],
  },
  loyalty: {
    files: [
      "app/components/LoyaltyRail.client.tsx",
      "app/components/LoyaltyRail.client.test.tsx",
      "app/data/loyalty.ts",
      ...sharedFiles,
    ],
    unit: ["app/components/LoyaltyRail.client.test.tsx"],
    e2e: ["e2e/loyalty.spec.ts", "e2e/accessibility.spec.ts"],
  },
  news: {
    files: ["app/data/home-content.ts", "app/data/home-content.test.ts", ...sharedFiles],
    unit: ["app/data/home-content.test.ts", "app/page.test.tsx"],
    e2e: ["e2e/requirements.spec.ts", "e2e/accessibility.spec.ts"],
  },
  important: {
    files: ["app/data/home-content.ts", "app/data/home-content.test.ts", ...sharedFiles],
    unit: ["app/data/home-content.test.ts", "app/page.test.tsx"],
    e2e: ["e2e/requirements.spec.ts"],
  },
  media: {
    files: [
      "app/components/MediaGallery.client.tsx",
      "app/components/MediaGallery.test.tsx",
      "app/data/media-assets.test.ts",
      ...sharedFiles,
    ],
    unit: ["app/components/MediaGallery.test.tsx", "app/data/media-assets.test.ts"],
    e2e: ["e2e/media.spec.ts", "e2e/accessibility.spec.ts"],
  },
  contacts: {
    files: [
      "app/components/ContactsTabs.client.tsx",
      "app/components/ContactsTabs.client.test.tsx",
      ...sharedFiles,
    ],
    unit: ["app/components/ContactsTabs.client.test.tsx"],
    e2e: ["e2e/requirements.spec.ts", "e2e/accessibility.spec.ts"],
  },
  statistics: {
    files: [
      "app/components/StatisticsBlock.tsx",
      "app/components/StatisticsBlock.test.tsx",
      "app/data/statistics.ts",
      "app/data/statistics.test.ts",
      ...sharedFiles,
    ],
    unit: [
      "app/components/StatisticsBlock.test.tsx",
      "app/data/statistics.test.ts",
    ],
    e2e: ["e2e/requirements.spec.ts", "e2e/accessibility.spec.ts"],
  },
  subsidiary: {
    files: ["app/data/home-content.ts", "app/data/home-content.test.ts", ...sharedFiles],
    unit: ["app/data/home-content.test.ts", "app/page.test.tsx"],
    e2e: ["e2e/requirements.spec.ts", "e2e/accessibility.spec.ts"],
  },
  social: {
    files: ["app/data/home-content.ts", "app/data/home-content.test.ts", ...sharedFiles],
    unit: ["app/data/home-content.test.ts", "app/page.test.tsx"],
    e2e: ["e2e/requirements.spec.ts", "e2e/accessibility.spec.ts"],
  },
  future: {
    files: ["app/data/future-projects.ts", "app/data/map-data.test.ts", ...sharedFiles],
    unit: ["app/data/map-data.test.ts", "app/page.test.tsx"],
    e2e: ["e2e/requirements.spec.ts", "e2e/resilience.spec.ts"],
  },
  footer: {
    files: ["app/data/home-content.ts", "app/data/home-content.test.ts", ...sharedFiles],
    unit: ["app/data/home-content.test.ts", "app/page.test.tsx"],
    e2e: [
      "e2e/footer.spec.ts",
      "e2e/requirements.spec.ts",
      "e2e/accessibility.spec.ts",
    ],
  },
  utilities: {
    files: ["app/components/FloatingUtilities.client.tsx", ...sharedFiles],
    unit: ["app/page.test.tsx"],
    e2e: ["e2e/requirements.spec.ts", "e2e/accessibility.spec.ts"],
  },
};
