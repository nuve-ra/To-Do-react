export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string; // ISO string
  tags?: string[];
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export type TaskFilter = {
  status?: 'all' | 'completed' | 'active';
  priority?: 'all' | 'low' | 'medium' | 'high';
  search?: string;
  tags?: string[];
};

export type ColorScheme = 'light' | 'dark' | null;

export type AppSettings = {
  showCompletedTasks: boolean;
  defaultPriority: 'low' | 'medium' | 'high';
  notificationsEnabled: boolean;
};