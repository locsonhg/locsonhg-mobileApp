import React, { useState, useEffect, useCallback } from "react";
import { StatusBar, LogBox, View, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as ExpoSplashScreen from "expo-splash-screen";
import { ThemeProvider } from "./src/contexts/ThemeContext";
import BottomTabNavigator from "./src/navigation/BottomTabNavigator";
import DetailScreen from "./src/screens/DetailScreen";
import SearchScreen from "./src/screens/SearchScreen";
import VideoPlayerScreen from "./src/screens/VideoPlayerScreen";
import SplashScreen from "./src/screens/SplashScreen";
import { RootStackParamList } from "./src/types";
import "./src/locales/i18n";

// Keep the splash screen visible while we fetch resources
ExpoSplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might cause some errors */
});

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
  const [showAnimatedSplash, setShowAnimatedSplash] = useState(true);
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need here
        // For now we just wait a bit to simulate loading
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onSplashAnimationComplete = useCallback(async () => {
    setShowAnimatedSplash(false);
  }, []);

  useEffect(() => {
    if (appIsReady) {
      // Hide the native splash screen as soon as the app is ready
      // The custom animated splash screen is already showing
      ExpoSplashScreen.hideAsync().catch(() => {});
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {showAnimatedSplash ? (
          <SplashScreen onAnimationComplete={onSplashAnimationComplete} />
        ) : (
          <>
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
                    presentation: "modal",
                  }}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </>
        )}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
