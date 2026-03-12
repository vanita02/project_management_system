"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface JiraButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link";
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export function JiraButton({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  disabled = false,
  loading = false,
  className,
  onClick,
  type = "button",
  ...props
}: JiraButtonProps) {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-sm hover:shadow-md",
    secondary: "bg-slate-600 hover:bg-slate-700 text-white focus:ring-slate-500 shadow-sm hover:shadow-md",
    outline: "border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 focus:ring-slate-500",
    ghost: "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:ring-slate-500",
    link: "text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline focus:ring-blue-500 p-0 h-auto",
  };

  const sizeClasses = {
    sm: "h-8 px-3 text-sm rounded-md",
    md: "h-10 px-4 text-sm rounded-md",
    lg: "h-12 px-6 text-base rounded-lg",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-4 h-4", 
    lg: "w-5 h-5",
  };

  const classes = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  );

  const iconElement = Icon && (
    <Icon className={cn(iconSizes[size], iconPosition === "left" ? "mr-2" : "ml-2")} />
  );

  const loadingElement = loading && (
    <svg className={cn("animate-spin", iconSizes[size], iconPosition === "left" ? "mr-2" : "ml-2")} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {iconPosition === "left" && iconElement}
      {iconPosition === "left" && loadingElement}
      {children}
      {iconPosition === "right" && loadingElement}
      {iconPosition === "right" && iconElement}
    </button>
  );
}
