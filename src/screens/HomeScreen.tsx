import React, { useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";
import { RootStackParamList } from "../types";
import { useHome, useMovieList } from "../hooks/useOphimQueries";
import { useTheme } from "../contexts/ThemeContext";
import { spacing } from "../theme";
import Loading from "../components/Loading";
import MovieCard from "../components/MovieCard";
import SectionHeader from "../components/common/SectionHeader";
import HeroCarousel from "../components/common/HeroCarousel";
import { MovieItem } from "../types/ophim";

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Main">;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { t } = useTranslation();
  const { theme, toggleTheme, themeMode } = useTheme();
  const { data: homeData, isLoading, error } = useHome();

  // Fetch movies by categories
  const { data: phimBoData } = useMovieList("phim-bo", {
    page: 1,
    limit: 10,
    sort_field: "modified.time",
    sort_type: "desc",
  });
  const { data: phimLeData } = useMovieList("phim-le", {
    page: 1,
    limit: 10,
    sort_field: "modified.time",
    sort_type: "desc",
  });
  const { data: hoatHinhData } = useMovieList("hoat-hinh", {
    page: 1,
    limit: 10,
    sort_field: "modified.time",
    sort_type: "desc",
  });
  const { data: phimChieuRapData } = useMovieList("phim-chieu-rap", {
    page: 1,
    limit: 10,
    sort_field: "modified.time",
    sort_type: "desc",
  });
  const { data: tvShowsData } = useMovieList("tv-shows", {
    page: 1,
    limit: 10,
    sort_field: "modified.time",
    sort_type: "desc",
  });

  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(-100)).current;

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const shouldShow = offsetY > 15;

        if (shouldShow !== showStickyHeader) {
          setShowStickyHeader(shouldShow);

          Animated.parallel([
            Animated.timing(headerOpacity, {
              toValue: shouldShow ? 1 : 0,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(headerTranslateY, {
              toValue: shouldShow ? 0 : -100,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    },
  );

  const handleMoviePress = (slug: string) => {
    navigation.navigate("Detail", { slug });
  };

  const handleSearchPress = () => {
    navigation.navigate("Search");
  };

  const handleSeeAll = (category: string) => {
    // Navigate to Categories tab with specific category
    console.log("See all:", category);
    // TODO: Implement navigation to category list
  };

  if (isLoading) return <Loading />;

  if (error || !homeData) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {t("common.error")}
        </Text>
      </View>
    );
  }

  const renderMovieSection = (
    title: string,
    movies: MovieItem[],
    sectionSlug?: string,
  ) => (
    <View style={styles.section}>
      <SectionHeader
        title={title}
        onSeeAll={sectionSlug ? () => handleSeeAll(sectionSlug) : undefined}
      />
      <FlatList
        data={movies.slice(0, 10)}
        renderItem={({ item }) => (
          <MovieCard
            movie={item}
            onPress={() => handleMoviePress(item.slug)}
            variant="compact"
          />
        )}
        keyExtractor={(item) => item.slug}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
      />
    </View>
  );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Sticky Header - Animated smooth transition */}
      <Animated.View
        style={[
          styles.stickyHeader,
          {
            backgroundColor: theme.colors.background,
            opacity: headerOpacity,
            transform: [{ translateY: headerTranslateY }],
          },
        ]}
        pointerEvents={showStickyHeader ? "auto" : "none"}
      >
        <Text style={styles.logo}>LS</Text>
        <TouchableOpacity
          style={[styles.searchBar, { backgroundColor: theme.colors.card }]}
          onPress={handleSearchPress}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.searchPlaceholder,
              { color: theme.colors.textSecondary },
            ]}
          >
            🔍 Tìm phim...
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleTheme} style={styles.vipButton}>
          <Text style={styles.vipButtonText}>
            {themeMode === "light" ? "🌙" : "☀️"}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Header Overlay - On top of carousel with dark background */}
        <View style={styles.carouselWrapper}>
          {homeData.items && homeData.items.length > 0 && (
            <HeroCarousel
              movies={homeData.items.slice(0, 5)}
              onPressMovie={handleMoviePress}
            />
          )}
          {!showStickyHeader && (
            <View style={styles.headerOverlay}>
              <Text style={styles.logo}>LS</Text>
              <TouchableOpacity
                style={[
                  styles.searchBar,
                  { backgroundColor: "rgba(0, 0, 0, 0.6)" },
                ]}
                onPress={handleSearchPress}
                activeOpacity={0.7}
              >
                <Text style={styles.searchPlaceholder}>🔍 Tìm phim...</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleTheme} style={styles.vipButton}>
                <Text style={styles.vipButtonText}>
                  {themeMode === "light" ? "🌙" : "☀️"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        {/* Movie Sections */}
        {homeData.items && homeData.items.length > 0 && (
          <>
            {renderMovieSection(
              "Phim Hot",
              homeData.items.slice(0, 10),
              "phim-moi",
            )}
            {renderMovieSection(
              "Phim Mới Cập Nhật",
              homeData.items.slice(10, 20),
              "phim-moi",
            )}
          </>
        )}

        {phimBoData?.items &&
          phimBoData.items.length > 0 &&
          renderMovieSection("Phim Bộ", phimBoData.items, "phim-bo")}

        {phimLeData?.items &&
          phimLeData.items.length > 0 &&
          renderMovieSection("Phim Lẻ", phimLeData.items, "phim-le")}

        {hoatHinhData?.items &&
          hoatHinhData.items.length > 0 &&
          renderMovieSection("Phim Hoạt Hình", hoatHinhData.items, "hoat-hinh")}

        {phimChieuRapData?.items &&
          phimChieuRapData.items.length > 0 &&
          renderMovieSection(
            "Phim Chiếu Rạp",
            phimChieuRapData.items,
            "phim-chieu-rap",
          )}

        {tvShowsData?.items &&
          tvShowsData.items.length > 0 &&
          renderMovieSection("TV Shows", tvShowsData.items, "tv-shows")}
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stickyHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  carouselWrapper: {
    position: "relative",
  },
  headerOverlay: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00C853",
  },
  searchBar: {
    flex: 1,
    height: 36,
    borderRadius: 18,
    paddingHorizontal: spacing.md,
    justifyContent: "center",
  },
  searchPlaceholder: {
    fontSize: 14,
    color: "#ccc",
  },
  vipButton: {
    width: 40,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 193, 7, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  vipButtonText: {
    fontSize: 20,
  },
  scrollContent: {
    paddingBottom: spacing.lg,
  },
  section: {
    marginTop: spacing.md,
  },
  horizontalList: {
    paddingHorizontal: spacing.md,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
  },
});

export default HomeScreen;
