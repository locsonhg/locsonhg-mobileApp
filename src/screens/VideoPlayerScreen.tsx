import React, { useState, useEffect } from "react";
import { View, StyleSheet, BackHandler } from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import CustomVideoPlayer from "../components/common/CustomVideoPlayer";

type VideoPlayerScreenRouteProp = RouteProp<RootStackParamList, "VideoPlayer">;
type VideoPlayerScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "VideoPlayer"
>;

const VideoPlayerScreen: React.FC = () => {
  const route = useRoute<VideoPlayerScreenRouteProp>();
  const navigation = useNavigation<VideoPlayerScreenNavigationProp>();
  const {
    videoUrl,
    movieTitle,
    episodes = [],
    currentEpisodeIndex = 0,
  } = route.params;

  const [currentIndex, setCurrentIndex] = useState(currentEpisodeIndex);
  const [currentVideoUrl, setCurrentVideoUrl] = useState(videoUrl);

  // Update video URL when episode changes
  useEffect(() => {
    if (episodes.length > 0 && episodes[currentIndex]) {
      setCurrentVideoUrl(episodes[currentIndex].link_m3u8 || episodes[currentIndex].link_embed);
    }
  }, [currentIndex, episodes]);

  // Handle hardware back button on Android
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        navigation.goBack();
        return true;
      },
    );

    return () => backHandler.remove();
  }, [navigation]);

  const handleClose = () => {
    navigation.goBack();
  };

  const handleNextEpisode = () => {
    if (currentIndex < episodes.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePreviousEpisode = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const hasNextEpisode =
    episodes.length > 0 && currentIndex < episodes.length - 1;
  const hasPreviousEpisode = episodes.length > 0 && currentIndex > 0;

  const currentEpisodeName = episodes[currentIndex]?.name || movieTitle;
  const displayTitle =
    episodes.length > 0 ? `${movieTitle} - ${currentEpisodeName}` : movieTitle;

  return (
    <View style={styles.container}>
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
});

export default VideoPlayerScreen;
