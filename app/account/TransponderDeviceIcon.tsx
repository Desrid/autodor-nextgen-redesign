import type { CSSProperties } from "react";

type TransponderDeviceIconProps = Readonly<{
  className?: string;
  style?: CSSProperties;
}>;

export function TransponderDeviceIcon({
  className,
  style,
}: TransponderDeviceIconProps) {
  const classes = ["account-svg-icon", "transponder-device-icon", className]
    .filter(Boolean)
    .join(" ");

  return (
    <svg aria-hidden="true" className={classes} style={style} viewBox="90 45 220 260">
      <rect
        height="230.33963"
        ry="13.599422"
        style={{
          fill: "var(--transponder-device-surface, #ffffff)",
          stroke: "var(--transponder-device-primary, #fe613b)",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeMiterlimit: 4,
          strokeWidth: 19.224823,
        }}
        transform="matrix(1,0,-0.19444649,0.98091313,0,0)"
        width="163.55885"
        x="127.90963"
        y="63.229168"
      />
      <path
        d="m 130.91121,117.88325 -6.49849,27.71806 119.93221,-11.59709 6.23629,-27.04327 z"
        style={{ fill: "var(--transponder-device-primary, #fe613b)" }}
      />
      <path
        d="m 143.6079,239.97756 21.59457,-93.57645 h 39.41522 l -22.21956,95.97585 -16.39587,-13.59659 z"
        style={{ fill: "var(--transponder-device-primary, #fe613b)" }}
      />
      <path
        d="m 132.211,287.97768 3.499,-15.22107 -25.29375,-0.3872 51.98692,-30.39236 37.59053,31.19216 -25.99347,-1.1997 -3.86741,15.98183 z"
        style={{ fill: "var(--transponder-device-primary, #fe613b)" }}
      />
      <path
        d="m 160.51324,240.97297 -1.94455,9.28078 4.41942,0 1.98874,-9.28077 z"
        style={{ fill: "var(--transponder-device-cutout, #fefffc)" }}
      />
      <path
        d="m 157.08819,257.94353 -1.94455,9.28078 h 4.41942 l 1.98874,-9.28077 z"
        style={{ fill: "var(--transponder-device-cutout, #fefffc)" }}
      />
      <path
        d="m 153.81782,274.42797 -1.94455,9.28078 h 4.41942 l 1.98874,-9.28077 z"
        style={{ fill: "var(--transponder-device-cutout, #fefffc)" }}
      />
    </svg>
  );
}
