// components/SplashScreen.js
import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Video } from "expo-av";

const SplashScreen = ({ onFinish }) => {
  useEffect(() => {
    // Set a timeout to move to the next screen after the video duration
    const timer = setTimeout(onFinish, 5000); // Adjust the duration to match your video length
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.splashContainer}>
      <Video
        source={require("../../assets/splash-video.mp4")} // Path to your video file
        rate={1.0}
        volume={1.0}
        isMuted={false}
        resizeMode="cover"
        shouldPlay
        isLooping={false}
        onPlaybackStatusUpdate={(status) => {
          if (status.didJustFinish) {
            onFinish();
          }
        }}
        style={styles.video}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  video: {
    width: "100%",
    height: "100%",
  },
});

export default SplashScreen;
