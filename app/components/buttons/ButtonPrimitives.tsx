import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

import { ArrowIcon } from "../ArrowIcon";
import { Icon, type IconName } from "../icons/Icon";

type BaseButtonProps = Readonly<ButtonHTMLAttributes<HTMLButtonElement>>;

const disabledControlStyle = {
  background: "var(--color-gray-1)",
  borderColor: "var(--color-gray-3)",
  color: "var(--color-gray-7)",
  cursor: "not-allowed",
} as const;

const focusStyle = {
  outline: "3px solid var(--color-brand-orange)",
  outlineOffset: 2,
} as const;

export function SliderButton({
  direction,
  ...props
}: BaseButtonProps & Readonly<{ direction: "left" | "right" }>) {
  return (
    <button
      {...props}
      aria-label={props["aria-label"] ?? (direction === "left" ? "Назад" : "Вперёд")}
      style={{
        alignItems: "center",
        background: "var(--color-page)",
        border: "1px solid var(--color-brand-black)",
        borderRadius: "var(--radius-control)",
        color: "var(--color-brand-black)",
        display: "inline-flex",
        height: 56,
        justifyContent: "center",
        padding: 0,
        width: 56,
        ...(props.disabled ? disabledControlStyle : {}),
        ...props.style,
      }}
      type={props.type ?? "button"}
    >
      <ArrowIcon direction={direction} />
    </button>
  );
}

export function ModalButton({
  children,
  variant = "confirm",
  ...props
}: BaseButtonProps &
  Readonly<{ children: ReactNode; variant?: "cancel" | "confirm" | "destructive" }>) {
  const destructive =
    "color-mix(in srgb, var(--color-brand-orange) 70%, var(--color-brand-black))";
  const colors =
    variant === "cancel"
      ? {
          background: "var(--color-page)",
          border: "1px solid var(--color-border)",
          color: "var(--color-text)",
        }
      : variant === "destructive"
        ? {
            background: destructive,
            border: `1px solid ${destructive}`,
            color: "var(--color-page)",
          }
        : {
            background: "var(--color-brand-orange)",
            border: "1px solid var(--color-brand-orange)",
            color: "var(--color-page)",
          };
  return (
    <button
      {...props}
      style={{
        borderRadius: "var(--radius-control)",
        font: "inherit",
        fontWeight: 700,
        minHeight: 48,
        padding: "0.75rem 1rem",
        ...colors,
        ...(props.disabled ? disabledControlStyle : {}),
        ...props.style,
      }}
      type={props.type ?? "button"}
    >
      {children}
    </button>
  );
}

export function CloseButton({
  label = "Закрыть",
  ...props
}: BaseButtonProps & Readonly<{ label?: string }>) {
  return (
    <button
      {...props}
      aria-label={props["aria-label"] ?? label}
      style={{
        alignItems: "center",
        background: "transparent",
        border: 0,
        borderRadius: "var(--radius-control)",
        color: "currentColor",
        display: "inline-flex",
        height: 40,
        justifyContent: "center",
        padding: 0,
        width: 40,
        ...(props.disabled
          ? { color: "var(--color-gray-7)", cursor: "not-allowed" }
          : {}),
        ...props.style,
      }}
      type={props.type ?? "button"}
    >
      <Icon name="close" size={24} />
    </button>
  );
}

export function IconButton({
  icon,
  label,
  ...props
}: BaseButtonProps & Readonly<{ icon: IconName; label: string }>) {
  return (
    <button
      {...props}
      aria-label={props["aria-label"] ?? label}
      style={{
        alignItems: "center",
        background: "var(--color-page)",
        border: "1px solid var(--color-brand-black)",
        borderRadius: "var(--radius-control)",
        color: "var(--color-brand-black)",
        display: "inline-flex",
        height: 44,
        justifyContent: "center",
        padding: 0,
        width: 44,
        ...(props.disabled ? disabledControlStyle : {}),
        ...props.style,
      }}
      type={props.type ?? "button"}
    >
      <Icon name={icon} size={24} />
    </button>
  );
}

export function LinkButton({
  children,
  disabled = false,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & Readonly<{ disabled?: boolean }>) {
  return (
    <a
      {...props}
      aria-disabled={disabled || undefined}
      onClick={(event) => {
        if (disabled) event.preventDefault();
        props.onClick?.(event);
      }}
      style={{
        alignItems: "center",
        color: "var(--color-brand-orange)",
        display: "inline-flex",
        fontSize: "0.875rem",
        fontWeight: 700,
        gap: 8,
        minHeight: 44,
        opacity: disabled ? 0.55 : 1,
        pointerEvents: disabled ? "none" : undefined,
        textDecoration: "none",
        ...props.style,
      }}
    >
      {children}
      <ArrowIcon className="card-cta__icon" direction="right" />
    </a>
  );
}

export { focusStyle };
