export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'member' | 'viewer';
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
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'critical';
  type: 'task' | 'bug' | 'story' | 'epic';
  assignee?: User;
  reporter: User;
  project: Project;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  labels: string[];
}

export interface BoardColumn {
  id: string;
  title: string;
  status: Task['status'];
  tasks: Task[];
}
