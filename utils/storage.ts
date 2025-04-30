import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, AppSettings } from '@/types';

const TASKS_STORAGE_KEY = '@todo_app_tasks';
const SETTINGS_STORAGE_KEY = '@todo_app_settings';

// Task storage functions
export const getTasks = async (): Promise<Task[]> => {
  try {
    const tasksJson = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
    return tasksJson ? JSON.parse(tasksJson) : [];
  } catch (error) {
    console.error('Error getting tasks', error);
    return [];
  }
};

export const saveTasks = async (tasks: Task[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks', error);
  }
};

export const addTask = async (task: Task): Promise<void> => {
  try {
    const tasks = await getTasks();
    tasks.push(task);
    await saveTasks(tasks);
  } catch (error) {
    console.error('Error adding task', error);
  }
};

export const updateTask = async (updatedTask: Task): Promise<void> => {
  try {
    const tasks = await getTasks();
    const updatedTasks = tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    );
    await saveTasks(updatedTasks);
  } catch (error) {
    console.error('Error updating task', error);
  }
};

export const deleteTask = async (taskId: string): Promise<void> => {
  try {
    const tasks = await getTasks();
    const filteredTasks = tasks.filter(task => task.id !== taskId);
    await saveTasks(filteredTasks);
  } catch (error) {
    console.error('Error deleting task', error);
  }
};

export const completeTask = async (taskId: string, completed: boolean): Promise<void> => {
  try {
    const tasks = await getTasks();
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, completed, updatedAt: new Date().toISOString() } : task
    );
    await saveTasks(updatedTasks);
  } catch (error) {
    console.error('Error completing task', error);
  }
};

// Settings storage functions
export const getDefaultSettings = (): AppSettings => ({
  showCompletedTasks: true,
  defaultPriority: 'medium',
  notificationsEnabled: true,
});

export const getSettings = async (): Promise<AppSettings> => {
  try {
    const settingsJson = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
    return settingsJson ? JSON.parse(settingsJson) : getDefaultSettings();
  } catch (error) {
    console.error('Error getting settings', error);
    return getDefaultSettings();
  }
};

export const saveSettings = async (settings: AppSettings): Promise<void> => {
  try {
    await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings', error);
  }
};