import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  Dimensions,
} from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";
import { RootStackParamList } from "../types";
import { useMovieDetail, useMoviesByCategory } from "../hooks/useOphimQueries";
import { useTheme } from "../contexts/ThemeContext";
import { spacing } from "../theme";
import { OPHIM_CONFIG } from "../constants/ophim";
import Loading from "../components/Loading";
import VideoPlayer from "../components/detail/VideoPlayer";
import MovieInfoSection from "../components/detail/MovieInfoSection";
import EpisodesList from "../components/detail/EpisodesList";
import TrailersVideos from "../components/detail/TrailersVideos";
import RelatedMovies from "../components/detail/RelatedMovies";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const VIDEO_HEIGHT = SCREEN_WIDTH * 0.56;
const STICKY_VIDEO_HEIGHT = SCREEN_WIDTH * 0.45; // Smaller when sticky

type DetailScreenRouteProp = RouteProp<RootStackParamList, "Detail">;
type DetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Detail"
>;

const DetailScreen: React.FC = () => {
  const route = useRoute<DetailScreenRouteProp>();
  const navigation = useNavigation<DetailScreenNavigationProp>();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { slug } = route.params;

  const [activeTab, setActiveTab] = useState<"episodes" | "info" | "related">(
    "info",
  );
  const [showFixedHeader, setShowFixedHeader] = useState(false);
  const [stickyHeaderVisible, setStickyHeaderVisible] = useState(false);
  const [selectedEpisodeIndex, setSelectedEpisodeIndex] = useState(0);
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  const { data: movieDetail, isLoading, error } = useMovieDetail(slug);

  const firstCategory: string | undefined =
    movieDetail?.item.category?.[0]?.slug;
  const { data: relatedMovies } = useMoviesByCategory(
    firstCategory || "phim-bo",
    { page: 1, limit: 12 },
  );

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setShowFixedHeader(offsetY > 200);
        setStickyHeaderVisible(offsetY > VIDEO_HEIGHT);
      },
    },
  );

  const handleEpisodePress = (episodeLink: string, episodeIndex?: number) => {
    // Update selected episode
    if (episodeIndex !== undefined) {
      setSelectedEpisodeIndex(episodeIndex);
    }
    // Don't scroll to top - let user stay at their current position
  };

  const handleMoviePress = (movieSlug: string) => {
    navigation.push("Detail", { slug: movieSlug });
  };

  if (isLoading) return <Loading />;

  if (error || !movieDetail) {
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

  const movie = movieDetail.item;
  const imageUrl = movie.poster_url?.startsWith("http")
    ? movie.poster_url
    : `${OPHIM_CONFIG.CDN_IMAGE_URL}/${movie.poster_url}`;

  const firstEpisodeLink =
    movie.episodes?.[0]?.server_data?.[0]?.link_m3u8 ||
    movie.episodes?.[0]?.server_data?.[0]?.link_embed ||
    movie.trailer_url ||
    "";

  // Prepare all episodes for video player
  const allEpisodes = movie.episodes?.[0]?.server_data || [];
  const episodes = allEpisodes.map((ep) => ({
    name: ep.name,
    slug: ep.slug,
    link_embed: ep.link_embed,
    link_m3u8: ep.link_m3u8,
  }));

  const renderTabContent = () => {
    switch (activeTab) {
      case "episodes":
        return (
          <EpisodesList
            movie={movie}
            imageUrl={imageUrl}
            onEpisodePress={handleEpisodePress}
            currentEpisodeIndex={selectedEpisodeIndex}
            isActiveTab={activeTab === "episodes"}
            parentScrollViewRef={scrollViewRef}
          />
        );

      case "info":
        return (
          <TrailersVideos
            movie={movie}
            imageUrl={imageUrl}
            onTrailerPress={handleEpisodePress}
          />
        );

      case "related":
        return (
          <RelatedMovies
            movies={relatedMovies?.items || []}
            onMoviePress={handleMoviePress}
          />
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Video Player - Always on top */}
      <View
        style={[
          styles.videoWrapper,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <VideoPlayer
          imageUrl={imageUrl}
          videoUrl={firstEpisodeLink}
          onBackPress={() => navigation.goBack()}
          episodes={episodes}
          currentEpisodeIndex={selectedEpisodeIndex}
          movieTitle={movie.name}
        />
      </View>

      {/* ScrollView with sticky tabs */}
      <Animated.ScrollView
        ref={scrollViewRef}
        style={[{ flex: 1, backgroundColor: theme.colors.background }]}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        stickyHeaderIndices={[1]}
      >
        {/* Movie Info Section */}
        <View>
          <MovieInfoSection movie={movie} />
        </View>

        {/* Tabs - Sticky */}
        <View
          style={[
            styles.tabsWrapper,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <View
            style={[styles.tabs, { borderBottomColor: theme.colors.border }]}
          >
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === "episodes" && {
                  borderBottomColor: theme.colors.primary,
                },
              ]}
              onPress={() => setActiveTab("episodes")}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color:
                      activeTab === "episodes"
                        ? "#fff"
                        : theme.colors.textSecondary,
                  },
                ]}
              >
                Danh sách
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === "info" && {
                  borderBottomColor: theme.colors.primary,
                },
              ]}
              onPress={() => setActiveTab("info")}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color:
                      activeTab === "info"
                        ? "#fff"
                        : theme.colors.textSecondary,
                  },
                ]}
              >
                Trailers & videos
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === "related" && {
                  borderBottomColor: theme.colors.primary,
                },
              ]}
              onPress={() => setActiveTab("related")}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color:
                      activeTab === "related"
                        ? "#fff"
                        : theme.colors.textSecondary,
                  },
                ]}
              >
                Liên quan
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tab Content */}
        <View>{renderTabContent()}</View>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  videoWrapper: {
    zIndex: 10,
  },
  tabsWrapper: {
    zIndex: 20,
  },
  fixedHeader: {
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
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "600",
  },
  fixedHeaderTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: spacing.sm,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 50,
  },
  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#222",
    marginHorizontal: spacing.md,
    backgroundColor: "#000",
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: "center",
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
  },
});

export default DetailScreen;
