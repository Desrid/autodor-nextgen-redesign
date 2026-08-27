import { Icon, type IconName } from "./icons";

type ArrowDirection = "down" | "left" | "right" | "up";

type ArrowIconProps = Readonly<{
  className?: string;
  direction: ArrowDirection;
  size?: 16 | 20 | 24 | 32;
}>;

const ARROW_NAMES: Record<ArrowDirection, IconName> = {
  down: "arrowDown",
  left: "arrowLeft",
  right: "arrowRight",
  up: "arrowUp",
};

export function ArrowIcon({ className, direction, size = 24 }: ArrowIconProps) {
  return className ? (
    <Icon className={className} name={ARROW_NAMES[direction]} size={size} />
  ) : (
    <Icon name={ARROW_NAMES[direction]} size={size} />
  );
}
