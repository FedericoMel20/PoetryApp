import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import CreatePoemScreen from "../screens/CreatePoemScreen";
import PoemDetailScreen from "../screens/PoemDetailScreen";
import ProfileScreen from "../screens/ProfileScreen";

export type ProfileStackParamList = {
  ProfileMain: undefined;
  ManagePoems: undefined;
  CreatePoem: undefined;
  EditPoem: { poem: any };
  PoemDetail: { poem: any };
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ManagePoems" component={require('../screens/ManagePoemsScreen').default} options={{ title: 'Manage Poems' }} />
      <Stack.Screen name="CreatePoem" component={CreatePoemScreen} options={{ title: 'Write Poem' }} />
      <Stack.Screen name="EditPoem" component={require('../screens/EditPoemScreen').default} options={{ title: 'Edit Poem' }} />
      <Stack.Screen name="PoemDetail" component={PoemDetailScreen} />
    </Stack.Navigator>
  );
}
