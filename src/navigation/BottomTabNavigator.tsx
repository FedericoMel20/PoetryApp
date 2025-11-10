import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Animated, Platform, StyleSheet, Text } from 'react-native';
import DiscoverStackNavigator from '../navigation/DiscoverStackNavigator';
import HomeStackNavigator from "../navigation/HomeStackNavigator";
import ProfileScreen from '../screens/ProfileScreen';
import colors from '../theme/colors';
import FavoritesStackNavigator from "./FavoritesStackNavigator";

const Tab = createBottomTabNavigator();

function AnimatedTabIcon({
  name,
  label,
  focused,
}: {
  name: keyof typeof Ionicons.glyphMap;
  label: string;
  focused: boolean;
}) {
  const anim = React.useRef(new Animated.Value(focused ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.spring(anim, {
      toValue: focused ? 1 : 0,
      damping: 12,
      mass: 0.6,
      stiffness: 120,
      useNativeDriver: true,
    }).start();
  }, [focused]);

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -6],
  });

  const scale = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  const glowOpacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.8],
  });

  const color = focused ? colors.accent : colors.secondaryText;

  return (
    <Animated.View
      style={[
        styles.iconContainer,
        { transform: [{ translateY }, { scale }] },
      ]}
    >
      {/* Glow effect behind icon */}
      {focused && (
        <Animated.View
          style={[
            styles.glow,
            { opacity: glowOpacity, shadowColor: colors.accent },
          ]}
        />
      )}

      <Ionicons name={name} size={28} color={color} />
      <Text
        style={[
          styles.label,
          { color: focused ? colors.accent : colors.secondaryText },
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Animated.View>
  );
}

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopWidth: 0,
          height: 80,
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
            },
            android: {
              elevation: 10,
            },
          }),
        },
        tabBarShowLabel: false,
        tabBarIcon: ({ focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';
          let label = '';

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              label = 'Home';
              break;
            case 'Discover':
              iconName = 'search';
              label = 'Discover';
              break;
            case 'Bookmarks':
              iconName = 'bookmark';
              label = 'Saved';
              break;
            case 'Profile':
              iconName = 'person';
              label = 'Profile';
              break;
          }

          return (
            <AnimatedTabIcon
              name={iconName}
              label={label}
              focused={focused}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Discover" component={DiscoverStackNavigator} />
      <Tab.Screen name="Bookmarks" component={FavoritesStackNavigator} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 6,
    width: 65,
  },
  glow: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.25)', // golden aura
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  label: {
    fontSize: 10,
    marginTop: 4,
    fontWeight: '500',
    textAlign: 'center',
  },
});
