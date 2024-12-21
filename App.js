import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import HomeScreen from './src/screens/HomeScreen';

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
          options={{ headerShown: true }} // Başlık ayarları
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
