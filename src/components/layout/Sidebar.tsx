"use client"

import React from 'react';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  Grid3x3, 
  BarChart3, 
  Settings,
  User,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavbarProps {
  className?: string;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/projects', icon: FolderKanban },
  { name: 'Tasks', href: '/enterprise-tasks', icon: CheckSquare },
  { name: 'Boards', href: '/boards', icon: Grid3x3 },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Settings', href: '/enterprise-settings', icon: Settings },
];

export function Navbar({ className }: NavbarProps) {
  return (
    <nav className={cn("bg-white border-b border-slate-200", className)}>
      <div className="px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PM</span>
              </div>
              <span className="font-semibold text-slate-900 text-lg">TaskHub</span>
            </div>

            {/* Navigation Links */}
            <div className="hidden lg:flex items-center gap-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.name}
                    variant="ghost"
                    className="justify-start gap-2 h-9 px-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* User Profile Dropdown */}
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-slate-200 text-slate-600 text-sm">
                      SC
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-slate-900">Sarah Chen</p>
                    <p className="text-xs text-slate-500">Admin</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Help
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden border-t border-slate-200">
        <div className="px-6 py-3">
          <div className="flex items-center gap-1 overflow-x-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.name}
                  variant="ghost"
                  size="sm"
                  className="justify-start gap-2 h-8 px-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100 whitespace-nowrap"
                >
                  <Icon className="h-3 w-3" />
                  <span className="text-xs">{item.name}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
