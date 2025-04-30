import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { theme } from '@/constants/theme';
import { getTasks, addTask, updateTask, deleteTask, completeTask } from '@/utils/storage';
import { Task, TaskFilter } from '@/types';
import TaskList from '@/components/TaskList';
import TaskFilters from '@/components/TaskFilters';
import TaskForm from '@/components/TaskForm';
import FloatingButton from '@/components/FloatingButton';
import { Platform } from 'react-native';

export default function TasksScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? theme.dark : theme.light;
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formVisible, setFormVisible] = useState(false);
  const [editTask, setEditTask] = useState<Task | undefined>(undefined);
  const [filter, setFilter] = useState<TaskFilter>({
    status: 'all',
    priority: 'all',
    search: '',
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setIsLoading(true);
    const taskData = await getTasks();
    setTasks(taskData);
    setIsLoading(false);
  };

  const handleAddTask = async (task: Task) => {
    await addTask(task);
    await loadTasks();
  };

  const handleEditTask = async (task: Task) => {
    await updateTask(task);
    await loadTasks();
  };

  const handleDeleteTask = async (id: string) => {
    await deleteTask(id);
    await loadTasks();
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    await completeTask(id, completed);
    await loadTasks();
  };

  const handleOpenForm = (task?: Task) => {
    setEditTask(task);
    setFormVisible(true);
  };

  const handleCloseForm = () => {
    setEditTask(undefined);
    setFormVisible(false);
  };

  const handleSaveTask = (task: Task) => {
    if (editTask) {
      handleEditTask(task);
    } else {
      handleAddTask(task);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <TaskFilters
        filter={filter}
        onFilterChange={setFilter}
      />
      
      <TaskList
        tasks={tasks}
        isLoading={isLoading}
        filter={filter}
        onRefresh={loadTasks}
        onToggleComplete={handleToggleComplete}
        onDelete={handleDeleteTask}
        onEdit={handleOpenForm}
      />
      
      <FloatingButton onPress={() => handleOpenForm()} />
      
      <TaskForm
        visible={formVisible}
        onClose={handleCloseForm}
        onSave={handleSaveTask}
        editTask={editTask}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 16 : 0,
  },
});