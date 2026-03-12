"use client"

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { mockProjects, mockTasks } from '@/data/mock-data';

export default function ProjectsPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Page Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Projects</h1>
            <p className="text-slate-600">Manage and track all your projects in one place.</p>
          </div>
          <button className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors">
            New Project
          </button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow">
              {/* Project Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg font-bold text-slate-700">{project.key}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{project.name}</h3>
                    <p className="text-sm text-slate-500">by {project.lead.name}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  project.status === 'active' ? 'bg-green-100 text-green-700' :
                  project.status === 'planning' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {project.status}
                </span>
              </div>

              {/* Project Description */}
              <p className="text-sm text-slate-600 mb-4 line-clamp-2">{project.description}</p>

              {/* Project Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-slate-900">
                    0
                  </div>
                  <p className="text-xs text-slate-500">Tasks</p>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-slate-900">
                    0
                  </div>
                  <p className="text-xs text-slate-500">Done</p>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-slate-900">{project.members.length}</div>
                  <p className="text-xs text-slate-500">Members</p>
                </div>
              </div>

              {/* Team Members */}
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {project.members.slice(0, 3).map((member, index) => (
                    <div
                      key={member.id}
                      className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-xs font-medium text-slate-600 border-2 border-white"
                    >
                      {member?.name?.split(' ').map(n => n[0]).join('') || '?'}
                    </div>
                  ))}
                  {project.members.length > 3 && (
                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-xs font-medium text-slate-500 border-2 border-white">
                      +{project.members.length - 3}
                    </div>
                  )}
                </div>
                <button className="text-sm text-slate-600 hover:text-slate-900 font-medium">
                  View Project →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
