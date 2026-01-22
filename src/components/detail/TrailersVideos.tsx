import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { useTheme } from "../../contexts/ThemeContext";
import { spacing } from "../../theme";
import { MovieDetail } from "../../types/ophim";

interface TrailersVideosProps {
  movie: MovieDetail;
  imageUrl: string;
  onTrailerPress: (trailerUrl: string) => void;
}

const TrailersVideos: React.FC<TrailersVideosProps> = ({
  movie,
  imageUrl,
  onTrailerPress,
}) => {
  const { theme } = useTheme();

  return (
    <View style={styles.tabContent}>
      {/* Sort dropdown */}
      <View style={styles.sortRow}>
        <Text style={[styles.sortLabel, { color: theme.colors.text }]}>
          Sắp xếp theo:
        </Text>
        <TouchableOpacity style={styles.sortButton}>
          <Text style={[styles.sortText, { color: theme.colors.text }]}>
            Cũ nhất ▼
          </Text>
        </TouchableOpacity>
      </View>

      {/* Trailer item */}
      {movie.trailer_url && (
        <TouchableOpacity
          style={styles.trailerItem}
          onPress={() => onTrailerPress(movie.trailer_url || "")}
        >
          <Image
            source={{ uri: imageUrl }}
            style={styles.trailerThumbnail}
            cachePolicy="memory-disk"
          />
          <View style={styles.trailerInfo}>
            <Text style={[styles.trailerTitle, { color: theme.colors.text }]}>
              Trailer
            </Text>
            <Text
              style={[
                styles.trailerDuration,
                { color: theme.colors.textSecondary },
              ]}
            >
              1 phút
            </Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tabContent: {
    padding: spacing.md,
  },
  sortRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  sortLabel: {
    fontSize: 14,
    marginRight: spacing.sm,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  sortText: {
    fontSize: 14,
  },
  trailerItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  trailerThumbnail: {
    width: 180,
    height: 100,
    borderRadius: 8,
    marginRight: spacing.md,
  },
  trailerInfo: {
    flex: 1,
  },
  trailerTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  trailerDuration: {
    fontSize: 13,
  },
});

export default TrailersVideos;
