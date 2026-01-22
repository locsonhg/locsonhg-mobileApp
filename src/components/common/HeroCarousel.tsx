import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../contexts/ThemeContext";
import { spacing, borderRadius } from "../../theme";
import { MovieItem } from "../../types/ophim";
import { OPHIM_CONFIG } from "../../constants/ophim";

interface HeroCarouselProps {
  movies: MovieItem[];
  onPressMovie: (slug: string) => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CAROUSEL_HEIGHT = SCREEN_HEIGHT * 0.55;
const AUTO_SCROLL_INTERVAL = 4000; // 4 seconds

const HeroCarousel: React.FC<HeroCarouselProps> = ({
  movies,
  onPressMovie,
}) => {
  const { theme } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const autoScrollTimer = useRef<NodeJS.Timeout | null>(null);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  // Auto scroll effect
  useEffect(() => {
    if (movies.length <= 1) return;

    autoScrollTimer.current = setInterval(() => {
      setActiveIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % movies.length;
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
        return nextIndex;
      });
    }, AUTO_SCROLL_INTERVAL);

    return () => {
      if (autoScrollTimer.current) {
        clearInterval(autoScrollTimer.current);
      }
    };
  }, [movies.length]);

  const renderItem = ({ item }: { item: MovieItem }) => {
    const imageUrl = item.poster_url || item.thumb_url;
    const fullImageUrl = imageUrl.startsWith("http")
      ? imageUrl
      : `${OPHIM_CONFIG.CDN_IMAGE_URL}/${imageUrl}`;

    return (
      <TouchableOpacity
        style={styles.slide}
        onPress={() => onPressMovie(item.slug)}
        activeOpacity={0.9}
      >
        <Image
          source={{ uri: fullImageUrl }}
          style={styles.image}
          cachePolicy="memory-disk"
          transition={300}
        />

        {/* Top Gradient Shadow - Đen đậm phía trên fade xuống trong suốt */}
        <LinearGradient
          colors={["rgba(0, 0, 0, 0.8)", "rgba(0, 0, 0, 0.4)", "transparent"]}
          style={styles.topGradient}
          pointerEvents="none"
        />

        {/* Bottom Gradient Shadow - Trong suốt fade xuống đen đậm */}
        <LinearGradient
          colors={["transparent", "rgba(0, 0, 0, 0.5)", "rgba(0, 0, 0, 0.9)"]}
          style={styles.bottomGradient}
          pointerEvents="none"
        />

        {/* Movie Info Overlay */}
        <View style={styles.overlay}>
          <View style={styles.badges}>
            {item.lang && (
              <View style={[styles.badge, styles.badgeFree]}>
                <Text style={styles.badgeText}>{item.lang}</Text>
              </View>
            )}
            {item.quality && (
              <View style={[styles.badge, styles.badgeQuality]}>
                <Text style={styles.badgeText}>{item.quality}</Text>
              </View>
            )}
          </View>
          <Text style={styles.title} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {item.episode_current}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={movies}
        renderItem={renderItem}
        keyExtractor={(item) => item.slug}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={5}
      />
      <View style={styles.pagination}>
        {movies.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor:
                  index === activeIndex
                    ? theme.colors.primary
                    : theme.colors.textSecondary,
                opacity: index === activeIndex ? 1 : 0.5,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: CAROUSEL_HEIGHT,
  },
  slide: {
    width: SCREEN_WIDTH,
    height: CAROUSEL_HEIGHT,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  topGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "35%",
  },
  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "45%",
  },
  overlay: {
    position: "absolute",
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.lg,
  },
  badges: {
    flexDirection: "row",
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeFree: {
    backgroundColor: "#00c853",
  },
  badgeQuality: {
    backgroundColor: "#ff6b00",
  },
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: spacing.xs,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    color: "#fff",
    fontSize: 14,
    opacity: 0.9,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  pagination: {
    position: "absolute",
    bottom: spacing.md,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});

export default HeroCarousel;
