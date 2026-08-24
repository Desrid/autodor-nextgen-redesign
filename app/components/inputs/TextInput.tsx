import type { InputHTMLAttributes } from "react";

type TextInputProps = Readonly<
  InputHTMLAttributes<HTMLInputElement> & {
    error?: string;
    label: string;
  }
>;

export function TextInput({ error, label, ...props }: TextInputProps) {
  const invalid = Boolean(error) || props["aria-invalid"] === true;

  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span style={{ color: "var(--color-text-muted)", fontSize: 13, fontWeight: 700 }}>
        {label}
      </span>
      <input
        {...props}
        aria-invalid={invalid || undefined}
        style={{
          background: props.disabled ? "var(--color-gray-1)" : "var(--color-page)",
          border: `1px solid ${invalid ? "var(--color-brand-orange)" : "var(--color-border)"}`,
          borderRadius: "var(--radius-control)",
          color: props.disabled ? "var(--color-gray-7)" : "var(--color-brand-black)",
          font: "inherit",
          minHeight: 48,
          padding: "0 14px",
          ...props.style,
        }}
      />
      {error ? (
        <span style={{ color: "var(--color-brand-orange)", fontSize: 12 }}>
          {error}
        </span>
      ) : null}
    </label>
  );
}
