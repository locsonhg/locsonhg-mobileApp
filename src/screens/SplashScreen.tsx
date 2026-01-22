import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../contexts/ThemeContext";

const { width, height } = Dimensions.get("window");

interface SplashScreenProps {
  onAnimationComplete?: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onAnimationComplete }) => {
  const { theme } = useTheme();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sequence of animations
    Animated.parallel([
      // Logo Fade and Scale
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 10,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      // Fake progress bar animation
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 2500,
        useNativeDriver: false,
      })
    ]).start(() => {
      // Small pause after full animation
      setTimeout(() => {
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      }, 500);
    });
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      
      {/* Background Gradient Decorations */}
      <View style={[styles.glow, { top: -100, left: -100, backgroundColor: "rgba(229, 9, 20, 0.15)" }]} />
      <View style={[styles.glow, { bottom: -150, right: -100, backgroundColor: "rgba(229, 9, 20, 0.1)" }]} />

      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }, { translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.logoWrapper}>
          <Text style={styles.logoText}>LOCSONHG</Text>
          <View style={[styles.logoDot, { backgroundColor: theme.colors.primary }]} />
        </View>
        <Text style={styles.tagline}>TRẢI NGHIỆM ĐIỆN ẢNH ĐỈNH CAO</Text>
      </Animated.View>

      {/* Loading Indicator */}
      <View style={styles.loaderContainer}>
        <View style={[styles.progressBarBackground, { backgroundColor: "rgba(255,255,255,0.1)" }]}>
          <Animated.View 
            style={[
              styles.progressBarContent, 
              { 
                backgroundColor: theme.colors.primary,
                width: progressWidth 
              }
            ]} 
          />
        </View>
        <Text style={styles.loadingText}>Đang tải tài liệu...</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2026 LOCSONHG DZSO1HG</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  glow: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.5,
  },
  logoContainer: {
    alignItems: "center",
  },
  logoWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoText: {
    fontSize: 48,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: 4,
    fontStyle: "italic",
    textShadowColor: "rgba(229, 9, 20, 0.5)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  logoDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 4,
    marginTop: 15,
  },
  tagline: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 3,
    marginTop: 10,
  },
  loaderContainer: {
    position: "absolute",
    bottom: 100,
    width: "60%",
    alignItems: "center",
  },
  progressBarBackground: {
    width: "100%",
    height: 3,
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 10,
  },
  progressBarContent: {
    height: "100%",
  },
  loadingText: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 11,
    fontWeight: "500",
    letterSpacing: 1,
  },
  footer: {
    position: "absolute",
    bottom: 40,
  },
  footerText: {
    color: "rgba(255,255,255,0.2)",
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1,
  },
});

export default SplashScreen;
