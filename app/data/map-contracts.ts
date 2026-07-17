export type FigmaNodeId = `${number}:${number}`;

export type VerificationSource = Readonly<{
  label: string;
  url: `https://${string}`;
  verifiedAt: `${number}-${number}-${number}`;
}>;

export type Coordinate = readonly [longitude: number, latitude: number];

export type VerifiedLineGeometry = Readonly<{
  status: "verified";
  geometry: Readonly<{
    type: "LineString" | "MultiLineString";
    coordinates: readonly Coordinate[] | readonly (readonly Coordinate[])[];
  }>;
  source: VerificationSource;
  license: string;
  attribution: string;
}>;

export type UnavailableGeometry = Readonly<{
  status: "unavailable";
  geometry: null;
  reason: string;
}>;

export type MapGeometry = VerifiedLineGeometry | UnavailableGeometry;

export function hasVerifiedGeometry(
  geometry: MapGeometry,
): geometry is VerifiedLineGeometry {
  return geometry.status === "verified";
}
