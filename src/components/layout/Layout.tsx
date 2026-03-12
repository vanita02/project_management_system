"use client"

import React from 'react';
import { Navbar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <Navbar />
      <Header />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
