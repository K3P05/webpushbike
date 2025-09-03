import Header from './Header';
import Footer from './Footer';
import type { ReactNode } from 'react';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex font-poppins bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] text-[#DDDDDD]">
      <div className="flex flex-col flex-1 min-h-screen">
        <Header />
        <main className="flex-1 p-6">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
