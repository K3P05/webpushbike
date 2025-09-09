import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export default function Button({ variant = "primary", className = "", ...props }: Props) {
  const base =
    "px-4 py-2 rounded-xl font-semibold transition duration-300 focus:outline-none";

  const variants = {
    primary:
      "bg-accent text-white shadow-md hover:bg-accent/80 hover:shadow-lg focus:ring-2 focus:ring-accent/60",
    secondary:
      "bg-base-dark text-textlight border border-accent/40 hover:bg-accent/20 focus:ring-2 focus:ring-accent/60",
  };

  return (
    <button
      {...props}
      className={`${base} ${variants[variant]} ${className}`}
    />
  );
}
