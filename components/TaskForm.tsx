import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Task } from '@/types';
import { useColorScheme } from 'react-native';
import { theme } from '@/constants/theme';
import { XCircle, Tag, CalendarClock } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface TaskFormProps {
  visible: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  editTask?: Task;
}

const TaskForm = ({ visible, onClose, onSave, editTask }: TaskFormProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? theme.dark : theme.light;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState<string | undefined>(undefined);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  // Reset form when modal opens/closes or editTask changes
  useEffect(() => {
    if (visible) {
      if (editTask) {
        setTitle(editTask.title);
        setDescription(editTask.description || '');
        setPriority(editTask.priority);
        setDueDate(editTask.dueDate);
        setTags(editTask.tags || []);
      } else {
        resetForm();
      }
    }
  }, [visible, editTask]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate(undefined);
    setTags([]);
    setNewTag('');
  };

  const handleSave = () => {
    if (!title.trim()) return;

    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    const now = new Date().toISOString();
    const updatedTask: Task = {
      id: editTask?.id || Date.now().toString(),
      title: title.trim(),
      description: description.trim() || undefined,
      completed: editTask?.completed || false,
      priority,
      dueDate,
      tags: tags.length > 0 ? tags : undefined,
      createdAt: editTask?.createdAt || now,
      updatedAt: now,
    };

    onSave(updatedTask);
    onClose();
    resetForm();
  };

  const handleAddTag = () => {
    if (!newTag.trim() || tags.includes(newTag.trim())) {
      setNewTag('');
      return;
    }

    setTags([...tags, newTag.trim()]);
    setNewTag('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const getPriorityButtonStyle = (buttonPriority: 'low' | 'medium' | 'high') => {
    const isSelected = priority === buttonPriority;
    return {
      ...styles.priorityButton,
      backgroundColor: isSelected ? colors[`priority${buttonPriority.charAt(0).toUpperCase() + buttonPriority.slice(1)}`] : colors.surface,
    };
  };

  const getPriorityTextStyle = (buttonPriority: 'low' | 'medium' | 'high') => {
    const isSelected = priority === buttonPriority;
    return {
      ...styles.priorityButtonText,
      color: isSelected ? '#FFFFFF' : colors.textSecondary,
    };
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={[styles.modalOverlay, { backgroundColor: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.3)' }]}>
          <View style={[styles.modalContainer, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {editTask ? 'Edit Task' : 'New Task'}
              </Text>
              <TouchableOpacity onPress={onClose}>
                <XCircle size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Title</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                  placeholder="Task title"
                  placeholderTextColor={colors.textTertiary}
                  value={title}
                  onChangeText={setTitle}
                  autoFocus
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Description</Text>
                <TextInput
                  style={[styles.textArea, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                  placeholder="Add details about your task..."
                  placeholderTextColor={colors.textTertiary}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Priority</Text>
                <View style={styles.priorityButtons}>
                  <TouchableOpacity
                    style={getPriorityButtonStyle('low')}
                    onPress={() => setPriority('low')}
                  >
                    <Text style={getPriorityTextStyle('low')}>Low</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={getPriorityButtonStyle('medium')}
                    onPress={() => setPriority('medium')}
                  >
                    <Text style={getPriorityTextStyle('medium')}>Medium</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={getPriorityButtonStyle('high')}
                    onPress={() => setPriority('high')}
                  >
                    <Text style={getPriorityTextStyle('high')}>High</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.formGroup}>
                <View style={styles.labelRow}>
                  <Text style={[styles.label, { color: colors.text }]}>Tags</Text>
                  <Tag size={16} color={colors.textSecondary} />
                </View>
                <View style={styles.tagInputContainer}>
                  <TextInput
                    style={[styles.tagInput, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                    placeholder="Add a tag..."
                    placeholderTextColor={colors.textTertiary}
                    value={newTag}
                    onChangeText={setNewTag}
                    onSubmitEditing={handleAddTag}
                    returnKeyType="done"
                  />
                  <TouchableOpacity
                    style={[styles.addTagButton, { backgroundColor: colors.primary }]}
                    onPress={handleAddTag}
                  >
                    <Text style={styles.addTagButtonText}>Add</Text>
                  </TouchableOpacity>
                </View>
                
                {tags.length > 0 && (
                  <View style={styles.tagsContainer}>
                    {tags.map((tag, index) => (
                      <View
                        key={index}
                        style={[styles.tag, { backgroundColor: colors.surface }]}
                      >
                        <Text style={[styles.tagText, { color: colors.textSecondary }]}>
                          {tag}
                        </Text>
                        <TouchableOpacity
                          onPress={() => handleRemoveTag(tag)}
                          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                          <XCircle size={16} color={colors.textSecondary} />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.cancelButton, { backgroundColor: colors.surface }]}
                onPress={onClose}
              >
                <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: colors.primary }]}
                onPress={handleSave}
                disabled={!title.trim()}
              >
                <Text style={styles.saveButtonText}>
                  {editTask ? 'Update' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
  },
  modalContent: {
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  textArea: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    height: 100,
  },
  priorityButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  priorityButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagInput: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  addTagButton: {
    marginLeft: 8,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addTagButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginRight: 6,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  cancelButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  saveButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
});

export default TaskForm;