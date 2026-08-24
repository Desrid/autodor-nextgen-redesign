import type { ButtonHTMLAttributes } from "react";

type ToggleProps = Readonly<
  ButtonHTMLAttributes<HTMLButtonElement> & { checked: boolean; label: string }
>;

/** Переключатель из блока интероперабельности личного кабинета. */
export function Toggle({ checked, label, ...props }: ToggleProps) {
  return (
    <button
      {...props}
      aria-checked={checked}
      aria-label={props["aria-label"] ?? label}
      role="switch"
      style={{
        alignItems: "center",
        background: props.disabled
          ? "var(--color-gray-3)"
          : checked
            ? "#24bd85"
            : "#cbc6c0",
        border: 0,
        borderRadius: 999,
        cursor: props.disabled ? "not-allowed" : "pointer",
        display: "inline-flex",
        height: 24,
        justifyContent: checked ? "flex-end" : "flex-start",
        opacity: props.disabled ? 0.7 : 1,
        padding: 1,
        transition: "background-color 160ms ease-in-out",
        width: 48,
        ...props.style,
      }}
      type={props.type ?? "button"}
    >
      <span
        aria-hidden="true"
        style={{
          background: "var(--color-page)",
          borderRadius: "50%",
          boxShadow: "0 2px 4px rgb(45 42 38 / 20%)",
          display: "block",
          height: 22,
          width: 22,
        }}
      />
    </button>
  );
}
