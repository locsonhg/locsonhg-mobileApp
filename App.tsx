import React from "react";
import { StatusBar, LogBox } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./src/contexts/ThemeContext";
import BottomTabNavigator from "./src/navigation/BottomTabNavigator";
import DetailScreen from "./src/screens/DetailScreen";
import SearchScreen from "./src/screens/SearchScreen";
import VideoPlayerScreen from "./src/screens/VideoPlayerScreen";
import { RootStackParamList } from "./src/types";
import "./src/locales/i18n";

// Ignore common Expo SDK warnings
LogBox.ignoreLogs(["Could not access feature flag", "[runtime not ready]"]);

const Stack = createStackNavigator<RootStackParamList>();
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Main"
            screenOptions={{
              headerStyle: {
                backgroundColor: "#1f1f1f",
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontWeight: "bold",
              },
            }}
          >
            <Stack.Screen
              name="Main"
              component={BottomTabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Detail"
              component={DetailScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Search"
              component={SearchScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="VideoPlayer"
              component={VideoPlayerScreen}
              options={{
                headerShown: false,
                presentation: "fullScreenModal",
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
