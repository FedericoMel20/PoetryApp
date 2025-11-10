// src/navigation/RootNavigator.tsx
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import BottomTabNavigator from "./BottomTabNavigator";
export type RootStackParamList = {
  MainTabs: undefined;
  
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* The bottom tab navigator owns each tab (which themselves can be stack navigators) */}
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
    </Stack.Navigator>
  );
}
