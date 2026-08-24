"use client";

import {
  cloneElement,
  isValidElement,
  useId,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";

type TooltipProps = Readonly<{
  children: ReactNode;
  content: ReactNode;
  disabled?: boolean;
  image?: Readonly<{ alt: string; src: string }>;
  placement?: "bottom" | "top";
}>;

/** Контекстная подсказка, допускающая текст и иллюстрацию. */
export function Tooltip({
  children,
  content,
  disabled = false,
  image,
  placement = "top",
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  const descriptionId = useId();
  const visible = open && !disabled;
  const trigger = isValidElement<HTMLAttributes<HTMLElement>>(children)
    ? cloneElement(children, { "aria-describedby": descriptionId })
    : children;

  return (
    <span
      onBlur={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      style={{
        display: "inline-flex",
        opacity: disabled ? 0.55 : 1,
        position: "relative",
      }}
    >
      {trigger}
      <span
        id={descriptionId}
        role="tooltip"
        style={{
          background: "var(--color-brand-black)",
          borderRadius: "var(--radius-card)",
          bottom: placement === "top" ? "calc(100% + 10px)" : "auto",
          boxShadow: "0 12px 28px rgb(45 42 38 / 24%)",
          color: "var(--color-page)",
          display: "grid",
          gap: 10,
          left: "50%",
          maxWidth: 320,
          minWidth: 200,
          opacity: visible ? 1 : 0,
          padding: 12,
          pointerEvents: "none",
          position: "absolute",
          top: placement === "bottom" ? "calc(100% + 10px)" : "auto",
          transform: "translateX(-50%)",
          transition: "opacity 160ms ease-in-out",
          visibility: visible ? "visible" : "hidden",
          zIndex: 10,
        }}
      >
        {image ? (
          <img
            alt={image.alt}
            src={image.src}
            style={{
              borderRadius: "calc(var(--radius-card) - 4px)",
              height: 120,
              objectFit: "cover",
              width: "100%",
            }}
          />
        ) : null}
        <span style={{ fontSize: 13, lineHeight: 1.45 }}>{content}</span>
      </span>
    </span>
  );
}
