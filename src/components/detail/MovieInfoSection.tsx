import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { spacing } from "../../theme";
import { MovieDetail } from "../../types/ophim";

interface MovieInfoSectionProps {
  movie: MovieDetail;
}

const MovieInfoSection: React.FC<MovieInfoSectionProps> = ({ movie }) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const compactMeta = [
    movie.year,
    movie.lang,
    movie.episode_current,
    movie.country?.map((c) => c.name).join(", "),
  ]
    .filter(Boolean)
    .join(" | ");

  return (
    <View style={styles.movieInfo}>
      {/* Title */}
      <Text style={[styles.movieTitle, { color: theme.colors.text }]}>
        {movie.name}
      </Text>

      {/* Meta row with HD badge and Description button */}
      <View style={styles.metaRow}>
        <View style={styles.metaLeft}>
          <Text
            style={[styles.compactMeta, { color: theme.colors.textSecondary }]}
          >
            {compactMeta}
          </Text>
          {movie.quality && (
            <View style={styles.qualityBadge}>
              <Text style={styles.badgeText}>{movie.quality}</Text>
            </View>
          )}
        </View>
        {movie.content && (
          <TouchableOpacity
            style={styles.descriptionToggle}
            onPress={() => setIsExpanded(!isExpanded)}
            activeOpacity={0.7}
          >
            <Text style={[styles.toggleText, { color: theme.colors.text }]}>
              Mô tả
            </Text>
            <Text
              style={[styles.arrowIcon, { color: theme.colors.textSecondary }]}
            >
              {isExpanded ? "▼" : "▶"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Description (collapsible) */}
      {isExpanded && movie.content && (
        <Text
          style={[styles.contentText, { color: theme.colors.textSecondary }]}
        >
          {movie.content}
        </Text>
      )}

      {/* Categories - inline style like Director */}
      {movie.category && movie.category.length > 0 && (
        <View style={styles.detailRow}>
          <Text
            style={[styles.detailLabel, { color: theme.colors.textSecondary }]}
          >
            Thể loại:
          </Text>
          <View style={styles.inlineTagsContainer}>
            {movie.category.map((cat, index) => (
              <View
                key={cat._id || `cat-${index}`}
                style={[
                  styles.inlineTag,
                  { backgroundColor: theme.colors.card },
                ]}
              >
                <Text style={[styles.tagText, { color: theme.colors.text }]}>
                  {cat.name}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Director */}
      {movie.director && movie.director.length > 0 && (
        <View style={styles.detailRow}>
          <Text
            style={[styles.detailLabel, { color: theme.colors.textSecondary }]}
          >
            Đạo diễn:
          </Text>
          <Text style={[styles.detailValue, { color: theme.colors.text }]}>
            {movie.director.join(", ")}
          </Text>
        </View>
      )}

      {/* Actors */}
      {movie.actor && movie.actor.length > 0 && (
        <View style={styles.detailRow}>
          <Text
            style={[styles.detailLabel, { color: theme.colors.textSecondary }]}
          >
            Diễn viên:
          </Text>
          <Text style={[styles.detailValue, { color: theme.colors.text }]}>
            {movie.actor.join(", ")}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  movieInfo: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  movieTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: spacing.sm,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  metaLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  compactMeta: {
    fontSize: 13,
    lineHeight: 18,
  },
  qualityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#FF6B00",
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#fff",
  },
  descriptionToggle: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 4,
    gap: 4,
  },
  toggleText: {
    fontSize: 13,
    fontWeight: "600",
  },
  arrowIcon: {
    fontSize: 10,
  },
  contentText: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: spacing.sm,
    alignItems: "flex-start",
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "600",
    width: 90,
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
  },
  inlineTagsContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  inlineTag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 12,
  },
});

export default MovieInfoSection;
