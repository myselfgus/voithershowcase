import React from 'react';
import { TopMenuBar } from './TopMenuBar';
import { Dock } from './Dock';
interface VoitherAppLayoutProps {
  children: React.ReactNode;
}
export function VoitherAppLayout({ children }: VoitherAppLayoutProps) {
  return (
    <div className="h-screen w-screen bg-healthos-porcelain dark:bg-healthos-ink text-healthos-ink dark:text-healthos-porcelain flex flex-col overflow-hidden">
      <TopMenuBar />
      <div className="flex-1 relative">
        {children}
      </div>
      <Dock />
    </div>
  );
}