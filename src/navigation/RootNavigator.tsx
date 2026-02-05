// src/navigation/RootNavigator.tsx
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import BottomTabNavigator from "./BottomTabNavigator";

export type RootStackParamList = {
  MainTabs: undefined;
  Login: undefined;
  Register: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const auth = useContext(AuthContext);
  const isUserAuthenticated = !!auth?.user;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isUserAuthenticated ? (
        // Authenticated: Show main app with all features
        <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      ) : (
        // Not authenticated: Show auth screens
        <Stack.Group>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}
