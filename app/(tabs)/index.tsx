import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, useColorScheme, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../constants/theme';
import { Task } from '../../types';
import { getTasks } from '../../utils/storage';
import TaskItem from '../../components/TaskItem';
import { ChevronRight, ThermometerSnowflake } from 'lucide-react-native';
import { router } from 'expo-router';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? theme.dark : theme.light;
  
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [highPriorityTasks, setHighPriorityTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const allTasks = await getTasks();
    
    // Get total stats
    const completed = allTasks.filter(task => task.completed).length;
    setStats({
      total: allTasks.length,
      completed,
      pending: allTasks.length - completed,
    });
    
    // Get recent tasks (last 3)
    const recent = [...allTasks]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
    setRecentTasks(recent);
    
    // Get high priority tasks (incomplete only)
    const highPriority = allTasks
      .filter(task => task.priority === 'high' && !task.completed)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
    setHighPriorityTasks(highPriority);
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    // Just trigger UI update, actual storage update happens in tasks screen
    setRecentTasks(prev => 
      prev.map(task => task.id === id ? { ...task, completed } : task)
    );
    setHighPriorityTasks(prev => 
      prev.map(task => task.id === id ? { ...task, completed } : task)
    );

    // Refresh stats
    await loadTasks();
  };

  const getCompletionPercentage = () => {
    if (stats.total === 0) return 0;
    return Math.round((stats.completed / stats.total) * 100);
  };

  const goToTasks = () => {
    router.navigate("/tasks");
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView>
        <Animated.View 
          style={styles.header}
          entering={FadeInDown.delay(100).duration(500)}
        >
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            My Tasks
          </Text>
        </Animated.View>
        
        <Animated.View 
          style={[styles.dashboardCard, { backgroundColor: colors.card }]}
          entering={FadeInUp.delay(200).duration(500)}
        >
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {stats.total}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Total
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.success }]}>
                {stats.completed}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Completed
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                {stats.pending}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Pending
              </Text>
            </View>
          </View>
          
          <View style={styles.progressSection}>
            <View style={styles.progressLabelContainer}>
              <Text style={[styles.progressLabel, { color: colors.text }]}>
                Completion Rate
              </Text>
              <Text style={[styles.progressPercentage, { color: colors.primary }]}>
                {getCompletionPercentage()}%
              </Text>
            </View>
            
            <View style={[styles.progressBackground, { backgroundColor: colors.border }]}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    backgroundColor: colors.primary,
                    width: `${getCompletionPercentage()}%`,
                  }
                ]} 
              />
            </View>
          </View>
        </Animated.View>
        
        {highPriorityTasks.length > 0 && (
          <Animated.View 
            entering={FadeInUp.delay(300).duration(500)}
          >
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                High Priority
              </Text>
              <Text style={[styles.sectionCount, { color: colors.error }]}>
                {highPriorityTasks.length}
              </Text>
            </View>
            
            {highPriorityTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onDelete={() => {}}
                onEdit={() => {}}
              />
            ))}
          </Animated.View>
        )}
        
        <Animated.View
          entering={FadeInUp.delay(400).duration(500)}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Recent Tasks
            </Text>
            <Text 
              style={[styles.viewAllButton, { color: colors.primary }]}
              onPress={goToTasks}
            >
              View All <ChevronRight size={16} color={colors.primary} />
            </Text>
          </View>
          
          {recentTasks.length > 0 ? (
            recentTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onDelete={() => {}}
                onEdit={() => {}}
              />
            ))
          ) : (
            <View style={[styles.emptyState, { backgroundColor: colors.card }]}>
              <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                No tasks yet. Add your first task!
              </Text>
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
  },
  dashboardCard: {
    margin: 16,
    borderRadius: 16,
    padding: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginTop: 4,
  },
  progressSection: {
    marginTop: 8,
  },
  progressLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  progressPercentage: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  progressBackground: {
    height: 8,
    borderRadius: 4,
  },
  progressFill: {
    height: 8,
    borderRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  sectionCount: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  viewAllButton: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyState: {
    margin: 16,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
});