export type UserRole = 'USER' | 'MANAGER';

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
}

export class RoleAuthorization {
  static canManageTasks(user: User): boolean {
    return user.role === 'MANAGER';
  }

  static canAssignTasks(user: User): boolean {
    return user.role === 'MANAGER';
  }

  static canViewAllTasks(user: User): boolean {
    return user.role === 'MANAGER';
  }

  static canViewAllUsers(user: User): boolean {
    return user.role === 'MANAGER';
  }

  static canManageUsers(user: User): boolean {
    return user.role === 'MANAGER';
  }

  static canEditTask(user: User, taskUserId?: number): boolean {
    // Managers can edit any task
    if (user.role === 'MANAGER') return true;
    
    // Users can only edit their own tasks
    return user.id === taskUserId;
  }

  static canDeleteTask(user: User, taskUserId?: number): boolean {
    // Managers can delete any task
    if (user.role === 'MANAGER') return true;
    
    // Users can only delete their own tasks
    return user.id === taskUserId;
  }

  static canMoveTask(user: User, taskUserId?: number): boolean {
    // Managers can move any task
    if (user.role === 'MANAGER') return true;
    
    // Users can only move their own tasks
    return user.id === taskUserId;
  }

  static getAccessibleTasks(user: User): 'all' | 'assigned' {
    return user.role === 'MANAGER' ? 'all' : 'assigned';
  }

  static canCreateTask(user: User): boolean {
    // Only managers can create tasks
    return user.role === 'MANAGER';
  }

  static canAssignTask(user: User, targetUserId?: number): boolean {
    // Only managers can assign tasks to others
    return user.role === 'MANAGER';
  }
}
