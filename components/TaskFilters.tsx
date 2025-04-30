import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { TaskFilter } from '@/types';
import { useColorScheme } from 'react-native';
import { theme } from '@/constants/theme';
import { Search, X, Filter, ArrowDownUp } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface TaskFiltersProps {
  filter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
}

const TaskFilters = ({ filter, onFilterChange }: TaskFiltersProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? theme.dark : theme.light;
  
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(filter.search || '');

  const handleStatusFilter = (status: 'all' | 'completed' | 'active') => {
    onFilterChange({ ...filter, status });
  };

  const handlePriorityFilter = (priority: 'all' | 'low' | 'medium' | 'high') => {
    onFilterChange({ ...filter, priority });
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    onFilterChange({ ...filter, search: text });
  };

  const clearSearch = () => {
    setSearchQuery('');
    onFilterChange({ ...filter, search: '' });
  };

  const getStatusButtonStyle = (status: 'all' | 'completed' | 'active') => {
    return {
      ...styles.filterButton,
      backgroundColor: filter.status === status ? colors.primary : colors.surface,
    };
  };

  const getStatusTextStyle = (status: 'all' | 'completed' | 'active') => {
    return {
      ...styles.filterButtonText,
      color: filter.status === status ? '#FFFFFF' : colors.textSecondary,
    };
  };

  const getPriorityButtonStyle = (priority: 'all' | 'low' | 'medium' | 'high') => {
    if (priority === 'all') {
      return {
        ...styles.filterButton,
        backgroundColor: filter.priority === priority ? colors.primary : colors.surface,
      };
    }
    
    return {
      ...styles.filterButton,
      backgroundColor: filter.priority === priority 
        ? colors[`priority${priority.charAt(0).toUpperCase() + priority.slice(1)}`] 
        : colors.surface,
    };
  };

  const getPriorityTextStyle = (priority: 'all' | 'low' | 'medium' | 'high') => {
    return {
      ...styles.filterButtonText,
      color: filter.priority === priority ? '#FFFFFF' : colors.textSecondary,
    };
  };

  return (
    <View style={styles.container}>
      <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Search size={20} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search tasks..."
          placeholderTextColor={colors.textTertiary}
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={clearSearch}>
            <X size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        ) : null}
      </View>
      
      <View style={styles.filterToggleContainer}>
        <TouchableOpacity
          style={[styles.filterToggle, { backgroundColor: colors.surface }]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={18} color={colors.textSecondary} />
          <Text style={[styles.filterToggleText, { color: colors.textSecondary }]}>
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {showFilters && (
        <Animated.View 
          style={styles.filtersContainer}
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
        >
          <View style={styles.filterSection}>
            <Text style={[styles.filterLabel, { color: colors.text }]}>Status</Text>
            <View style={styles.filterButtons}>
              <TouchableOpacity
                style={getStatusButtonStyle('all')}
                onPress={() => handleStatusFilter('all')}
              >
                <Text style={getStatusTextStyle('all')}>All</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={getStatusButtonStyle('active')}
                onPress={() => handleStatusFilter('active')}
              >
                <Text style={getStatusTextStyle('active')}>Active</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={getStatusButtonStyle('completed')}
                onPress={() => handleStatusFilter('completed')}
              >
                <Text style={getStatusTextStyle('completed')}>Completed</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.filterSection}>
            <Text style={[styles.filterLabel, { color: colors.text }]}>Priority</Text>
            <View style={styles.filterButtons}>
              <TouchableOpacity
                style={getPriorityButtonStyle('all')}
                onPress={() => handlePriorityFilter('all')}
              >
                <Text style={getPriorityTextStyle('all')}>All</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={getPriorityButtonStyle('low')}
                onPress={() => handlePriorityFilter('low')}
              >
                <Text style={getPriorityTextStyle('low')}>Low</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={getPriorityButtonStyle('medium')}
                onPress={() => handlePriorityFilter('medium')}
              >
                <Text style={getPriorityTextStyle('medium')}>Medium</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={getPriorityButtonStyle('high')}
                onPress={() => handlePriorityFilter('high')}
              >
                <Text style={getPriorityTextStyle('high')}>High</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    height: 48,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  filterToggleContainer: {
    marginTop: 12,
    alignItems: 'flex-start',
  },
  filterToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  filterToggleText: {
    marginLeft: 6,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  filtersContainer: {
    marginTop: 16,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  filterButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
});

export default TaskFilters;