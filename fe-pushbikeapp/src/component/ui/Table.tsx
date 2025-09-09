import type { ReactNode } from "react";

export function Table({ children }: { children: ReactNode }) {
  return (
    <table className="w-full table-fixed border-collapse border border-accent text-textlight text-sm md:text-base">
      {children}
    </table>
  );
}

export function TableHead({ children }: { children: ReactNode }) {
  return <thead className="bg-base-mid/60">{children}</thead>;
}

export function TableBody({ children }: { children: ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function TableRow({ children }: { children: ReactNode }) {
  return <tr className="h-12 hover:bg-base-light/30">{children}</tr>;
}

export function TableCell({
  children,
  className = "",
  colSpan,
}: {
  children: ReactNode;
  className?: string;
  colSpan?: number;
}) {
  return (
    <td
      colSpan={colSpan}
      className={`border border-accent p-2 align-middle ${className}`}
    >
      {children}
    </td>
  );
}

export function TableHeaderCell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <th
      className={`border border-accent p-2 text-left font-semibold ${className}`}
    >
      {children}
    </th>
  );
}
