"use client"

import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { User, Bell, Shield, Palette, Globe, HelpCircle } from 'lucide-react';

export default function EnterpriseSettingsPage() {
  const settingsSections = [
    {
      title: 'Profile',
      icon: User,
      items: [
        { label: 'Personal Information', description: 'Update your name, email, and avatar' },
        { label: 'Password', description: 'Change your password' },
        { label: 'Preferences', description: 'Set your language and timezone' },
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        { label: 'Email Notifications', description: 'Configure email alerts' },
        { label: 'Push Notifications', description: 'Manage push notifications' },
        { label: 'Notification Frequency', description: 'Set how often you receive updates' },
      ]
    },
    {
      title: 'Security',
      icon: Shield,
      items: [
        { label: 'Two-Factor Authentication', description: 'Add an extra layer of security' },
        { label: 'Active Sessions', description: 'View and manage your active sessions' },
        { label: 'API Keys', description: 'Manage your API access keys' },
      ]
    },
    {
      title: 'Appearance',
      icon: Palette,
      items: [
        { label: 'Theme', description: 'Choose between light and dark mode' },
        { label: 'Accent Color', description: 'Customize your accent color' },
        { label: 'Font Size', description: 'Adjust the text size' },
      ]
    },
    {
      title: 'Regional',
      icon: Globe,
      items: [
        { label: 'Language', description: 'Select your preferred language' },
        { label: 'Time Zone', description: 'Set your local time zone' },
        { label: 'Date Format', description: 'Choose your date format' },
      ]
    },
    {
      title: 'Help & Support',
      icon: HelpCircle,
      items: [
        { label: 'Documentation', description: 'Browse our help articles' },
        { label: 'Contact Support', description: 'Get in touch with our support team' },
        { label: 'FAQ', description: 'Find answers to common questions' },
      ]
    },
  ];

  return (
    <Layout>
      <div className="p-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Settings</h1>
          <p className="text-slate-600">Manage your account settings and preferences.</p>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {settingsSections.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.title} className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Icon className="h-5 w-5 text-slate-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900">{section.title}</h3>
                </div>
                
                <div className="space-y-3">
                  {section.items.map((item) => (
                    <button
                      key={item.label}
                      className="w-full text-left p-3 rounded-lg hover:bg-slate-50 transition-colors group"
                    >
                      <div className="font-medium text-slate-900 group-hover:text-slate-700 transition-colors">
                        {item.label}
                      </div>
                      <div className="text-sm text-slate-500 mt-1">{item.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Account Actions */}
        <div className="mt-8 bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Account Actions</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
              Export Data
            </button>
            <button className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
              Deactivate Account
            </button>
            <button className="px-4 py-2 border border-red-200 text-red-700 rounded-lg hover:bg-red-50 transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
