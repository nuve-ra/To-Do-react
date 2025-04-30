import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { CheckCircle, Circle, Trash, Edit, CalendarClock } from 'lucide-react-native';
import { Task } from '@/types';
import { useColorScheme } from 'react-native';
import { theme, shadows } from '@/constants/theme';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSequence, withDelay, Easing } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export default function TaskItem({ task, onToggleComplete, onDelete, onEdit }: TaskItemProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? theme.dark : theme.light;
  
  // Animation values
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const checkScale = useSharedValue(task.completed ? 1 : 0);
  
  useEffect(() => {
    checkScale.value = withTiming(task.completed ? 1 : 0, {
      duration: 300,
      easing: Easing.bezier(0.25, 1, 0.5, 1),
    });
  }, [task.completed]);

  const formattedDate = task.dueDate 
    ? new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    : null;

  const getPriorityColor = () => {
    switch (task.priority) {
      case 'high': return colors.priorityHigh;
      case 'medium': return colors.priorityMedium;
      case 'low': return colors.priorityLow;
      default: return colors.priorityMedium;
    }
  };

  const handleToggleComplete = () => {
    // Apply haptic feedback on native platforms
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Run completion animation
    if (!task.completed) {
      scale.value = withSequence(
        withTiming(0.95, { duration: 100 }),
        withTiming(1, { duration: 150 })
      );
    }
    onToggleComplete(task.id, !task.completed);
  };

  const handleDelete = () => {
    // Apply haptic feedback on native platforms
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }

    // Run delete animation
    opacity.value = withTiming(0, { duration: 300 });
    translateX.value = withTiming(100, { duration: 300 });
    
    // Wait for animation to complete before actual deletion
    setTimeout(() => onDelete(task.id), 300);
  };

  const containerStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { scale: scale.value },
        { translateX: translateX.value }
      ],
    };
  });

  const checkStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: checkScale.value }],
      opacity: checkScale.value,
    };
  });

  const titleStyle = useAnimatedStyle(() => {
    return {
      opacity: task.completed ? withTiming(0.7) : withTiming(1),
      textDecorationLine: task.completed ? 'line-through' : 'none' as any,
    };
  });

  return (
    <Animated.View style={[styles.container, containerStyle, { backgroundColor: colors.card }]}>
      <TouchableOpacity
        style={styles.checkbox}
        onPress={handleToggleComplete}
        activeOpacity={0.7}
      >
        {task.completed ? (
          <Animated.View style={checkStyle}>
            <CheckCircle size={24} color={getPriorityColor()} fill={getPriorityColor()} />
          </Animated.View>
        ) : (
          <Circle size={24} color={getPriorityColor()} />
        )}
      </TouchableOpacity>
      
      <View style={styles.contentContainer}>
        <Animated.Text style={[styles.title, titleStyle, { color: colors.text }]}>
          {task.title}
        </Animated.Text>
        
        {task.description ? (
          <Text 
            style={[styles.description, { color: colors.textSecondary }]} 
            numberOfLines={2}
          >
            {task.description}
          </Text>
        ) : null}
        
        {formattedDate && (
          <View style={styles.dateContainer}>
            <CalendarClock size={12} color={colors.textSecondary} />
            <Text style={[styles.date, { color: colors.textSecondary }]}>
              {formattedDate}
            </Text>
          </View>
        )}
        
        {task.tags && task.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {task.tags.map((tag, index) => (
              <View 
                key={index} 
                style={[styles.tag, { backgroundColor: colors.surface }]}
              >
                <Text style={[styles.tagText, { color: colors.textSecondary }]}>
                  {tag}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => onEdit(task)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Edit size={18} color={colors.primary} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={handleDelete}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Trash size={18} color={colors.error} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    ...shadows.small,
  },
  checkbox: {
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  date: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginLeft: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 6,
    marginLeft: 8,
  },
});