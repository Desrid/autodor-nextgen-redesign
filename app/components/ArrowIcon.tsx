type ArrowDirection = "down" | "left" | "right" | "up";

type ArrowIconProps = Readonly<{
  className?: string;
  direction: ArrowDirection;
}>;

const ARROW_PATHS: Record<ArrowDirection, string> = {
  down: "M12 5v14m-6-6 6 6 6-6",
  left: "M19 12H5m6-6-6 6 6 6",
  right: "M5 12h14m-6-6 6 6-6 6",
  up: "M12 19V5m-6 6 6-6 6 6",
};

export function ArrowIcon({ className, direction }: ArrowIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={ARROW_PATHS[direction]} />
    </svg>
  );
}
