export interface User {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'MANAGER';
  createdAt: Date;
  updatedAt?: Date;
}

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  fullMessage?: string | null;
  senderName?: string | null;
  type: string;
  relatedId?: number | null;
  isRead: boolean;
  createdAt: Date | string;
}

export interface Project {
  id: string;
  name: string;
  key: string;
  description: string;
  lead: User;
  members: User[];
  status: 'active' | 'archived' | 'planning';
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  user?: User;
}

export interface BoardColumn {
  id: string;
  title: string;
  status: Task['status'];
  tasks: Task[];
}
