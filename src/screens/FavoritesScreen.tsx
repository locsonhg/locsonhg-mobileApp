import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "../contexts/ThemeContext";
import { spacing, borderRadius } from "../theme";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { MovieItem } from "../types/ophim";
import { OPHIM_CONFIG } from "../constants/ophim";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const COLUMN_COUNT = 2;
const CARD_WIDTH = (SCREEN_WIDTH - spacing.md * 3) / COLUMN_COUNT;

type NavigationProp = StackNavigationProp<RootStackParamList>;

const FavoritesScreen: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [favorites, setFavorites] = useState<MovieItem[]>([]);

  // Placeholder for now - in a real app, this would load from AsyncStorage or a global state
  useEffect(() => {
    // setFavorites([]); 
  }, []);

  const renderMovieItem = ({ item }: { item: MovieItem }) => {
    const imageUrl = item.poster_url || item.thumb_url;
    const fullImageUrl = imageUrl.startsWith("http")
      ? imageUrl
      : `${OPHIM_CONFIG.CDN_IMAGE_URL}/${imageUrl}`;

    return (
      <TouchableOpacity
        style={styles.movieCard}
        onPress={() => navigation.navigate("Detail", { slug: item.slug })}
      >
        <Image
          source={{ uri: fullImageUrl }}
          style={styles.poster}
          cachePolicy="memory-disk"
          contentFit="cover"
        />
        <View style={styles.cardInfo}>
          <Text style={[styles.movieName, { color: theme.colors.text }]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={[styles.movieYear, { color: theme.colors.textSecondary }]}>
            {item.year}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={[styles.iconCircle, { backgroundColor: theme.colors.card }]}>
        <Ionicons name="heart-outline" size={60} color={theme.colors.primary} />
      </View>
      <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
        Danh sách trống
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
        Lưu phim yêu thích của bạn ở đây để xem lại bất cứ lúc nào.
      </Text>
      <TouchableOpacity
        style={[styles.exploreButton, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate("Main" as any, { screen: "Home" })}
      >
        <Text style={styles.exploreButtonText}>Khám phá ngay</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Phim yêu thích</Text>
      </View>
      
      <FlatList
        data={favorites}
        renderItem={renderMovieItem}
        keyExtractor={(item) => item._id}
        numColumns={COLUMN_COUNT}
        contentContainerStyle={[styles.listContent, favorites.length === 0 && { flex: 1 }]}
        columnWrapperStyle={favorites.length > 0 ? styles.columnWrapper : undefined}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  movieCard: {
    width: CARD_WIDTH,
    marginBottom: spacing.sm,
  },
  poster: {
    width: "100%",
    aspectRatio: 2 / 3,
    borderRadius: borderRadius.medium,
    backgroundColor: "#1a1a1a",
  },
  cardInfo: {
    marginTop: spacing.xs,
  },
  movieName: {
    fontSize: 14,
    fontWeight: "700",
  },
  movieYear: {
    fontSize: 12,
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  exploreButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.large,
  },
  exploreButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default FavoritesScreen;
