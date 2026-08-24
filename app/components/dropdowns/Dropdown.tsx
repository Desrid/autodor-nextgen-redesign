import type { SelectHTMLAttributes } from "react";

type DropdownProps = Readonly<
  SelectHTMLAttributes<HTMLSelectElement> & {
    label: string;
    options: readonly string[];
  }
>;

export function Dropdown({ label, options, ...props }: DropdownProps) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span style={{ color: "var(--color-text-muted)", fontSize: 13, fontWeight: 700 }}>
        {label}
      </span>
      <select
        {...props}
        style={{
          appearance: "auto",
          background: props.disabled ? "var(--color-gray-1)" : "var(--color-page)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-control)",
          color: props.disabled ? "var(--color-gray-7)" : "var(--color-brand-black)",
          font: "inherit",
          minHeight: 48,
          padding: "0 14px",
          ...props.style,
        }}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
