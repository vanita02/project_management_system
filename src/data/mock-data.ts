import { User, Project, Task } from '@/types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@company.com',
    avatar: 'SC',
    role: 'admin'
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    email: 'marcus.j@company.com',
    avatar: 'MJ',
    role: 'member'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.r@company.com',
    avatar: 'ER',
    role: 'member'
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david.k@company.com',
    avatar: 'DK',
    role: 'viewer'
  }
];

export const mockProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'Mobile App Redesign',
    key: 'MAR',
    description: 'Complete redesign of the mobile application interface',
    lead: mockUsers[0],
    members: [mockUsers[0], mockUsers[1], mockUsers[2]],
    status: 'active',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-03-10')
  },
  {
    id: 'proj-2',
    name: 'API Integration',
    key: 'API',
    description: 'Third-party API integration for payment processing',
    lead: mockUsers[1],
    members: [mockUsers[1], mockUsers[3]],
    status: 'active',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-03-12')
  },
  {
    id: 'proj-3',
    name: 'Database Migration',
    key: 'DBM',
    description: 'Migrate legacy database to new infrastructure',
    lead: mockUsers[2],
    members: [mockUsers[2], mockUsers[0]],
    status: 'planning',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-15')
  }
];

export const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Design new dashboard layout',
    description: 'Create mockups for the updated dashboard interface',
    status: 'in_progress',
    priority: 'high',
    type: 'task',
    assignee: mockUsers[0],
    reporter: mockUsers[1],
    project: mockProjects[0],
    dueDate: new Date('2024-03-20'),
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-03-10'),
    labels: ['design', 'ui/ux']
  },
  {
    id: 'task-2',
    title: 'Fix authentication bug',
    description: 'Users unable to login with social accounts',
    status: 'todo',
    priority: 'critical',
    type: 'bug',
    assignee: mockUsers[1],
    reporter: mockUsers[2],
    project: mockProjects[0],
    dueDate: new Date('2024-03-18'),
    createdAt: new Date('2024-03-08'),
    updatedAt: new Date('2024-03-08'),
    labels: ['bug', 'auth']
  },
  {
    id: 'task-3',
    title: 'Implement payment gateway',
    description: 'Integrate Stripe payment processing',
    status: 'review',
    priority: 'high',
    type: 'story',
    assignee: mockUsers[2],
    reporter: mockUsers[0],
    project: mockProjects[1],
    dueDate: new Date('2024-03-25'),
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-14'),
    labels: ['backend', 'integration']
  },
  {
    id: 'task-4',
    title: 'Update user documentation',
    description: 'Update API documentation with new endpoints',
    status: 'done',
    priority: 'medium',
    type: 'task',
    assignee: mockUsers[3],
    reporter: mockUsers[1],
    project: mockProjects[1],
    dueDate: new Date('2024-03-15'),
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-13'),
    labels: ['documentation']
  },
  {
    id: 'task-5',
    title: 'Database schema optimization',
    description: 'Optimize database queries for better performance',
    status: 'todo',
    priority: 'medium',
    type: 'epic',
    assignee: mockUsers[0],
    reporter: mockUsers[2],
    project: mockProjects[2],
    dueDate: new Date('2024-04-01'),
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-10'),
    labels: ['database', 'performance']
  }
];
