import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { theme } from '@/constants/theme';
import { AppSettings } from '@/types';
import { getSettings, saveSettings, getDefaultSettings } from '@/utils/storage';
import { ChevronRight, Moon, Sun, Bell, Trash2, RefreshCw, Info } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? theme.dark : theme.light;
  
  const [settings, setSettings] = useState<AppSettings>(getDefaultSettings());

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const data = await getSettings();
    setSettings(data);
  };

  const handleToggleShowCompleted = async (value: boolean) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    const updatedSettings = { ...settings, showCompletedTasks: value };
    setSettings(updatedSettings);
    await saveSettings(updatedSettings);
  };

  const handleToggleNotifications = async (value: boolean) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    const updatedSettings = { ...settings, notificationsEnabled: value };
    setSettings(updatedSettings);
    await saveSettings(updatedSettings);
  };

  const handleSetDefaultPriority = async (priority: 'low' | 'medium' | 'high') => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    const updatedSettings = { ...settings, defaultPriority: priority };
    setSettings(updatedSettings);
    await saveSettings(updatedSettings);
  };

  const handleResetSettings = async () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
    
    const defaultSettings = getDefaultSettings();
    setSettings(defaultSettings);
    await saveSettings(defaultSettings);
  };

  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'low': return colors.priorityLow;
      case 'medium': return colors.priorityMedium;
      case 'high': return colors.priorityHigh;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              {isDark ? (
                <Moon size={20} color={colors.textSecondary} />
              ) : (
                <Sun size={20} color={colors.textSecondary} />
              )}
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Theme
              </Text>
            </View>
            <Text style={[styles.settingValue, { color: colors.textSecondary }]}>
              {isDark ? 'Dark' : 'Light'} (System)
            </Text>
          </View>
        </View>
        
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Task Settings</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Show Completed Tasks
              </Text>
            </View>
            <Switch
              value={settings.showCompletedTasks}
              onValueChange={handleToggleShowCompleted}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : colors.surface}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <Bell size={20} color={colors.textSecondary} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Enable Notifications
              </Text>
            </View>
            <Switch
              value={settings.notificationsEnabled}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : colors.surface}
            />
          </View>
          
          <View style={[styles.settingItem, styles.settingItemColumn]}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              Default Priority
            </Text>
            <View style={styles.priorityButtons}>
              <TouchableOpacity
                style={[
                  styles.priorityButton, 
                  { 
                    backgroundColor: settings.defaultPriority === 'low' 
                      ? getPriorityColor('low') 
                      : colors.surface 
                  }
                ]}
                onPress={() => handleSetDefaultPriority('low')}
              >
                <Text 
                  style={[
                    styles.priorityButtonText, 
                    { 
                      color: settings.defaultPriority === 'low' 
                        ? '#FFFFFF' 
                        : colors.textSecondary 
                    }
                  ]}
                >
                  Low
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.priorityButton, 
                  { 
                    backgroundColor: settings.defaultPriority === 'medium' 
                      ? getPriorityColor('medium') 
                      : colors.surface 
                  }
                ]}
                onPress={() => handleSetDefaultPriority('medium')}
              >
                <Text 
                  style={[
                    styles.priorityButtonText, 
                    { 
                      color: settings.defaultPriority === 'medium' 
                        ? '#FFFFFF' 
                        : colors.textSecondary 
                    }
                  ]}
                >
                  Medium
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.priorityButton, 
                  { 
                    backgroundColor: settings.defaultPriority === 'high' 
                      ? getPriorityColor('high') 
                      : colors.surface 
                  }
                ]}
                onPress={() => handleSetDefaultPriority('high')}
              >
                <Text 
                  style={[
                    styles.priorityButtonText, 
                    { 
                      color: settings.defaultPriority === 'high' 
                        ? '#FFFFFF' 
                        : colors.textSecondary 
                    }
                  ]}
                >
                  High
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Data Management</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={handleResetSettings}
          >
            <View style={styles.settingLabelContainer}>
              <RefreshCw size={20} color={colors.textSecondary} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Reset Settings
              </Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
        
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <Info size={20} color={colors.textSecondary} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Version
              </Text>
            </View>
            <Text style={[styles.settingValue, { color: colors.textSecondary }]}>
              1.0.0
            </Text>
          </View>
        </View>
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
  content: {
    flex: 1,
  },
  section: {
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(150, 150, 150, 0.2)',
  },
  settingItemColumn: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginLeft: 8,
  },
  settingValue: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  priorityButtons: {
    flexDirection: 'row',
    marginTop: 12,
  },
  priorityButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  priorityButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
});