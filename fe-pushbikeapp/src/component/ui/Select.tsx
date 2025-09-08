import type { SelectHTMLAttributes, ReactNode } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  children: ReactNode;
};

export default function Select({ label, children, ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="text-sm text-textlight">{label}</label>}
      <select
        {...props}
        className="px-3 py-2 rounded-lg bg-base-dark border border-card-dark text-textlight focus:outline-none focus:ring-2 focus:ring-accent"
      >
        {children}
      </select>
    </div>
  );
}
