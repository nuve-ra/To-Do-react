import React from 'react';
import { TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useColorScheme } from 'react-native';
import { theme, shadows } from '@/constants/theme';
import { Plus } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface FloatingButtonProps {
  onPress: () => void;
}

const FloatingButton = ({ onPress }: FloatingButtonProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? theme.dark : theme.light;
  
  const scale = useSharedValue(1);
  
  const handlePress = () => {
    // Apply haptic feedback on native platforms
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    // Animate button press
    scale.value = withSpring(0.9, { damping: 10, stiffness: 300 });
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 10, stiffness: 300 });
    }, 100);
    
    onPress();
  };
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });
  
  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }, shadows.medium]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Plus size={26} color="#FFFFFF" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FloatingButton;