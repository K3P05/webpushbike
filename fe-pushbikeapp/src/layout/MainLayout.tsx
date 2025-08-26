import Header from './Header';
import Footer from './Footer';
import type { ReactNode } from 'react';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex">
      <div className="flex flex-col flex-1 min-h-screen bg-gray-100">
        <Header />
        <main className="flex-1 p-6">{children}</main>
        <Footer />
      </div>
    </div>
  );
}


