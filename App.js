import { Ionicons } from "@expo/vector-icons"; // Profil simgesi için
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { TouchableOpacity } from "react-native";
import HomeScreen from "./src/screens/HomeScreen";
import ProfileScreen from "./src/screens/ProfileScreen"; // Profil sayfasını ekleyin

// Stack Navigator
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Ana Sayfa */}
        <Stack.Screen
          name="Ana Sayfa"
          component={HomeScreen}
          options={({ navigation }) => ({
            headerShown: true,
            headerRight: () => (
              <TouchableOpacity
                style={{ marginRight: 15 }}
                onPress={() => navigation.navigate("Profile")}
              >
                <Ionicons name="person-circle" size={30} color="black" />
              </TouchableOpacity>
            ),
          })}
        />
        {/* Profil Sayfası */}
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            headerShown: true,
            title: "Profil",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
