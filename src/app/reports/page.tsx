"use client"

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { mockProjects, mockTasks } from '@/data/mock-data';

export default function ReportsPage() {
  const stats = {
    totalTasks: mockTasks.length,
    completedTasks: mockTasks.filter(t => t.status === 'COMPLETED').length,
    inProgressTasks: mockTasks.filter(t => t.status === 'IN_PROGRESS').length,
    totalProjects: mockProjects.length,
  };

  const completionRate = Math.round((stats.completedTasks / stats.totalTasks) * 100);

  const projectStats = mockProjects.map(project => ({
    name: project.name,
    key: project.key,
    totalTasks: 0,
    completedTasks: 0,
    completionRate: 0
  }));

  const priorityDistribution = {
    critical: mockTasks.filter(t => t.priority === 'HIGH').length,
    high: mockTasks.filter(t => t.priority === 'HIGH').length,
    medium: mockTasks.filter(t => t.priority === 'MEDIUM').length,
    low: mockTasks.filter(t => t.priority === 'LOW').length,
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Reports</h1>
          <p className="text-slate-600">Analytics and insights for your projects and tasks.</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <span className="text-sm text-slate-500">Total</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{stats.totalTasks}</div>
            <p className="text-sm text-slate-600 mt-1">Total Tasks</p>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📈</span>
              </div>
              <span className="text-sm text-slate-500">Completed</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{stats.completedTasks}</div>
            <p className="text-sm text-slate-600 mt-1">{completionRate}% completion rate</p>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⏰</span>
              </div>
              <span className="text-sm text-slate-500">In Progress</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{stats.inProgressTasks}</div>
            <p className="text-sm text-slate-600 mt-1">Tasks being worked on</p>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
              <span className="text-sm text-slate-500">Projects</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{stats.totalProjects}</div>
            <p className="text-sm text-slate-600 mt-1">Active projects</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Project Performance */}
          <div className="bg-white rounded-lg border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Project Performance</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {projectStats.map((project) => (
                  <div key={project.key}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-slate-700">
                        {project.key} - {project.name}
                      </span>
                      <span className="text-slate-500">
                        {project.completedTasks}/{project.totalTasks} ({project.completionRate}%)
                      </span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-slate-600 to-slate-800 rounded-full transition-all duration-500"
                        style={{ width: `${project.completionRate}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Priority Distribution */}
          <div className="bg-white rounded-lg border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Priority Distribution</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                      High
                    </span>
                    <span className="font-medium text-slate-700">{priorityDistribution.high}</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 rounded-full transition-all duration-500"
                      style={{ width: `${stats.totalTasks > 0 ? (priorityDistribution.high / stats.totalTasks) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                      High
                    </span>
                    <span className="font-medium text-slate-700">{priorityDistribution.high}</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500 rounded-full transition-all duration-500"
                      style={{ width: `${stats.totalTasks > 0 ? (priorityDistribution.high / stats.totalTasks) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                      Medium
                    </span>
                    <span className="font-medium text-slate-700">{priorityDistribution.medium}</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-500 rounded-full transition-all duration-500"
                      style={{ width: `${stats.totalTasks > 0 ? (priorityDistribution.medium / stats.totalTasks) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-gray-500 rounded-full"></span>
                      Low
                    </span>
                    <span className="font-medium text-slate-700">{priorityDistribution.low}</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gray-500 rounded-full transition-all duration-500"
                      style={{ width: `${stats.totalTasks > 0 ? (priorityDistribution.low / stats.totalTasks) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Task Table */}
        <div className="bg-white rounded-lg border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Recent Task Activity</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Task
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {mockTasks.slice(0, 10).map((task) => (
                  <tr key={task.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{task.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-600">
                        No project data available
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        task.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                        task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        task.priority === 'HIGH' ? 'bg-red-100 text-red-700' :
                        task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-600">
                        {new Date(task.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
