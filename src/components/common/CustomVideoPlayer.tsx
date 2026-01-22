import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  StatusBar,
  Platform,
  Animated,
  Modal,
} from "react-native";
import { Video, ResizeMode, AVPlaybackStatus } from "expo-av";
import { MaterialIcons } from "@expo/vector-icons";
import * as ScreenOrientation from "expo-screen-orientation";
import { spacing } from "../../theme";
import Slider from "@react-native-community/slider";
import { useWindowDimensions } from "react-native";

interface CustomVideoPlayerProps {
  videoUrl: string;
  onClose: () => void;
  onNextEpisode?: () => void;
  onPreviousEpisode?: () => void;
  hasNextEpisode?: boolean;
  hasPreviousEpisode?: boolean;
  title?: string;
}

const CustomVideoPlayer: React.FC<CustomVideoPlayerProps> = ({
  videoUrl,
  onClose,
  onNextEpisode,
  onPreviousEpisode,
  hasNextEpisode = false,
  hasPreviousEpisode = false,
  title,
}) => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const videoHeight = windowWidth * 0.56; // 16:9 aspect ratio

  const videoRef = useRef<Video>(null);
  const controlsOpacity = useRef(new Animated.Value(1)).current;

  const [showControls, setShowControls] = useState(true);
  const [isSeeking, setIsSeeking] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const hideControlsTimeout = useRef<NodeJS.Timeout | null>(null);

  // Auto-hide controls after 4 seconds
  useEffect(() => {
    if (showControls && !isLoading && isPlaying && !isLocked) {
      if (hideControlsTimeout.current) {
        clearTimeout(hideControlsTimeout.current);
      }
      hideControlsTimeout.current = setTimeout(() => {
        hideControls();
      }, 4000);
    }

    return () => {
      if (hideControlsTimeout.current) {
        clearTimeout(hideControlsTimeout.current);
      }
    };
  }, [showControls, isLoading, isPlaying, isLocked]);

  // Start playing on mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playAsync();
    }
  }, []);

  const hideControls = () => {
    if (isLocked) return;
    Animated.timing(controlsOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setShowControls(false));
  };

  const displayControls = () => {
    setShowControls(true);
    Animated.timing(controlsOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const toggleControls = () => {
    if (isLocked) {
      displayControls();
      return;
    }
    if (showControls) {
      hideControls();
    } else {
      displayControls();
    }
  };

  const togglePlayPause = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
    }
  };

  const seekForward = async () => {
    if (videoRef.current) {
      const newPosition = Math.min(position + 10000, duration);
      await videoRef.current.setPositionAsync(newPosition);
    }
  };

  const seekBackward = async () => {
    if (videoRef.current) {
      const newPosition = Math.max(position - 10000, 0);
      await videoRef.current.setPositionAsync(newPosition);
    }
  };

  const toggleLock = () => {
    setIsLocked(!isLocked);
    if (!isLocked) {
      displayControls();
    }
  };

  const toggleFullscreen = async () => {
    if (isFullscreen) {
      setIsFullscreen(false);
      await ScreenOrientation.unlockAsync();
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    } else {
      setIsFullscreen(true);
      await ScreenOrientation.unlockAsync();
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    }
  };

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setIsLoading(false);
      setIsPlaying(status.isPlaying);
      setDuration(status.durationMillis || 0);
      if (!isSeeking) {
        setPosition(status.positionMillis || 0);
      }
    } else if (status.error) {
      setIsLoading(false);
      console.error("Video error:", status.error);
    }
  };

  const onSeek = async (value: number) => {
    if (videoRef.current) {
      setIsSeeking(true);
      await videoRef.current.setPositionAsync(value);
      setIsSeeking(false);
    }
  };

  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <View style={isFullscreen ? [styles.fullscreenContainer, { width: windowWidth, height: windowHeight }] : [styles.container, { width: windowWidth, height: videoHeight }]}>
      <StatusBar hidden={isFullscreen} />

      {/* Video Player - SINGLE INSTANCE */}
      <Video
        ref={videoRef}
        source={{ uri: videoUrl }}
        style={isFullscreen ? styles.fullscreenVideo : { width: windowWidth, height: videoHeight }}
        resizeMode={isFullscreen ? ResizeMode.STRETCH : ResizeMode.CONTAIN}
        onPlaybackStatusUpdate={onPlaybackStatusUpdate}
        useNativeControls={false}
      />

      {/* Loading Indicator */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

      {/* Tap to toggle controls */}
      <TouchableOpacity
        style={styles.fullScreenTap}
        activeOpacity={1}
        onPress={toggleControls}
      />

      {/* Controls Overlay */}
      {showControls && (
        <Animated.View
          style={[styles.controlsOverlay, { opacity: controlsOpacity }]}
          pointerEvents="box-none"
        >
          {/* Top Bar - Only in Fullscreen */}
          {isFullscreen && (
            <View style={styles.topBar}>
              <TouchableOpacity onPress={toggleFullscreen} style={styles.iconButton}>
                <MaterialIcons name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.videoTitle} numberOfLines={1}>{title || "Đang xem"}</Text>
            </View>
          )}

          {/* Center Controls - spread out */}
          {!isLocked && (
            <View style={styles.centerControls}>
              <TouchableOpacity style={styles.controlButton} onPress={seekBackward}>
                <MaterialIcons name="replay-10" size={32} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.playPauseButton} onPress={togglePlayPause}>
                <MaterialIcons name={isPlaying ? "pause" : "play-arrow"} size={48} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.controlButton} onPress={seekForward}>
                <MaterialIcons name="forward-10" size={32} color="#fff" />
              </TouchableOpacity>
            </View>
          )}

          {/* Bottom Bar Controls */}
          <View style={[styles.bottomControls, isFullscreen && styles.bottomControlsFS]}>
            <View style={styles.bottomRow}>
              {/* Lock Button - Bottom Left */}
              <TouchableOpacity style={styles.smallIconButton} onPress={toggleLock}>
                <MaterialIcons name={isLocked ? "lock" : "lock-open"} size={22} color="#fff" />
              </TouchableOpacity>

              {/* Progress & Time */}
              {!isLocked && (
                <View style={styles.progressContainer}>
                  <Slider
                    style={styles.progressBar}
                    value={position}
                    minimumValue={0}
                    maximumValue={duration || 0}
                    onSlidingStart={() => setIsSeeking(true)}
                    onSlidingComplete={onSeek}
                    minimumTrackTintColor="#fff"
                    maximumTrackTintColor="rgba(255,255,255,0.2)"
                    thumbTintColor="#fff"
                  />
                  <Text style={styles.timeText}>
                    {formatTime(position)} / {formatTime(duration)}
                  </Text>
                </View>
              )}

              {/* Fullscreen Toggle - Bottom Right */}
              {!isLocked && (
                <TouchableOpacity style={styles.smallIconButton} onPress={toggleFullscreen}>
                  <MaterialIcons 
                    name={isFullscreen ? "fullscreen-exit" : "fullscreen"} 
                    size={24} 
                    color="#fff" 
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
  },
  fullscreenContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "#000",
    zIndex: 99999,
    elevation: 99999,
  },
  video: {
    backgroundColor: "#000",
  },
  fullscreenVideo: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 10,
  },
  fullScreenTap: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  controlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 5,
  },
  topBar: {
    position: "absolute",
    top: spacing.lg,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    zIndex: 100,
  },
  videoTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: spacing.md,
    flex: 1,
  },
  centerControls: {
    position: "absolute",
    top: "50%",
    left: "15%",
    right: "15%",
    marginTop: -40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 100,
  },
  controlButton: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  playPauseButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomControls: {
    position: "absolute",
    bottom: spacing.md,
    left: 0,
    right: 0,
  },
  bottomControlsFS: {
    paddingHorizontal: spacing.lg,
    bottom: spacing.xl,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  progressContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 40,
  },
  timeText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "500",
    minWidth: 80,
  },
  smallIconButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  iconButton: {
    padding: spacing.xs,
  },
});

export default CustomVideoPlayer;
