"use client";

import { useSyncExternalStore } from "react";

import { type HeroVariant, RoadNetworkHero } from "./RoadNetworkHero.client";

type HeroPreferences = Readonly<{
  variant: HeroVariant;
  withCar: boolean;
}>;

const DEFAULT_PREFERENCES: HeroPreferences = {
  variant: "cinematic",
  withCar: true,
};

export function readHeroPreferences(search: string): HeroPreferences {
  const params = new URLSearchParams(search);
  const hero = params.get("hero");

  return {
    variant: hero === "atlas" || hero === "signal" ? hero : "cinematic",
    withCar: params.get("car") !== "off",
  };
}

function subscribeToLocation(onStoreChange: () => void) {
  window.addEventListener("popstate", onStoreChange);

  return () => {
    window.removeEventListener("popstate", onStoreChange);
  };
}

function getLocationSearch() {
  return window.location.search;
}

function getServerSearch() {
  return "";
}

export function RoadNetworkHeroQuery() {
  const search = useSyncExternalStore(
    subscribeToLocation,
    getLocationSearch,
    getServerSearch,
  );
  const preferences = search === "" ? DEFAULT_PREFERENCES : readHeroPreferences(search);

  return (
    <RoadNetworkHero variant={preferences.variant} withCar={preferences.withCar} />
  );
}
