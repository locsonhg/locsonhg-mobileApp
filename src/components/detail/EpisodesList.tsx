import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
import { useTheme } from "../../contexts/ThemeContext";
import { spacing, borderRadius } from "../../theme";
import { MovieDetail } from "../../types/ophim";

interface EpisodesListProps {
  movie: MovieDetail;
  imageUrl: string;
  onEpisodePress: (episodeLink: string, episodeIndex?: number) => void;
}

const EpisodesList: React.FC<EpisodesListProps> = ({
  movie,
  imageUrl,
  onEpisodePress,
}) => {
  const { theme } = useTheme();
  const [selectedServer, setSelectedServer] = useState(0);

  const renderEpisodeItem = ({ item, index }: { item: any; index: number }) => {
    return (
      <TouchableOpacity
        style={styles.episodeItem}
        onPress={() => onEpisodePress(item.link_embed || item.link_m3u8, index)}
        activeOpacity={0.7}
      >
        <View style={styles.episodeThumbnail}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.episodeImage}
            cachePolicy="memory-disk"
          />
          <View style={styles.playIconContainer}>
            <Text style={styles.playIcon}>▶</Text>
          </View>
        </View>
        <View style={styles.episodeInfoContainer}>
          <Text
            style={[styles.episodeTitle, { color: theme.colors.text }]}
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <Text
            style={[
              styles.episodeDuration,
              { color: theme.colors.textSecondary },
            ]}
          >
            {movie.time || "46 phút/tập"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.tabContent}>
      {/* Server selector */}
      {movie.episodes && movie.episodes.length > 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.serverSelector}
        >
          {movie.episodes.map((server: any, index: number) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.serverButton,
                {
                  backgroundColor:
                    selectedServer === index
                      ? theme.colors.primary
                      : theme.colors.card,
                },
              ]}
              onPress={() => setSelectedServer(index)}
            >
              <Text
                style={[
                  styles.serverButtonText,
                  {
                    color:
                      selectedServer === index ? "#fff" : theme.colors.text,
                  },
                ]}
              >
                {server.server_name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Episodes list */}
      {movie.episodes && movie.episodes[selectedServer] && (
        <FlatList
          data={movie.episodes[selectedServer].server_data}
          renderItem={renderEpisodeItem}
          keyExtractor={(item, index) => `episode-${index}`}
          scrollEnabled={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tabContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  serverSelector: {
    marginBottom: spacing.md,
  },
  serverButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderRadius: borderRadius.medium,
    marginRight: spacing.sm,
  },
  serverButtonText: {
    fontSize: 15,
    fontWeight: "700",
  },
  episodeItem: {
    flexDirection: "row",
    marginBottom: spacing.md,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: borderRadius.medium,
    padding: spacing.sm,
  },
  episodeThumbnail: {
    width: 160,
    height: 90,
    borderRadius: borderRadius.small,
    overflow: "hidden",
    position: "relative",
    marginRight: spacing.md,
  },
  episodeImage: {
    width: "100%",
    height: "100%",
  },
  playIconContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  playIcon: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "600",
  },
  episodeInfoContainer: {
    flex: 1,
  },
  episodeTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  episodeDuration: {
    fontSize: 13,
    fontWeight: "500",
  },
});

export default EpisodesList;
