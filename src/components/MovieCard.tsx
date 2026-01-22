import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { useTheme } from "../contexts/ThemeContext";
import { borderRadius, spacing } from "../theme";
import { MovieItem } from "../types/ophim";
import { OPHIM_CONFIG } from "../constants/ophim";

interface MovieCardProps {
  movie: MovieItem;
  onPress: () => void;
  variant?: "default" | "compact" | "featured";
}

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onPress,
  variant = "default",
}) => {
  const { theme } = useTheme();

  // Build full image URL from CDN
  const imageUrl = movie.thumb_url || movie.poster_url;
  const fullImageUrl = imageUrl.startsWith("http")
    ? imageUrl
    : `${OPHIM_CONFIG.CDN_IMAGE_URL}/${imageUrl}`;

  return (
    <TouchableOpacity
      style={[styles.card, variant === "compact" && styles.cardCompact]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.posterContainer}>
        <Image
          source={{ uri: fullImageUrl }}
          style={styles.poster}
          cachePolicy="memory-disk"
          transition={200}
        />

        {/* Top Badges */}
        <View style={styles.topBadges}>
          {movie.lang && (
            <View style={[styles.badge, styles.badgeLang]}>
              <Text style={styles.badgeText}>{movie.lang}</Text>
            </View>
          )}
        </View>

        {/* Bottom Info */}
        <View style={styles.posterOverlay}>
          <View style={styles.bottomBadges}>
            {movie.quality && (
              <View style={[styles.badge, styles.badgeQuality]}>
                <Text style={styles.badgeText}>{movie.quality}</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <View style={styles.info}>
        <Text
          style={[styles.title, { color: theme.colors.text }]}
          numberOfLines={2}
        >
          {movie.name}
        </Text>
        <Text
          style={[styles.subtitle, { color: theme.colors.textSecondary }]}
          numberOfLines={1}
        >
          {movie.episode_current}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "48%",
    marginBottom: spacing.md,
  },
  cardCompact: {
    width: 120,
    marginRight: spacing.sm,
  },
  posterContainer: {
    position: "relative",
    borderRadius: borderRadius.medium,
    overflow: "hidden",
  },
  poster: {
    width: "100%",
    aspectRatio: 2 / 3,
  },
  topBadges: {
    position: "absolute",
    top: spacing.xs,
    left: spacing.xs,
    flexDirection: "row",
    gap: spacing.xs,
  },
  posterOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.xs,
  },
  bottomBadges: {
    flexDirection: "row",
    gap: spacing.xs,
  },
  badge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 3,
  },
  badgeLang: {
    backgroundColor: "rgba(0, 200, 83, 0.9)",
  },
  badgeQuality: {
    backgroundColor: "rgba(255, 107, 0, 0.9)",
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  info: {
    padding: spacing.xs,
  },
  title: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 11,
  },
});

export default MovieCard;
