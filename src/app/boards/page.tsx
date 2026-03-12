"use client";

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { RoleAuthorization, User } from '@/lib/authorization';
import { mockTasks } from '@/data/mock-data';
import { JiraButton } from '@/components/ui/JiraButton';
import { Task } from '@/types';

export default function BoardsPage() {
  const { user } = useAuth();
  const columns = [
    { id: 'pending', title: 'To Do', status: 'PENDING' as const },
    { id: 'in_progress', title: 'In Progress', status: 'IN_PROGRESS' as const },
    { id: 'completed', title: 'Done', status: 'COMPLETED' as const },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800';
      case 'LOW': return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800';
      default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    // Since type field doesn't exist in schema, return default color
    return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
  };

  const handleDragStart = (e: React.DragEvent, taskId: number) => {
    // Check if user has permission to move this task
    if (!user || !RoleAuthorization.canMoveTask(user as User, taskId)) {
      e.preventDefault();
      alert('You do not have permission to move this task.');
      return;
    }
    // Allow drag to continue
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault();
    
    const taskId = parseInt(e.dataTransfer.getData('text/plain'));
    
    // Check if user has permission to move this task
    if (!user || !RoleAuthorization.canMoveTask(user as User, taskId)) {
      return;
    }
    
    // Here you would typically make an API call to update the task status
    console.log(`Moving task ${taskId} to ${targetStatus}`);
    // In a real app, you'd update the task in the database
  };

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">Kanban Board</h1>
            <p className="text-slate-600 dark:text-slate-400">Visualize and manage your workflow.</p>
          </div>
          <div className="flex items-center gap-3">
            <JiraButton variant="outline">
              <span className="mr-2">🔍</span>
              Filter
            </JiraButton>
            {user?.role === "MANAGER" && (
              <JiraButton variant="primary">
                <span className="mr-2">➕</span>
                Create Task
              </JiraButton>
            )}
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex gap-6 overflow-x-auto pb-6">
          {columns.map((column) => (
            <div key={column.id} className="flex-shrink-0 w-80">
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-900 dark:text-white">{column.title}</h3>
                  <span className="text-sm text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                    {mockTasks.filter(task => task.status === column.status).length}
                  </span>
                </div>
                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>

              {/* Task Cards */}
              <div className="space-y-3 min-h-[200px]">
                {mockTasks
                  .filter(task => task.status === column.status)
                  .map((task) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, column.status)}
                      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 cursor-move hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200"
                    >
                      {/* Task Header */}
                      <div className="flex items-start justify-between mb-3">
                        <span className={`text-xs px-2 py-1 rounded font-medium ${getTypeColor('task')}`}>
                          Task
                        </span>
                        <span className={`text-xs px-2 py-1 rounded border ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>

                      {/* Task Title */}
                      <h4 className="font-medium text-slate-900 dark:text-white mb-2 line-clamp-2">{task.title}</h4>

                      {/* Task Description */}
                      {task.description && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">{task.description}</p>
                      )}

                      {/* Labels - Not available in schema, so removed */}

                      {/* Task Footer */}
                      <div className="flex items-center justify-between">
                        {/* Assignee */}
                        <div className="flex items-center gap-2">
                          {task.user ? (
                            <>
                              <div className="w-6 h-6 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center text-xs font-medium text-white">
                                {task.user?.name?.split(' ').map(n => n[0]).join('') || '?'}
                              </div>
                              <span className="text-xs text-slate-600 dark:text-slate-400">{task.user?.name || 'Unassigned'}</span>
                            </>
                          ) : (
                            <span className="text-xs text-slate-400 dark:text-slate-500">Unassigned</span>
                          )}
                        </div>

                        {/* Due Date */}
                        {task.dueDate && (
                          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(task.dueDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>

              {/* Add Task Button */}
              <button className="w-full mt-3 p-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-slate-500 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Task
              </button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
