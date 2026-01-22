import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  SafeAreaView,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "../contexts/ThemeContext";
import { spacing, borderRadius } from "../theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";

const ProfileScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { theme, themeMode, toggleTheme } = useTheme();

  const isDarkMode = themeMode === "dark";

  const toggleLanguage = () => {
    const nextLang = i18n.language === "vi" ? "en" : "vi";
    i18n.changeLanguage(nextLang);
  };

  const menuItems = [
    {
      id: "history",
      title: "Lịch sử xem",
      icon: "time-outline",
      onPress: () => {},
    },
    {
      id: "favorites",
      title: "Phim yêu thích",
      icon: "heart-outline",
      onPress: () => {},
    },
    {
      id: "downloads",
      title: "Tải xuống",
      icon: "download-outline",
      onPress: () => {},
    },
  ];

  const settingsItems = [
    {
      id: "theme",
      title: "Giao diện tối",
      icon: isDarkMode ? "moon" : "sunny-outline",
      type: "switch",
      value: isDarkMode,
      onAction: toggleTheme,
    },
    {
      id: "language",
      title: "Ngôn ngữ",
      icon: "language-outline",
      type: "text",
      value: i18n.language === "vi" ? "Tiếng Việt" : "English",
      onAction: toggleLanguage,
    },
  ];

  const helpItems = [
    {
      id: "about",
      title: "Về chúng tôi",
      icon: "information-circle-outline",
    },
    {
      id: "privacy",
      title: "Chính sách bảo mật",
      icon: "shield-checkmark-outline",
    },
    {
      id: "contact",
      title: "Liên hệ hỗ trợ",
      icon: "headset-outline",
    },
  ];

  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất không?", [
      { text: "Hủy", style: "cancel" },
      { text: "Đăng xuất", style: "destructive", onPress: () => {} },
    ]);
  };

  const renderItem = (item: any) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.menuItem, { borderBottomColor: theme.colors.border }]}
      onPress={item.onPress || item.onAction}
    >
      <View style={styles.menuLeft}>
        <View style={[styles.iconContainer, { backgroundColor: theme.colors.card }]}>
          <Ionicons name={item.icon as any} size={22} color={theme.colors.primary} />
        </View>
        <Text style={[styles.menuTitle, { color: theme.colors.text }]}>{item.title}</Text>
      </View>
      {item.type === "switch" ? (
        <Switch
          value={item.value}
          onValueChange={item.onAction}
          trackColor={{ false: "#767577", true: theme.colors.primary }}
          thumbColor={"#f4f3f4"}
        />
      ) : item.type === "text" ? (
        <View style={styles.menuRight}>
          <Text style={[styles.menuValue, { color: theme.colors.textSecondary }]}>{item.value}</Text>
          <Ionicons name="chevron-forward" size={18} color={theme.colors.textSecondary} />
        </View>
      ) : (
        <Ionicons name="chevron-forward" size={18} color={theme.colors.textSecondary} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <LinearGradient
          colors={[theme.colors.primary, "transparent"]}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1.5 }}
        >
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: "https://api.dicebear.com/7.x/avataaars/svg?seed=Locsonhg" }}
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.editBadge}>
                <Ionicons name="camera" size={14} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>Locsonhg</Text>
              <View style={styles.premiumBadge}>
                <Ionicons name="star" size={12} color="#FFD700" />
                <Text style={styles.premiumText}>Thành viên Premium</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>Cá nhân</Text>
            <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
              {menuItems.map(renderItem)}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>Cài đặt ứng dụng</Text>
            <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
              {settingsItems.map(renderItem)}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>Hỗ trợ</Text>
            <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
              {helpItems.map(renderItem)}
            </View>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color={theme.colors.primary} />
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </TouchableOpacity>

          <Text style={[styles.versionText, { color: theme.colors.textSecondary }]}>
            Phiên bản 1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: spacing.xl,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 3,
    borderColor: "#fff",
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#e50914",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  userInfo: {
    marginLeft: spacing.lg,
  },
  userName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 4,
  },
  premiumBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 215, 0, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  premiumText: {
    color: "#FFD700",
    fontSize: 12,
    fontWeight: "700",
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
    letterSpacing: 1,
  },
  card: {
    borderRadius: borderRadius.large,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  menuRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  menuValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(229, 9, 20, 0.1)",
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.large,
    gap: 10,
    marginBottom: spacing.md,
  },
  logoutText: {
    color: "#e50914",
    fontSize: 16,
    fontWeight: "700",
  },
  versionText: {
    textAlign: "center",
    fontSize: 12,
    marginBottom: spacing.xl,
  },
});

export default ProfileScreen;
