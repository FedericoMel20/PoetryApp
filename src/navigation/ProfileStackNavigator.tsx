import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CreatePoemScreen from "../screens/CreatePoemScreen";
import EditPoemScreen from "../screens/EditPoemScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import ManagePoemsScreen from "../screens/ManagePoemsScreen";
import PoemDetailScreen from "../screens/PoemDetailScreen";
import ProfileScreen from "../screens/ProfileScreen";

export type ProfileStackParamList = {
  ProfileMain: undefined;
  EditProfile: undefined;
  ManagePoems: undefined;
  CreatePoem: undefined;
  EditPoem: { poem: any };
  PoemDetail: { poem: any };
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="ManagePoems" component={ManagePoemsScreen} />
      <Stack.Screen name="CreatePoem" component={CreatePoemScreen} />
      <Stack.Screen name="EditPoem" component={EditPoemScreen} />
      <Stack.Screen name="PoemDetail" component={PoemDetailScreen} />
    </Stack.Navigator>
  );
}
