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
} from "react-native";
import { WebView } from "react-native-webview";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { spacing } from "../../theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const VIDEO_HEIGHT = SCREEN_WIDTH * 0.56; // 16:9 aspect ratio

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
  hasNextEpisode = false,
  title,
}) => {
  const { t } = useTranslation();
  const controlsOpacity = useRef(new Animated.Value(1)).current;

  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const hideControlsTimeout = useRef<NodeJS.Timeout | null>(null);

  // Auto-hide controls after 4 seconds
  useEffect(() => {
    if (showControls && !isLoading) {
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
  }, [showControls, isLoading]);

  const hideControls = () => {
    Animated.timing(controlsOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setShowControls(false));
  };

  const displayControls = () => {
    setShowControls(true);
    Animated.timing(controlsOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const toggleControls = () => {
    if (showControls) {
      hideControls();
    } else {
      displayControls();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/* WebView for video */}
      <WebView
        source={{ uri: videoUrl }}
        style={styles.video}
        allowsFullscreenVideo
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        scalesPageToFit
      />

      {/* Loading Indicator */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

      {/* Controls Overlay - only when visible */}
      {showControls && (
        <Animated.View
          style={[styles.controlsOverlay, { opacity: controlsOpacity }]}
        >
          {/* Tap anywhere to hide controls */}
          <TouchableOpacity
            style={styles.fullScreenTap}
            activeOpacity={1}
            onPress={hideControls}
          />

          {/* Top Bar with Back Button */}
          <LinearGradient
            colors={["rgba(0,0,0,0.85)", "rgba(0,0,0,0.3)", "transparent"]}
            style={styles.topGradient}
          >
            <View style={styles.topBar}>
              <TouchableOpacity style={styles.backButton} onPress={onClose}>
                <Text style={styles.backIcon}>←</Text>
              </TouchableOpacity>

              {title && (
                <Text style={styles.titleText} numberOfLines={1}>
                  {title}
                </Text>
              )}
            </View>
          </LinearGradient>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: VIDEO_HEIGHT,
    backgroundColor: "#000",
  },
  video: {
    width: SCREEN_WIDTH,
    height: VIDEO_HEIGHT,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    zIndex: 10,
  },
  controlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 5,
  },
  fullScreenTap: {
    ...StyleSheet.absoluteFillObject,
  },
  topGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingBottom: spacing.lg,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 22,
  },
  backIcon: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "600",
  },
  titleText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
    marginLeft: spacing.md,
  },
});

export default CustomVideoPlayer;
