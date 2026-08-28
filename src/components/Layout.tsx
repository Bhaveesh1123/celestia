import { type ReactNode } from 'react';
import { Navbar } from '@/components/Navbar';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-8 animate-fade-in">{children}</main>
    </div>
  );
}
