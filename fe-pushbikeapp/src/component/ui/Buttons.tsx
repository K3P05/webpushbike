import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "success" | "warning" | "disabled";
};

export default function Button({
  variant = "primary",
  className = "",
  ...props
}: Props) {
  const base =
    "px-4 py-2 rounded-xl font-semibold transition duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-accent text-white shadow-md hover:bg-accent-hover hover:shadow-lg focus:ring-2 focus:ring-accent-ring",
    secondary:
      "bg-base-dark text-textlight border border-border-accent hover:bg-accent/20 focus:ring-2 focus:ring-accent-ring",
    success:
      "bg-green-600 text-white shadow-md hover:bg-green-700 focus:ring-2 focus:ring-green-400",
    warning:
      "bg-yellow-500 text-black shadow-md hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-400",
    disabled:
      "bg-gray-500 text-gray-200 cursor-not-allowed opacity-60",
  };

  return (
    <button
      {...props}
      className={`${base} ${variants[variant]} ${className}`}
    />
  );
}
