import type { InputHTMLAttributes } from "react";

type CheckboxProps = Readonly<
  InputHTMLAttributes<HTMLInputElement> & { label: string }
>;

export function Checkbox({ label, ...props }: CheckboxProps) {
  return (
    <label
      style={{
        alignItems: "center",
        color: props.disabled ? "var(--color-gray-7)" : "var(--color-brand-black)",
        cursor: props.disabled ? "not-allowed" : "pointer",
        display: "inline-flex",
        gap: 10,
      }}
    >
      <input
        {...props}
        style={{
          accentColor: "var(--color-brand-orange)",
          height: 20,
          margin: 0,
          width: 20,
          ...props.style,
        }}
        type="checkbox"
      />
      {label}
    </label>
  );
}
