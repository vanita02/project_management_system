"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { JiraMetricCard } from "@/components/ui/JiraCard";
import { JiraButton } from "@/components/ui/JiraButton";
import { Task } from "@/types";

export default function AnalyticsPage() {
  const { token } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("month");

  const fetchTasks = useCallback(async () => {
    try {
      const response = await fetch("/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setTasks(data.tasks);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [fetchTasks, token]);

  // Calculate stats
  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "COMPLETED").length,
    inProgress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
    pending: tasks.filter((t) => t.status === "PENDING").length,
    high: tasks.filter((t) => t.priority === "HIGH").length,
    medium: tasks.filter((t) => t.priority === "MEDIUM").length,
    low: tasks.filter((t) => t.priority === "LOW").length,
    overdue: tasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "COMPLETED").length,
  };

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  const productivityScore = stats.total > 0
    ? Math.round(((stats.completed * 1 + stats.inProgress * 0.5) / stats.total) * 100)
    : 0;

  // Tasks by day of week
  const tasksByDay = [0, 0, 0, 0, 0, 0, 0];
  tasks.forEach((task) => {
    const day = new Date(task.createdAt).getDay();
    tasksByDay[day]++;
  });
  const maxDayTasks = Math.max(...tasksByDay, 1);
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Recent activity
  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[calc(100vh-120px)]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Loading analytics...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Analytics</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Track your productivity and performance</p>
        </div>
        <div className="flex gap-2">
          {(["week", "month", "year"] as const).map((range) => (
            <JiraButton
              key={range}
              variant={timeRange === range ? "primary" : "outline"}
              size="sm"
              onClick={() => setTimeRange(range)}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </JiraButton>
          ))}
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <JiraMetricCard
          title="Total Tasks"
          value={stats.total}
          icon={<span className="text-lg">📋</span>}
          color="blue"
        />
        <JiraMetricCard
          title="Completion Rate"
          value={`${completionRate}%`}
          icon={<span className="text-lg">✓</span>}
          color="green"
        />
        <JiraMetricCard
          title="Productivity Score"
          value={`${productivityScore}%`}
          icon={<span className="text-lg">📈</span>}
          color="blue"
        />
        <JiraMetricCard
          title="Overdue Tasks"
          value={stats.overdue}
          icon={<span className="text-lg">⚠️</span>}
          color="red"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Status Distribution */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Status Distribution</h3>

          <div className="flex items-center justify-center mb-6">
            <div className="relative w-48 h-48">
              {/* Donut Chart */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  stroke="currentColor"
                  strokeWidth="24"
                  fill="none"
                  className="text-slate-200 dark:text-slate-700"
                />
                {stats.total > 0 && (
                  <>
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="#10b981"
                      strokeWidth="24"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 80 * (stats.completed / stats.total)} ${2 * Math.PI * 80}`}
                      strokeLinecap="round"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="#3b82f6"
                      strokeWidth="24"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 80 * (stats.inProgress / stats.total)} ${2 * Math.PI * 80}`}
                      strokeDashoffset={`${-2 * Math.PI * 80 * (stats.completed / stats.total)}`}
                      strokeLinecap="round"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="#8b5cf6"
                      strokeWidth="24"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 80 * (stats.pending / stats.total)} ${2 * Math.PI * 80}`}
                      strokeDashoffset={`${-2 * Math.PI * 80 * ((stats.completed + stats.inProgress) / stats.total)}`}
                      strokeLinecap="round"
                    />
                  </>
                )}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-slate-900 dark:text-white">{stats.total}</span>
                <span className="text-sm text-slate-500 dark:text-slate-400">Tasks</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mx-auto mb-2"></div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{stats.completed}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Completed</p>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mx-auto mb-2"></div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{stats.inProgress}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">In Progress</p>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 rounded-full bg-purple-500 mx-auto mb-2"></div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{stats.pending}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Pending</p>
            </div>
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Priority Distribution</h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  High Priority
                </span>
                <span className="font-medium text-slate-900 dark:text-white">{stats.high}</span>
              </div>
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 rounded-full transition-all duration-500"
                  style={{ width: `${stats.total > 0 ? (stats.high / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                  Medium Priority
                </span>
                <span className="font-medium text-slate-900 dark:text-white">{stats.medium}</span>
              </div>
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${stats.total > 0 ? (stats.medium / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <span className="w-3 h-3 rounded-full bg-slate-400"></span>
                  Low Priority
                </span>
                <span className="font-medium text-slate-900 dark:text-white">{stats.low}</span>
              </div>
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-slate-400 rounded-full transition-all duration-500"
                  style={{ width: `${stats.total > 0 ? (stats.low / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.high}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">High</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.medium}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Medium</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-600 dark:text-slate-400">{stats.low}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Low</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Tasks by Day</h3>

          <div className="flex items-end justify-between h-48 gap-2">
            {tasksByDay.map((count, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-blue-500 rounded-t-lg transition-all duration-500 hover:bg-blue-600"
                  style={{ height: `${(count / maxDayTasks) * 100}%`, minHeight: count > 0 ? "8px" : "0" }}
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">{dayNames[index]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Recent Activity</h3>

          <div className="space-y-3 max-h-[200px] overflow-y-auto">
            {recentTasks.length === 0 ? (
              <p className="text-center text-slate-500 dark:text-slate-400 py-4">No recent activity</p>
            ) : (
              recentTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <div className={`w-2 h-2 rounded-full ${
                    task.status === "COMPLETED" ? "bg-green-500" :
                    task.status === "IN_PROGRESS" ? "bg-blue-500" : "bg-purple-500"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{task.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
