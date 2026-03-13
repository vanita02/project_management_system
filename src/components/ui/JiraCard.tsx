"use client";

import { cn } from "@/lib/utils";
// import { LucideIcon } from "lucide-react";

interface JiraCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function JiraCard({ children, className, hover = true, onClick }: JiraCardProps) {
  return (
    <div
      className={cn(
        "relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm transition-all duration-200",
        hover && "hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 hover:-translate-y-px",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface JiraMetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "blue" | "green" | "yellow" | "red" | "purple" | "indigo";
  className?: string;
}

export function JiraMetricCard({ 
  title, 
  value, 
  icon, 
  trend, 
  color = "blue", 
  className 
}: JiraMetricCardProps) {
  const colorClasses = {
    blue: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    green: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
    yellow: "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
    red: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
    purple: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800",
    indigo: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800",
  };

  return (
    <JiraCard className={cn("p-4", className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
            {title}
          </p>
          <p className="text-2xl font-semibold text-slate-900 dark:text-white">
            {value}
          </p>
          {trend && (
            <div className="flex items-center mt-2 text-sm">
              <span className={cn(
                "font-medium",
                trend.isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              )}>
                {trend.isPositive ? "+" : "-"}{trend.value}%
              </span>
              <span className="text-slate-500 dark:text-slate-400 ml-1">vs last period</span>
            </div>
          )}
        </div>
        <div className={cn(
          "p-2 rounded-lg border",
          colorClasses[color]
        )}>
          {icon}
        </div>
      </div>
    </JiraCard>
  );
}

interface JiraStatusBadgeProps {
  status: string;
  className?: string;
}

export function JiraStatusBadge({ status, className }: JiraStatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status.toUpperCase()) {
      case "COMPLETED":
        return {
          color: "text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800",
          icon: "✓"
        };
      case "IN_PROGRESS":
        return {
          color: "text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800",
          icon: "⟳"
        };
      case "PENDING":
        return {
          color: "text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800",
          icon: "⏸"
        };
      default:
        return {
          color: "text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800",
          icon: "○"
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={cn(
      "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border",
      config.color,
      className
    )}>
      <span className="text-xs">{config.icon}</span>
      {status.replace("_", " ")}
    </span>
  );
}

interface JiraPriorityBadgeProps {
  priority: string;
  className?: string;
}

export function JiraPriorityBadge({ priority, className }: JiraPriorityBadgeProps) {
  const getPriorityConfig = (priority: string) => {
    switch (priority.toUpperCase()) {
      case "HIGH":
        return {
          color: "text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800",
          icon: "▲"
        };
      case "MEDIUM":
        return {
          color: "text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800",
          icon: "■"
        };
      case "LOW":
        return {
          color: "text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800",
          icon: "▼"
        };
      default:
        return {
          color: "text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800",
          icon: "○"
        };
    }
  };

  const config = getPriorityConfig(priority);

  return (
    <span className={cn(
      "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border",
      config.color,
      className
    )}>
      <span className="text-xs">{config.icon}</span>
      {priority}
    </span>
  );
}
