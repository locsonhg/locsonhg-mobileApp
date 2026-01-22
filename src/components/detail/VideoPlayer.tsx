import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { spacing } from "../../theme";
import CustomVideoPlayer from "../common/CustomVideoPlayer";

interface VideoPlayerProps {
  imageUrl: string;
  videoUrl: string;
  onBackPress: () => void;
  episodes?: Array<{ name: string; slug: string; link_embed: string; link_m3u8: string }>;
  currentEpisodeIndex?: number;
  movieTitle?: string;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const VIDEO_HEIGHT = SCREEN_WIDTH * 0.56;

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  imageUrl,
  videoUrl,
  onBackPress,
  episodes = [],
  currentEpisodeIndex = 0,
  movieTitle = "",
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(currentEpisodeIndex);
  const [currentVideoUrl, setCurrentVideoUrl] = useState(videoUrl);

  // Update when episode changes from parent
  useEffect(() => {
    setCurrentIndex(currentEpisodeIndex);
    if (episodes.length > 0 && episodes[currentEpisodeIndex]) {
      setCurrentVideoUrl(episodes[currentEpisodeIndex].link_m3u8 || episodes[currentEpisodeIndex].link_embed);
      setIsPlaying(true); // Auto play when episode changes
    }
  }, [currentEpisodeIndex, episodes]);

  const handlePlayPress = () => {
    setIsPlaying(true);
  };

  const handleClose = () => {
    setIsPlaying(false);
  };

  const handleNextEpisode = () => {
    if (currentIndex < episodes.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setCurrentVideoUrl(episodes[nextIndex].link_m3u8 || episodes[nextIndex].link_embed);
    }
  };

  const handlePreviousEpisode = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setCurrentVideoUrl(episodes[prevIndex].link_m3u8 || episodes[prevIndex].link_embed);
    }
  };

  const hasNextEpisode =
    episodes.length > 0 && currentIndex < episodes.length - 1;
  const hasPreviousEpisode = episodes.length > 0 && currentIndex > 0;

  const currentEpisodeName = episodes[currentIndex]?.name || "";
  const displayTitle =
    episodes.length > 0 && currentEpisodeName
      ? `${movieTitle} - ${currentEpisodeName}`
      : movieTitle;

  if (isPlaying) {
    return (
      <View style={styles.videoContainer}>
        <CustomVideoPlayer
          videoUrl={currentVideoUrl}
          onClose={handleClose}
          onNextEpisode={hasNextEpisode ? handleNextEpisode : undefined}
          onPreviousEpisode={
            hasPreviousEpisode ? handlePreviousEpisode : undefined
          }
          hasNextEpisode={hasNextEpisode}
          hasPreviousEpisode={hasPreviousEpisode}
          title={displayTitle}
        />
      </View>
    );
  }

  return (
    <View style={[styles.videoContainer, { backgroundColor: "#000" }]}>
      <Image
        source={{ uri: imageUrl }}
        style={styles.videoPlaceholder}
        cachePolicy="memory-disk"
        contentFit="cover"
      />

      <TouchableOpacity style={styles.playButton} onPress={handlePlayPress}>
        <Text style={styles.playButtonText}>▶</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.overlayBackButton} onPress={onBackPress}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  videoContainer: {
    width: SCREEN_WIDTH,
    height: VIDEO_HEIGHT,
    position: "relative",
    backgroundColor: "#000",
  },
  videoPlaceholder: {
    width: "100%",
    height: "100%",
  },
  overlayBackButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 40,
    left: spacing.md,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 20,
    zIndex: 100,
  },
  backButtonText: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "700",
  },
  playButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -40 }, { translateY: -40 }],
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  playButtonText: {
    fontSize: 32,
    marginLeft: 4,
    color: "#000",
    fontWeight: "700",
  },
});

export default VideoPlayer;
