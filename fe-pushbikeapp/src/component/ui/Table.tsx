// src/component/ui/Table.tsx
import type { ReactNode } from "react";

export default function Table({ children }: { children: ReactNode }) {
  return (
    <table className="w-full border-collapse border border-accent text-sm md:text-base text-textlight table-fixed">
      {children}
    </table>
  );
}
