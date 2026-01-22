import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { useTheme } from "../../contexts/ThemeContext";
import { spacing, borderRadius } from "../../theme";
import { MovieDetail } from "../../types/ophim";

interface EpisodesListProps {
  movie: MovieDetail;
  imageUrl: string;
  onEpisodePress: (episodeLink: string, episodeIndex?: number) => void;
  currentEpisodeIndex?: number;
  isActiveTab?: boolean;
  parentScrollViewRef?: React.RefObject<ScrollView | null>;
}

const EpisodesList: React.FC<EpisodesListProps> = ({
  movie,
  imageUrl,
  onEpisodePress,
  currentEpisodeIndex = 0,
  isActiveTab = true,
  parentScrollViewRef,
}) => {
  const { theme } = useTheme();
  const [selectedServer, setSelectedServer] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const containerRef = useRef<View>(null);

  // Scroll parent ScrollView to show current episode when tab becomes active
  useEffect(() => {
    if (currentEpisodeIndex !== undefined && isActiveTab && parentScrollViewRef?.current && containerRef.current) {
      const timer = setTimeout(() => {
        // Measure the container position in the parent ScrollView
        containerRef.current?.measureLayout(
          parentScrollViewRef.current as any,
          (x, y) => {
            // Calculate position to center episode in viewport
            const ITEM_HEIGHT = 122;
            const episodeOffset = ITEM_HEIGHT * currentEpisodeIndex;
            const SCREEN_HEIGHT = Dimensions.get('window').height;
            const VIDEO_HEIGHT = 225; // Video player height
            const TABS_HEIGHT = 50; // Tabs height
            
            // Center the episode in the visible area
            // Visible area starts after video + tabs
            const visibleAreaHeight = SCREEN_HEIGHT - VIDEO_HEIGHT - TABS_HEIGHT;
            const centerOffset = visibleAreaHeight / 2 - ITEM_HEIGHT / 2;
            
            // Total offset = container position + episode position - center offset
            const totalOffset = y + episodeOffset - centerOffset;
            
            parentScrollViewRef.current?.scrollTo({
              y: Math.max(0, totalOffset),
              animated: true,
            });
          },
          () => {
            // Handle layout measurement failure silently
          }
        );
      }, 300); // Reduced delay for faster response

      return () => clearTimeout(timer);
    }
  }, [currentEpisodeIndex, selectedServer, isActiveTab, parentScrollViewRef]);

  const renderEpisodeItem = ({ item, index }: { item: any; index: number }) => {
    const isCurrentEpisode = index === currentEpisodeIndex;
    
    return (
      <TouchableOpacity
        style={[
          styles.episodeItem,
          isCurrentEpisode && {
            backgroundColor: "rgba(220, 38, 38, 0.15)",
            borderWidth: 2,
            borderColor: theme.colors.primary,
          },
        ]}
        onPress={() => onEpisodePress(item.link_embed || item.link_m3u8, index)}
        activeOpacity={0.7}
      >
        <View style={styles.episodeThumbnail}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.episodeImage}
            cachePolicy="memory-disk"
          />
          <View style={[
            styles.playIconContainer,
            isCurrentEpisode && { backgroundColor: "rgba(220, 38, 38, 0.6)" },
          ]}>
            <Text style={styles.playIcon}>▶</Text>
          </View>
        </View>
        <View style={styles.episodeInfoContainer}>
          <View style={styles.episodeTitleRow}>
            <Text
              style={[
                styles.episodeTitle,
                { color: isCurrentEpisode ? theme.colors.primary : theme.colors.text },
              ]}
              numberOfLines={1}
            >
              {item.name}
            </Text>
            {isCurrentEpisode && (
              <View style={[styles.nowPlayingBadge, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.nowPlayingText}>Đang xem</Text>
              </View>
            )}
          </View>
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

  // Calculate item layout for better scroll performance
  // Each episode item has: thumbnail height (90) + padding (spacing.sm * 2) + marginBottom (spacing.md)
  // spacing.sm = 8, spacing.md = 16  
  const ITEM_HEIGHT = 90 + (8 * 2) + 16 + 4; // 122px (added 4px for border when active)
  
  const getItemLayout = (_data: any, index: number) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  });

  return (
    <View ref={containerRef} style={styles.tabContent}>
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
          ref={flatListRef}
          data={movie.episodes[selectedServer].server_data}
          renderItem={renderEpisodeItem}
          keyExtractor={(item, index) => `episode-${index}`}
          scrollEnabled={false}
          getItemLayout={getItemLayout}
          onScrollToIndexFailed={(info) => {
            // Handle scroll failure gracefully
            const wait = new Promise(resolve => setTimeout(resolve, 500));
            wait.then(() => {
              flatListRef.current?.scrollToIndex({
                index: info.index,
                animated: true,
                viewPosition: 0.5,
              });
            });
          }}
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
  episodeTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  episodeTitle: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.3,
    flex: 1,
  },
  nowPlayingBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginLeft: 8,
  },
  nowPlayingText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#fff",
  },
  episodeDuration: {
    fontSize: 13,
    fontWeight: "500",
  },
});

export default EpisodesList;
