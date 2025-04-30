import { View, StyleSheet, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { CheckCircle, Home, Settings } from 'lucide-react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { theme } from '@/constants/theme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  
  // Colors based on theme
  const colors = isDark ? theme.dark : theme.light;

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          ...styles.tabBar,
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          height: Platform.OS === 'ios' ? 88 : 70,
          paddingBottom: Platform.OS === 'ios' ? insets.bottom : 10,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ color, focused }) => {
          if (route.name === 'index') {
            return <Home size={24} color={color} strokeWidth={focused ? 2.5 : 2} />;
          } else if (route.name === 'tasks') {
            return <CheckCircle size={24} color={color} strokeWidth={focused ? 2.5 : 2} />;
          } else if (route.name === 'settings') {
            return <Settings size={24} color={color} strokeWidth={focused ? 2.5 : 2} />;
          }
          return null;
        },
      })}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tasks',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    elevation: 0,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: -3,
    },
  },
  tabLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    marginTop: -4,
  },
});