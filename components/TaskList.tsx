import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, View, RefreshControl, ActivityIndicator } from 'react-native';
import { Task, TaskFilter } from '@/types';
import TaskItem from './TaskItem';
import { useColorScheme } from 'react-native';
import { theme } from '@/constants/theme';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';
import { ClipboardList } from 'lucide-react-native';

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  filter: TaskFilter;
  onRefresh: () => void;
  onToggleComplete: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

const TaskList = ({
  tasks,
  isLoading,
  filter,
  onRefresh,
  onToggleComplete,
  onDelete,
  onEdit,
}: TaskListProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? theme.dark : theme.light;
  
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    filterTasks();
  }, [tasks, filter]);

  const filterTasks = () => {
    let result = [...tasks];
    
    // Filter by status
    if (filter.status === 'completed') {
      result = result.filter(task => task.completed);
    } else if (filter.status === 'active') {
      result = result.filter(task => !task.completed);
    }
    
    // Filter by priority
    if (filter.priority && filter.priority !== 'all') {
      result = result.filter(task => task.priority === filter.priority);
    }
    
    // Filter by search
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      result = result.filter(
        task => 
          task.title.toLowerCase().includes(searchLower) || 
          (task.description && task.description.toLowerCase().includes(searchLower))
      );
    }
    
    // Filter by tags
    if (filter.tags && filter.tags.length > 0) {
      result = result.filter(task => 
        task.tags && filter.tags?.some(tag => task.tags?.includes(tag))
      );
    }
    
    // Sort tasks by creation date (newest first)
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    setFilteredTasks(result);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  };

  const EmptyList = () => (
    <View style={styles.emptyContainer}>
      <ClipboardList size={64} color={colors.textTertiary} />
      <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
        {filter.search 
          ? "No tasks match your search"
          : filter.status === 'completed'
            ? "No completed tasks yet" 
            : filter.status === 'active'
              ? "No active tasks - great job!"
              : "No tasks yet - add one to get started!"}
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Animated.FlatList
      data={filteredTasks}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Animated.View
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(300)}
          layout={Layout.springify()}
        >
          <TaskItem
            task={item}
            onToggleComplete={onToggleComplete}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        </Animated.View>
      )}
      contentContainerStyle={[
        styles.listContent,
        filteredTasks.length === 0 && styles.emptyList,
      ]}
      ListEmptyComponent={EmptyList}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingVertical: 8,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    height: 300,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TaskList;