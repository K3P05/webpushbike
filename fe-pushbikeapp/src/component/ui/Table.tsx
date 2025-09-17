import type { ReactNode } from "react";

export function Table({ children }: { children: ReactNode }) {
  return (
    <table className="w-full table-fixed border-collapse border border-border-accent text-text-light text-sm md:text-base">
      {children}
    </table>
  );
}

export function TableHeader({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <thead className={`bg-base-mid/60 ${className}`}>{children}</thead>;
}

export function TableBody({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <tbody className={className}>{children}</tbody>;
}

export function TableRow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <tr className={`h-12 hover:bg-base-light/30 ${className}`}>
      {children}
    </tr>
  );
}

export function TableHead({
  children,
  className = "",
  colSpan,
}: {
  children: ReactNode;
  className?: string;
  colSpan?: number;
}) {
  return (
    <th
      colSpan={colSpan}
      className={`border border-border-accent p-2 text-left font-semibold ${className}`}
    >
      {children}
    </th>
  );
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
      className={`border border-border-accent p-2 align-middle ${className}`}
    >
      {children}
    </td>
  );
}
