"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";
import { JiraMetricCard, JiraStatusBadge, JiraPriorityBadge } from "@/components/ui/JiraCard";
import { JiraButton } from "@/components/ui/JiraButton";

interface Task {
  id: number;
  title: string;
  description: string | null;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate: string | null;
  createdAt: string;
  userId: number | null;
  user?: {
    id: number;
    name: string;
    email: string;
  } | null;
}

export default function UserDashboard() {
  const { user, token } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const stats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === "PENDING").length,
    inProgress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
    completed: tasks.filter((t) => t.status === "COMPLETED").length,
    highPriority: tasks.filter((t) => t.priority === "HIGH").length,
    overdue: tasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "COMPLETED").length,
  };

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const upcomingTasks = tasks
    .filter((t) => t.dueDate && t.status !== "COMPLETED")
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 5);

  if (!user || user.role === 'MANAGER') {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="text-center text-slate-500">
            Access denied. User dashboard only.
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[calc(100vh-120px)]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Overview of tasks assigned to you and your progress</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <JiraMetricCard
          title="Total Tasks"
          value={stats.total}
          icon={<span className="text-lg">📋</span>}
          color="blue"
        />
        <JiraMetricCard
          title="Pending"
          value={stats.pending}
          icon={<span className="text-lg">⏸</span>}
          color="yellow"
        />
        <JiraMetricCard
          title="In Progress"
          value={stats.inProgress}
          icon={<span className="text-lg">⟳</span>}
          color="blue"
        />
        <JiraMetricCard
          title="Completed"
          value={stats.completed}
          icon={<span className="text-lg">✓</span>}
          color="green"
        />
        <JiraMetricCard
          title="High Priority"
          value={stats.highPriority}
          icon={<span className="text-lg">▲</span>}
          color="red"
        />
        <JiraMetricCard
          title="Overdue"
          value={stats.overdue}
          icon={<span className="text-lg">⚠️</span>}
          color="red"
        />
      </div>

      {/* Progress and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Completion Rate */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Completion Rate</h2>
          <div className="flex items-center justify-center">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-slate-200 dark:text-slate-700"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#3b82f6"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 56 * completionRate / 100} ${2 * Math.PI * 56}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-slate-900 dark:text-white">{completionRate}%</span>
                <span className="text-sm text-slate-500 dark:text-slate-400">Complete</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/kanban">
              <JiraButton variant="outline" className="w-full justify-start">
                <span className="mr-2">📋</span>
                View Kanban Board
              </JiraButton>
            </Link>
            <Link href="/calendar">
              <JiraButton variant="outline" className="w-full justify-start">
                <span className="mr-2">📅</span>
                View Calendar
              </JiraButton>
            </Link>
          </div>
        </div>

        {/* Task Distribution */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Task Distribution</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600 dark:text-slate-400">Pending</span>
                <span className="font-medium text-yellow-600 dark:text-yellow-400">{stats.pending}</span>
              </div>
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-500 rounded-full transition-all duration-500"
                  style={{ width: `${stats.total > 0 ? (stats.pending / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600 dark:text-slate-400">In Progress</span>
                <span className="font-medium text-blue-600 dark:text-blue-400">{stats.inProgress}</span>
              </div>
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${stats.total > 0 ? (stats.inProgress / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600 dark:text-slate-400">Completed</span>
                <span className="font-medium text-green-600 dark:text-green-400">{stats.completed}</span>
              </div>
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent and Upcoming Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Tasks Assigned to You</h2>
            <Link href="/tasks" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {recentTasks.length === 0 ? (
              <p className="text-center text-slate-500 dark:text-slate-400 py-8">No tasks assigned to you yet</p>
            ) : (
              recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className={`w-2 h-2 rounded-full ${
                    task.status === "COMPLETED" ? "bg-green-500" :
                    task.status === "IN_PROGRESS" ? "bg-blue-500" : "bg-yellow-500"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-slate-900 dark:text-white truncate ${task.status === "COMPLETED" ? "line-through text-slate-400 dark:text-slate-500" : ""}`}>
                      {task.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <JiraStatusBadge status={task.status} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Upcoming Deadlines</h2>
            <Link href="/calendar" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">View Calendar</Link>
          </div>
          <div className="space-y-3">
            {upcomingTasks.length === 0 ? (
              <p className="text-center text-slate-500 dark:text-slate-400 py-8">No upcoming deadlines</p>
            ) : (
              upcomingTasks.map((task) => {
                const dueDate = new Date(task.dueDate!);
                const isOverdue = dueDate < new Date();
                const daysUntil = Math.ceil((dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

                return (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
                      isOverdue ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    }`}>
                      📅
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 dark:text-white truncate">{task.title}</p>
                      <p className={`text-xs ${isOverdue ? "text-red-600 dark:text-red-400" : "text-slate-500 dark:text-slate-400"}`}>
                        {isOverdue ? `${Math.abs(daysUntil)} days overdue` : daysUntil === 0 ? "Due today" : `${daysUntil} days left`}
                      </p>
                    </div>
                    <JiraPriorityBadge priority={task.priority} />
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
