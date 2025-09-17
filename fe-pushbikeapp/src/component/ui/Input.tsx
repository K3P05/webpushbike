// src/component/ui/Input.tsx
import type { InputHTMLAttributes } from "react";

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  size?: "sm" | "md" | "lg";
};

export default function Input({
  className = "",
  size = "sm", // default small
  ...rest
}: InputProps) {
  const sizeClasses =
    size === "sm"
      ? "h-8 text-sm px-2"
      : size === "lg"
      ? "h-12 text-base px-4"
      : "h-10 text-sm px-3"; // default md

  return (
    <input
      {...rest}
      className={`w-full rounded-lg border border-border-accent bg-base-card text-text-light placeholder-text-placeholder focus:border-accent focus:ring-2 focus:ring-accent-ring outline-none transition-all ${sizeClasses} ${className}`}
    />
  );
}
