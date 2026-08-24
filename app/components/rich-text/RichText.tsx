import type { HTMLAttributes, ReactNode } from "react";

type RichTextProps = Readonly<
  HTMLAttributes<HTMLDivElement> & {
    disabled?: boolean;
    label: string;
    value?: ReactNode;
  }
>;

export function RichText({
  disabled = false,
  label,
  value = "Введите текст…",
  ...props
}: RichTextProps) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span style={{ color: "var(--color-text-muted)", fontSize: 13, fontWeight: 700 }}>
        {label}
      </span>
      <span
        style={{
          alignItems: "center",
          border: "1px solid var(--color-border)",
          borderBottom: 0,
          borderRadius: "var(--radius-control) var(--radius-control) 0 0",
          display: "flex",
          gap: 6,
          padding: 8,
        }}
      >
        <b>Б</b>
        <i>К</i>
        <span aria-hidden="true">• Список</span>
      </span>
      <div
        {...props}
        aria-disabled={disabled || undefined}
        contentEditable={!disabled}
        suppressContentEditableWarning
        style={{
          background: disabled ? "var(--color-gray-1)" : "var(--color-page)",
          border: "1px solid var(--color-border)",
          borderRadius: "0 0 var(--radius-control) var(--radius-control)",
          color: disabled ? "var(--color-gray-7)" : "var(--color-brand-black)",
          minHeight: 112,
          padding: 14,
          ...props.style,
        }}
      >
        {value}
      </div>
    </label>
  );
}
