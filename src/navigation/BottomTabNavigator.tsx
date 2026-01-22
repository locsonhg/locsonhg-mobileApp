import React from "react";
import { Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTranslation } from "react-i18next";
import { useTheme } from "../contexts/ThemeContext";

// Screens
import CategoriesScreen from "../screens/CategoriesScreen";
import SearchScreen from "../screens/SearchScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import ProfileScreen from "../screens/ProfileScreen";
import HomeScreen from "@/screens/HomeScreen";

// Icons (using simple text for now, can replace with icon library later)
const HomeIcon = () => <Text>🏠</Text>;
const CategoryIcon = () => <Text>🎬</Text>;
const SearchIcon = () => <Text>🔍</Text>;
const HeartIcon = () => <Text>❤️</Text>;
const ProfileIcon = () => <Text>👤</Text>;

export type BottomTabParamList = {
  Home: undefined;
  Categories: undefined;
  Search: undefined;
  Favorites: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabNavigator: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: t("tabs.home"),
          tabBarIcon: HomeIcon,
        }}
      />
      <Tab.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{
          tabBarLabel: t("tabs.categories"),
          tabBarIcon: CategoryIcon,
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarLabel: t("tabs.search"),
          tabBarIcon: SearchIcon,
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarLabel: t("tabs.favorites"),
          tabBarIcon: HeartIcon,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: t("tabs.profile"),
          tabBarIcon: ProfileIcon,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
