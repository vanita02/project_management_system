import { User, Project, Task } from '@/types';

export const mockUsers: User[] = [
  {
    id: 1,
    name: 'Sarah Chen',
    email: 'sarah.chen@company.com',
    role: 'MANAGER',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 2,
    name: 'Marcus Johnson',
    email: 'marcus.j@company.com',
    role: 'USER',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02')
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    email: 'emily.r@company.com',
    role: 'USER',
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03')
  },
  {
    id: 4,
    name: 'David Kim',
    email: 'david.k@company.com',
    role: 'USER',
    createdAt: new Date('2024-01-04'),
    updatedAt: new Date('2024-01-04')
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
    id: 1,
    title: 'Design new dashboard layout',
    description: 'Create mockups for the updated dashboard interface',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    dueDate: new Date('2024-03-20'),
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-03-10'),
    userId: 1,
    user: mockUsers[0]
  },
  {
    id: 2,
    title: 'Fix authentication bug',
    description: 'Users unable to login with social accounts',
    status: 'PENDING',
    priority: 'HIGH',
    dueDate: new Date('2024-03-18'),
    createdAt: new Date('2024-03-08'),
    updatedAt: new Date('2024-03-08'),
    userId: 2,
    user: mockUsers[1]
  },
  {
    id: 3,
    title: 'Implement payment gateway',
    description: 'Integrate Stripe payment processing',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    dueDate: new Date('2024-03-25'),
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-14'),
    userId: 2,
    user: mockUsers[1]
  },
  {
    id: 4,
    title: 'Update user documentation',
    description: 'Update API documentation with new endpoints',
    status: 'COMPLETED',
    priority: 'MEDIUM',
    dueDate: new Date('2024-03-15'),
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-13'),
    userId: 3,
    user: mockUsers[2]
  },
  {
    id: 5,
    title: 'Database schema optimization',
    description: 'Optimize database queries for better performance',
    status: 'PENDING',
    priority: 'MEDIUM',
    dueDate: new Date('2024-04-01'),
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-10'),
    userId: 1,
    user: mockUsers[0]
  }
];
