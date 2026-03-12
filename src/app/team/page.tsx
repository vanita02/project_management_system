"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { JiraMetricCard } from "@/components/ui/JiraCard";
import { JiraButton } from "@/components/ui/JiraButton";
import { User } from "@/types";

interface UserWithTaskCount extends User {
  _count?: {
    tasks: number;
  };
}

export default function TeamPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserWithTaskCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [showAddModal, setShowAddModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messageData, setMessageData] = useState({ subject: '', message: '' });
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // Handle View Tasks button click
  const handleViewTasks = (memberId: number) => {
    router.push(`/tasks?userId=${memberId}`);
  };

  // Handle Send Message button click
  const handleSendMessage = (user: User) => {
    setSelectedUser(user);
    setMessageData({ subject: '', message: '' });
    setShowEmailModal(true);
  };

  // Handle Send Message
  const handleSendMessageSubmit = async () => {
    if (!selectedUser || !messageData.subject || !messageData.message) return;
    
    setIsSendingMessage(true);
    try {
      // Simulate sending message
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create notification for the user
      try {
        console.log("Creating notification for user:", selectedUser.id);
        const notificationResponse = await fetch("/api/notifications", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: selectedUser.id,
            title: "New Message Received",
            message: `You received a message from ${user?.name}: ${messageData.subject}`,
            fullMessage: messageData.message, // Store the full message
            senderName: user?.name, // Store sender name
            type: "MESSAGE_SENT",
            relatedId: user?.id,
          }),
        });
        
        const notificationData = await notificationResponse.json();
        console.log("Notification response:", notificationData);
        
        if (!notificationResponse.ok) {
          console.error("Failed to create notification:", notificationData);
        }
      } catch (notificationError) {
        console.error("Error creating notification:", notificationError);
      }
      
      setShowEmailModal(false);
      setSelectedUser(null);
      setMessageData({ subject: '', message: '' });
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSendingMessage(false);
    }
  };

  // Handle Add User
  const handleAddUser = async (userData: { name: string; email: string; password: string; role: string }) => {
    setIsCreating(true);
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        fetchUsers();
        setShowAddModal(false);
      }
    } catch (error) {
      console.error("Error adding user:", error);
    } finally {
      setIsCreating(false);
    }
  };

  // Handle Delete User
  const handleDeleteUser = async (userId: number) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setUsers(users.filter((u) => u.id !== userId));
        setDeleteConfirm(null);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Fetch Users
  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch("/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token && user?.role === "MANAGER") {
      fetchUsers();
    } else {
      setIsLoading(false);
    }
  }, [fetchUsers, token, user?.role]);

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== "ALL" && u.role !== roleFilter) return false;
    if (searchQuery && !u.name?.toLowerCase().includes(searchQuery.toLowerCase()) && !u.email?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: users.length,
    managers: users.filter((u) => u.role === "MANAGER").length,
    users: users.filter((u) => u.role === "USER").length,
  };

  if (user?.role !== "MANAGER") {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
          <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">Access Denied</h2>
          <p className="text-slate-600 dark:text-slate-400 text-center max-w-md">
            You don&apos;t have permission to view this page. Only managers can access team management.
          </p>
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
            <p className="text-slate-500 dark:text-slate-400 font-medium">Loading team...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Team Management</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Manage your team members</p>
        </div>
        <JiraButton variant="primary" onClick={() => setShowAddModal(true)}>
          <span className="mr-2">➕</span>
          Add User
        </JiraButton>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <JiraMetricCard
          title="Total Members"
          value={stats.total}
          icon={<span className="text-lg">👥</span>}
          color="blue"
        />
        <JiraMetricCard
          title="Managers"
          value={stats.managers}
          icon={<span className="text-lg">👔</span>}
          color="purple"
        />
        <JiraMetricCard
          title="Users"
          value={stats.users}
          icon={<span className="text-lg">👤</span>}
          color="green"
        />
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search team members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-all"
              />
            </div>
          </div>

          {/* Role Filter */}
          <div className="flex gap-2">
            {[
              { key: "ALL", label: "All" },
              { key: "MANAGER", label: "Managers" },
              { key: "USER", label: "Users" },
            ].map((item) => (
              <JiraButton
                key={item.key}
                variant={roleFilter === item.key ? "primary" : "outline"}
                size="sm"
                onClick={() => setRoleFilter(item.key)}
              >
                {item.label}
              </JiraButton>
            ))}
          </div>
        </div>
      </div>

      {/* Team Members List */}
      {filteredUsers.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-16 text-center">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No team members found</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {searchQuery || roleFilter !== "ALL"
              ? "Try adjusting your filters"
              : "Get started by adding your first team member"}
          </p>
          <JiraButton variant="primary" onClick={() => setShowAddModal(true)}>
            <span className="mr-2">➕</span>
            Add User
          </JiraButton>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredUsers.map((member) => (
            <div
              key={member.id}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 hover:shadow-md transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {member?.name?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{member?.name || 'Unknown'}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{member.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        member.role === "MANAGER"
                          ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                          : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800"
                      }`}>
                        {member.role}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Joined {new Date(member.createdAt).toLocaleDateString()}
                      </span>
                      {member._count && (
                        <span className="text-xs text-blue-600 dark:text-blue-400">
                          {member._count.tasks} tasks
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <JiraButton
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewTasks(member.id)}
                  >
                    View Tasks
                  </JiraButton>
                  <JiraButton
                    variant="outline"
                    size="sm"
                    onClick={() => handleSendMessage(member)}
                  >
                    Message
                  </JiraButton>
                  <JiraButton
                    variant="ghost"
                    size="sm"
                    className="text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20"
                    onClick={() => setDeleteConfirm(member.id)}
                  >
                    Delete
                  </JiraButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <AddUserModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddUser}
          isLoading={isCreating}
        />
      )}

      {/* Message Modal */}
      {showEmailModal && (
        <MessageModal
          user={selectedUser}
          onClose={() => setShowEmailModal(false)}
          onSend={handleSendMessageSubmit}
          isLoading={isSendingMessage}
          messageData={messageData}
          setMessageData={setMessageData}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Delete User</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <JiraButton
                variant="primary"
                className="flex-1"
                onClick={() => handleDeleteUser(deleteConfirm)}
              >
                Delete
              </JiraButton>
              <JiraButton
                variant="outline"
                className="flex-1"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </JiraButton>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

interface AddUserModalProps {
  onClose: () => void;
  onAdd: (userData: { name: string; email: string; password: string; role: string }) => void;
  isLoading: boolean;
}

function AddUserModal({ onClose, onAdd, isLoading }: AddUserModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Add New User</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            >
              <option value="USER">User</option>
              <option value="MANAGER">Manager</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <JiraButton
              type="submit"
              variant="primary"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? "Adding..." : "Add User"}
            </JiraButton>
            <JiraButton
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </JiraButton>
          </div>
        </form>
      </div>
    </div>
  );
}

interface MessageModalProps {
  user: User | null;
  onClose: () => void;
  onSend: () => void;
  isLoading: boolean;
  messageData: { subject: string; message: string };
  setMessageData: (data: { subject: string; message: string }) => void;
}

function MessageModal({ user, onClose, onSend, isLoading, messageData, setMessageData }: MessageModalProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSend();
  };

  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg w-full max-w-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Send Message</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">To: {user.name} ({user.email})</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Subject
            </label>
            <input
              type="text"
              required
              value={messageData.subject}
              onChange={(e) => setMessageData({ ...messageData, subject: e.target.value })}
              placeholder="Enter message subject"
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Message
            </label>
            <textarea
              required
              value={messageData.message}
              onChange={(e) => setMessageData({ ...messageData, message: e.target.value })}
              placeholder="Type your message here..."
              rows={6}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <JiraButton
              type="submit"
              variant="primary"
              disabled={isLoading}
              loading={isLoading}
              className="flex-1"
            >
              {isLoading ? "Sending..." : "Send Message"}
            </JiraButton>
            <JiraButton
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </JiraButton>
          </div>
        </form>
      </div>
    </div>
  );
}
