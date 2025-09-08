import type { InputHTMLAttributes } from "react";

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  size?: "sm" | "md" | "lg";
};

export default function Input({
  className = "",
  size = "md",
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
      className={`w-full rounded-lg border border-accent/40 bg-base.card text-textlight placeholder-gray-400 focus:border-accent focus:ring-2 focus:ring-accent/60 outline-none transition-all ${sizeClasses} ${className}`}
    />
  );
}
