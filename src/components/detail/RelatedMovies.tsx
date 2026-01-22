import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { useTheme } from "../../contexts/ThemeContext";
import { spacing, borderRadius } from "../../theme";
import { MovieItem } from "../../types/ophim";
import { OPHIM_CONFIG } from "../../constants/ophim";

interface RelatedMoviesProps {
  movies: MovieItem[];
  onMoviePress: (slug: string) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const HORIZONTAL_PADDING = spacing.md;
const CARD_GAP = spacing.sm;
const CARD_WIDTH = (SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - CARD_GAP) / 2;

const RelatedMovies: React.FC<RelatedMoviesProps> = ({
  movies,
  onMoviePress,
}) => {
  const { theme } = useTheme();

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
          isLeftColumn ? styles.leftCard : styles.rightCard,
        ]}
        onPress={() => onMoviePress(item.slug)}
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

          {/* Gradient Overlay */}
          <View style={styles.posterGradient}>
            {/* Top Badges */}
            <View style={styles.topBadges}>
              {item.lang && (
                <View style={styles.langBadge}>
                  <Text style={styles.badgeText}>{item.lang}</Text>
                </View>
              )}
            </View>

            {/* Bottom Info */}
            <View style={styles.bottomInfo}>
              {item.quality && (
                <View style={styles.qualityBadge}>
                  <Text style={styles.badgeText}>{item.quality}</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View
          style={[styles.movieInfo, { backgroundColor: theme.colors.card }]}
        >
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

  return (
    <View style={styles.container}>
      <FlatList
        data={movies}
        renderItem={renderMovieItem}
        keyExtractor={(item) => item.slug}
        numColumns={2}
        scrollEnabled={false}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
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
  posterGradient: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
  },
  topBadges: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: spacing.xs,
  },
  bottomInfo: {
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
    height: 65, // Fixed height for info area
  },
  movieTitle: {
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 18,
    marginBottom: 4,
    letterSpacing: -0.2,
    height: 36, // Exactly 2 lines (18 * 2)
  },
  movieMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  movieEpisode: {
    fontSize: 11,
    fontWeight: "500",
    flex: 1, // Allow taking space
  },
  metaDot: {
    fontSize: 11,
    marginHorizontal: 4,
  },
  movieYear: {
    fontSize: 11,
    fontWeight: "500",
  },
});

export default RelatedMovies;
