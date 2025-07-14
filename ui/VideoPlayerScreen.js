import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    useNavigation
} from "@react-navigation/native";
import * as React from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    View
} from "react-native";
import { Video } from "react-native-video";
import TvFocusable from "../components/TvFocusable";

export default function VideoPlayerScreen({ route }) {
  const { videoUrl } = route.params;
  const videoRef = React.useRef(null);
  const [isPlaying, setIsPlaying] = React.useState(true);
  const navigation = useNavigation();
  const [isVideoReady, setIsVideoReady] = React.useState(false);
  const [showVideo, setShowVideo] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [resumeTime, setResumeTime] = React.useState(0);
  const [isError, setIsError] = React.useState(false);
  const progressTimer = React.useRef(null);

  React.useEffect(() => {
    const loadProgress = async () => {
      try {
        const savedTime = await AsyncStorage.getItem(
          `videoProgress_${videoUrl}`
        );
        if (savedTime) {
          const time = parseFloat(savedTime);
          if (!isNaN(time)) {
            setResumeTime(time);
          }
        }
      } catch (e) {
        console.error("Failed to load progress", e);
      }
    };

    loadProgress();
  }, [videoUrl]);

  const saveProgress = async () => {
    try {
      await AsyncStorage.setItem(
        `videoProgress_${videoUrl}`,
        currentTime.toString()
      );
    } catch (e) {
      console.error("Failed to save progress", e);
    }
  };

  React.useEffect(() => {
    if (isPlaying && showVideo) {
      progressTimer.current = setInterval(saveProgress, 100);
    }

    return () => {
      if (progressTimer.current) {
        clearInterval(progressTimer.current);
      }
    };
  }, [showVideo, currentTime]);

  const onProgress = (data) => {
    setCurrentTime(data.currentTime);
  };

  return (
    <View style={styles.container}>
      {!isVideoReady ? (
        <ActivityIndicator size="large" color="#FFD369" />
      ) : null}

     {isError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error loading video</Text>
          <TvFocusable
            hasTVPreferredFocus
            onPress={handleRetry}
            style={styles.retryButton}
            child={<Text style={styles.retryButtonText}>Retry</Text>}
          />
        </View>
      ) : (
        <Video
          ref={videoRef}
          source={{ uri: videoUrl }}
          style={showVideo ? styles.video : styles.hiddenVideo}
          paused={!isPlaying}
          controls={true}
          resizeMode="cover"
          onProgress={!isPlaying ? null : onProgress}
          fullscreenAutorotate={true}
          onError={(error) => {
            console.log("Video error:", error);
            setIsError(true);
          }}
          onFullscreenPlayerWillPresent={() => console.log("Entered fullscreen")}
          onFullscreenPlayerWillDismiss={() => {
            navigation.goBack();
          }}
          onLoad={() => {
            if (resumeTime > 0) {
              setIsPlaying(false);
              setShowVideo(false);
            }
          }}
          onReadyForDisplay={() => {
            setIsVideoReady(true);
            setIsError(false);
            if (resumeTime == 0) {
              videoRef.current.presentFullscreenPlayer();
              setShowVideo(true);
            }
          }}
        />
      )}
      {isVideoReady && resumeTime > 0 && !isPlaying ? (
        <View style={styles.controlsOverlay}>
          <TvFocusable
            hasTVPreferredFocus
            onPress={() => {
              setShowVideo(true);
              videoRef.current.presentFullscreenPlayer();
              videoRef.current.seek(resumeTime);
              setIsPlaying(true);
            }}
            style={styles.controlButton}
            child={<Text style={styles.controlButtonText}>Resume</Text>}
          ></TvFocusable>
          <TvFocusable
            onPress={() => {
              setShowVideo(true);
              videoRef.current.presentFullscreenPlayer();
              setIsPlaying(true);
            }}
            style={styles.controlButton}
            child={<Text style={styles.controlButtonText}>Play Again</Text>}
          ></TvFocusable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  hiddenVideo: {
    width: 0,
    height: 0,
  },
  controlsContainer: {
    padding: 10,
  },
  controlsOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    zIndex: 2,
  },
  controlButton: {
    width: 300,
    padding: 20,
    marginVertical: 15,
    backgroundColor: "#222831",
    borderWidth: 2,
    borderColor: "#FFD369",
    borderRadius: 8,
    alignItems: "center",
    color: "#EEEEEE",
  },
  controlButtonText: {
    color: "#EEEEEE",
    fontSize: 20,
    fontWeight: "bold",
  },
});
