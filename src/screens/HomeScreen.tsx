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
import { Ionicons } from "@expo/vector-icons";
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
    page: 1, limit: 10, sort_field: "modified.time", sort_type: "desc",
  });
  const { data: phimLeData } = useMovieList("phim-le", {
    page: 1, limit: 10, sort_field: "modified.time", sort_type: "desc",
  });
  const { data: hoatHinhData } = useMovieList("hoat-hinh", {
    page: 1, limit: 10, sort_field: "modified.time", sort_type: "desc",
  });
  const { data: phimChieuRapData } = useMovieList("phim-chieu-rap", {
    page: 1, limit: 10, sort_field: "modified.time", sort_type: "desc",
  });
  const { data: tvShowsData } = useMovieList("tv-shows", {
    page: 1, limit: 10, sort_field: "modified.time", sort_type: "desc",
  });

  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        if (offsetY > 100 && !showStickyHeader) {
          setShowStickyHeader(true);
        } else if (offsetY <= 100 && showStickyHeader) {
          setShowStickyHeader(false);
        }
      },
    },
  );

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [-10, 0],
    extrapolate: "clamp",
  });

  const handleMoviePress = (slug: string) => {
    navigation.navigate("Detail", { slug });
  };

  const handleSearchPress = () => {
    navigation.navigate("Search");
  };

  const handleSeeAll = (category: string) => {
    // Navigate to Categories tab
    // We can't easily switch tabs and set state in another tab without a global state 
    // or passing params, but for now we'll just log
    console.log("See all:", category);
  };

  if (isLoading) return <Loading />;

  if (error || !homeData) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {t("common.error")}
        </Text>
      </View>
    );
  }

  const renderMovieSection = (title: string, movies: MovieItem[], sectionSlug?: string) => (
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
      />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Dynamic Header */}
      <Animated.View
        style={[
          styles.header,
          {
            backgroundColor: themeMode === 'dark' ? 'rgba(10, 10, 10, 0.85)' : 'rgba(255, 255, 255, 0.9)',
            opacity: headerOpacity,
            transform: [{ translateY: headerTranslateY }],
          },
        ]}
      >
        <Text style={[styles.logoText, { color: theme.colors.primary }]}>
          LOCSONHG
        </Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={[styles.headerIcon, { backgroundColor: theme.colors.card }]}
            onPress={handleSearchPress}
          >
            <Ionicons name="search" size={20} color={theme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.headerIcon, { backgroundColor: theme.colors.card }]}
            onPress={toggleTheme}
          >
            <Ionicons 
              name={themeMode === 'dark' ? "sunny" : "moon"} 
              size={20} 
              color={theme.colors.text} 
            />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Hero Section */}
        <View style={styles.heroWrapper}>
          {homeData.items && homeData.items.length > 0 && (
            <HeroCarousel
              movies={homeData.items.slice(0, 8)}
              onPressMovie={handleMoviePress}
            />
          )}
          
          {/* Logo overlay when header is hidden */}
          <View style={styles.heroOverlay}>
            <Text style={styles.heroLogoText}>
              LOCSONHG
            </Text>
            <TouchableOpacity 
              style={styles.heroSearch}
              onPress={handleSearchPress}
              activeOpacity={0.8}
            >
              <Ionicons name="search" size={20} color="#fff" />
              <Text style={styles.heroSearchPlaceholder}>Tìm kiếm phim...</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {homeData.items && homeData.items.length > 0 && (
            <>
              {renderMovieSection(
                "Phim Hot",
                homeData.items.slice(0, 10),
                "phim-moi",
              )}
            </>
          )}

          {phimBoData?.items && phimBoData.items.length > 0 && 
            renderMovieSection("Phim Bộ", phimBoData.items, "phim-bo")}

          {phimLeData?.items && phimLeData.items.length > 0 && 
            renderMovieSection("Phim Lẻ", phimLeData.items, "phim-le")}

          {hoatHinhData?.items && hoatHinhData.items.length > 0 && 
            renderMovieSection("Hoạt Hình", hoatHinhData.items, "hoat-hinh")}

          {phimChieuRapData?.items && phimChieuRapData.items.length > 0 && 
            renderMovieSection("Chiếu Rạp", phimChieuRapData.items, "phim-chieu-rap")}

          {tvShowsData?.items && tvShowsData.items.length > 0 && 
            renderMovieSection("TV Shows", tvShowsData.items, "tv-shows")}
        </View>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  logoText: {
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  headerIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroWrapper: {
    position: 'relative',
  },
  heroOverlay: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  heroLogoText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    minWidth: 150,
  },
  heroSearchPlaceholder: {
    color: '#fff',
    fontSize: 13,
    marginLeft: spacing.xs,
    fontWeight: '500',
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  content: {
    marginTop: -20, // Negative margin to overlap with hero gradient
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: spacing.md,
  },
  section: {
    marginBottom: spacing.lg,
  },
  horizontalList: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xs,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 100,
  },
});

export default HomeScreen;
