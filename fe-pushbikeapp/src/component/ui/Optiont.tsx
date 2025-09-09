import type { OptionHTMLAttributes, ReactNode } from "react";

type OptionProps = OptionHTMLAttributes<HTMLOptionElement> & {
  children: ReactNode;
};

export default function Option({ children, className = "", ...props }: OptionProps) {
  return (
    <option
      {...props}
      className={`bg-base-dark text-textlight ${className}`}
    >
      {children}
    </option>
  );
}
