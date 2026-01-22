import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Image } from "expo-image";
import { useTranslation } from "react-i18next";
import { useTheme } from "../contexts/ThemeContext";
import { useSearchMovies } from "../hooks/useOphimQueries";
import { RootStackParamList } from "../types";
import { MovieItem } from "../types/ophim";
import { OPHIM_CONFIG } from "../constants/ophim";
import { spacing, borderRadius } from "../theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

type SearchScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Search"
>;

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = (SCREEN_WIDTH - spacing.md * 3) / 2;
const RECENT_SEARCH_KEY = "recent_searches";

const SearchScreen: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation<SearchScreenNavigationProp>();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [recentMovies, setRecentMovies] = useState<MovieItem[]>([]);

  // Load recent searches
  useEffect(() => {
    loadRecentSearches();
  }, []);

  const loadRecentSearches = async () => {
    try {
      const saved = await AsyncStorage.getItem(RECENT_SEARCH_KEY);
      if (saved) {
        setRecentMovies(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load search history", e);
    }
  };

  const saveRecentMovie = async (movie: MovieItem) => {
    try {
      const updated = [
        movie,
        ...recentMovies.filter((m) => m._id !== movie._id),
      ].slice(0, 10);
      setRecentMovies(updated);
      await AsyncStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save search history", e);
    }
  };

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem(RECENT_SEARCH_KEY);
      setRecentMovies([]);
    } catch (e) {
      console.error("Failed to clear search history", e);
    }
  };

  // Debounce search
  const debounceTimeout = React.useRef<NodeJS.Timeout | undefined>(undefined);

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      setDebouncedQuery(text);
    }, 300);
  };

  const { data, isLoading } = useSearchMovies({
    keyword: debouncedQuery,
  });

  const handleMoviePress = (movie: MovieItem) => {
    saveRecentMovie(movie);
    navigation.navigate("Detail", { slug: movie.slug });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const renderMovieItem = ({
    item,
    index,
  }: {
    item: MovieItem;
    index: number;
  }) => {
    const imageUrl = item.thumb_url || item.poster_url;
    const fullImageUrl = imageUrl.startsWith("http")
      ? imageUrl
      : `${OPHIM_CONFIG.CDN_IMAGE_URL}/${imageUrl}`;

    const isLeftColumn = index % 2 === 0;

    return (
      <TouchableOpacity
        style={[
          styles.movieCard,
          { backgroundColor: theme.colors.card },
          isLeftColumn ? styles.leftCard : styles.rightCard,
        ]}
        onPress={() => handleMoviePress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.posterContainer}>
          <Image
            source={{ uri: fullImageUrl }}
            style={styles.poster}
            cachePolicy="memory-disk"
            contentFit="cover"
            transition={200}
          />

          {/* Badges */}
          <View style={styles.posterOverlay}>
            <View style={styles.topBadges}>
              {item.lang && (
                <View style={styles.langBadge}>
                  <Text style={styles.badgeText}>{item.lang}</Text>
                </View>
              )}
            </View>

            <View style={styles.bottomBadges}>
              {item.quality && (
                <View style={styles.qualityBadge}>
                  <Text style={styles.badgeText}>{item.quality}</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.movieInfo}>
          <Text
            style={[styles.movieTitle, { color: theme.colors.text }]}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {item.name}
          </Text>
          <View style={styles.movieMeta}>
            <Text
              style={[
                styles.movieEpisode,
                { color: theme.colors.textSecondary },
              ]}
              numberOfLines={1}
            >
              {item.episode_current}
            </Text>
            {item.year && (
              <>
                <Text
                  style={[
                    styles.metaDot,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  •
                </Text>
                <Text
                  style={[
                    styles.movieYear,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  {item.year}
                </Text>
              </>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderRecentSection = () => {
    if (recentMovies.length === 0) return renderPlaceholderState();

    return (
      <View style={styles.recentContainer}>
        <View style={styles.recentHeader}>
          <Text style={[styles.recentTitle, { color: theme.colors.text }]}>
            Gần đây
          </Text>
          <TouchableOpacity 
            onPress={clearHistory}
            style={styles.clearHistoryButton}
          >
            <Ionicons name="trash-outline" size={16} color={theme.colors.primary} />
            <Text style={{ color: theme.colors.primary, fontWeight: "600", marginLeft: 4 }}>
              Xóa lịch sử
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={recentMovies}
          renderItem={renderMovieItem}
          keyExtractor={(item) => `recent-${item._id}`}
          numColumns={2}
          scrollEnabled={false}
          columnWrapperStyle={styles.columnWrapper}
        />
      </View>
    );
  };

  const renderPlaceholderState = () => (
    <View style={styles.emptyState}>
      <Ionicons
        name="search-outline"
        size={64}
        color={theme.colors.textSecondary}
        style={{ opacity: 0.3 }}
      />
      <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
        Tìm kiếm phim
      </Text>
      <Text
        style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}
      >
        Nhập tên phim để tìm kiếm
      </Text>
    </View>
  );

  const renderEmptyState = () => {
    if (searchQuery.length === 0) {
      return renderRecentSection();
    }

    if (searchQuery.length < 2) {
      return (
        <View style={styles.emptyState}>
          <Text
            style={[
              styles.emptySubtitle,
              { color: theme.colors.textSecondary },
            ]}
          >
            Nhập ít nhất 2 ký tự để tìm kiếm
          </Text>
        </View>
      );
    }

    if (!isLoading && data?.items.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons
            name="alert-circle-outline"
            size={64}
            color={theme.colors.textSecondary}
            style={{ opacity: 0.3 }}
          />
          <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
            Không tìm thấy kết quả
          </Text>
          <Text
            style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}
          >
            Thử tìm kiếm với từ khóa khác
          </Text>
        </View>
      );
    }

    return null;
  };


  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Header */}
      <View
        style={[styles.header, { backgroundColor: theme.colors.background }]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        <View
          style={[
            styles.searchInputContainer,
            { backgroundColor: theme.colors.card },
          ]}
        >
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Tìm phim..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={handleSearchChange}
            autoFocus
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery("");
                setDebouncedQuery("");
              }}
              style={styles.clearButton}
            >
              <Text
                style={[
                  styles.clearButtonText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                ✕
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Results */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={data?.items || []}
          renderItem={renderMovieItem}
          keyExtractor={(item) => item.slug}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={
            data?.items.length ? styles.columnWrapper : undefined
          }
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 22,
  },
  backButtonText: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "600",
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: borderRadius.medium,
    paddingHorizontal: spacing.sm,
    height: 44,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: spacing.xs,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: 44,
  },
  clearButton: {
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  clearButtonText: {
    fontSize: 18,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  movieCard: {
    width: CARD_WIDTH,
    borderRadius: borderRadius.large,
    overflow: "hidden",
    backgroundColor: "#000",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    marginBottom: spacing.sm,
  },
  leftCard: {
    marginRight: 0,
  },
  rightCard: {
    marginLeft: 0,
  },
  posterContainer: {
    position: "relative",
    width: "100%",
    aspectRatio: 2 / 3,
    backgroundColor: "#0d0d0d",
  },
  poster: {
    width: "100%",
    height: "100%",
  },
  posterOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
  },
  topBadges: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: spacing.xs,
  },
  bottomBadges: {
    padding: spacing.xs,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  qualityBadge: {
    backgroundColor: "#e50914",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  langBadge: {
    backgroundColor: "rgba(0, 200, 83, 0.95)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  movieInfo: {
    padding: spacing.sm,
    paddingBottom: spacing.sm,
  },
  movieTitle: {
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 18,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  movieMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  movieEpisode: {
    fontSize: 11,
    fontWeight: "500",
  },
  metaDot: {
    fontSize: 11,
    marginHorizontal: 4,
  },
  movieYear: {
    fontSize: 11,
    fontWeight: "500",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
  },
  recentContainer: {
    flex: 1,
  },
  recentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  clearHistoryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(229, 9, 20, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
});

export default SearchScreen;
