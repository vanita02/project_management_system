import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@taskmanager.com' },
    update: {},
    create: {
      email: 'admin@taskmanager.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'MANAGER',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  console.log('✅ Created admin user:', admin.email);

  // Create sample regular user
  const userPassword = await bcrypt.hash('user123', 12);
  const user = await prisma.user.upsert({
    where: { email: 'user@taskmanager.com' },
    update: {},
    create: {
      email: 'user@taskmanager.com',
      password: userPassword,
      name: 'Regular User',
      role: 'USER',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  console.log('✅ Created regular user:', user.email);

  // Create sample tasks
  const tasks = [
    {
      title: 'Setup project infrastructure',
      description: 'Configure development environment and tools',
      status: 'COMPLETED' as const,
      priority: 'HIGH' as const,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      userId: admin.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'Design database schema',
      description: 'Create Prisma schema and migrations',
      status: 'IN_PROGRESS' as const,
      priority: 'HIGH' as const,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      userId: admin.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'Implement authentication',
      description: 'Add JWT-based authentication system',
      status: 'PENDING' as const,
      priority: 'MEDIUM' as const,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      userId: admin.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'Create user dashboard',
      description: 'Build main dashboard interface',
      status: 'PENDING' as const,
      priority: 'MEDIUM' as const,
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      userId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'Add task management features',
      description: 'Implement CRUD operations for tasks',
      status: 'IN_PROGRESS' as const,
      priority: 'LOW' as const,
      dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
      userId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  for (const taskData of tasks) {
    await prisma.task.create({
      data: taskData,
    });
  }

  console.log('✅ Created sample tasks');

  // Create sample notifications
  const notifications = [
    {
      title: 'Welcome to Task Manager',
      message: 'Your account has been created successfully. Start managing your tasks!',
      type: 'welcome',
      userId: user.id,
      isRead: false,
      createdAt: new Date(),
    },
    {
      title: 'New task assigned',
      message: 'You have been assigned a new task: "Create user dashboard"',
      type: 'task_assigned',
      userId: user.id,
      isRead: false,
      createdAt: new Date(),
    },
    {
      title: 'Task completed',
      message: 'Task "Setup project infrastructure" has been completed',
      type: 'task_completed',
      userId: admin.id,
      isRead: false,
      createdAt: new Date(),
    },
  ];

  for (const notifData of notifications) {
    await prisma.notification.create({
      data: notifData,
    });
  }

  console.log('✅ Created sample notifications');
  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
