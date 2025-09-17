import type { SelectHTMLAttributes, ReactNode } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  children: ReactNode;
};

export default function Select({
  label,
  children,
  className = "",
  ...props
}: SelectProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="text-sm text-text-light">{label}</label>}
      <select
        {...props}
        className={`h-10 px-3 rounded-lg bg-base-card border border-border-accent text-text-light focus:outline-none focus:ring-2 focus:ring-accent-ring transition-all ${className}`}
      >
        {children}
      </select>
    </div>
  );
}
