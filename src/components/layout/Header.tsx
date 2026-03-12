"use client"

import React from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { mockProjects } from '@/data/mock-data';

export function Header() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      {/* Left Section - Project Switcher & Search */}
      <div className="flex items-center gap-4 flex-1">
        {/* Project Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="justify-between gap-2 w-64">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
                  {mockProjects[0].key}
                </span>
                <span className="truncate">{mockProjects[0].name}</span>
              </div>
              <ChevronDown className="h-4 w-4 shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80">
            <DropdownMenuLabel>Projects</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {mockProjects.map((project) => (
              <DropdownMenuItem key={project.id} className="flex items-center gap-3 p-3">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
                      {project.key}
                    </span>
                    <span className="font-medium">{project.name}</span>
                  </div>
                  <span className="text-xs text-slate-500">{project.description}</span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Search Bar */}
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks, projects, or team members..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Right Section - Notifications */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-slate-600" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </Button>
      </div>
    </header>
  );
}
