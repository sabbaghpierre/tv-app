
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    useNavigation
} from "@react-navigation/native";
import * as React from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import ThumbnailCard from "../components/ThumbnailCard.js";

export default function HomeScreen() {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [selectedVideo, setSelectedVideo] = React.useState({});

  const [favorites, setFavorites] = React.useState([]);
  const [isFavorite, setIsFavorite] = React.useState(false);

  React.useEffect(() => {
    const loadFavorites = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("favorites");
        if (jsonValue !== null) {
          const parsedFavorites = JSON.parse(jsonValue);
          setFavorites(parsedFavorites);
          if (selectedVideo.id) {
            setIsFavorite(
              parsedFavorites.some((video) => video.id === selectedVideo.id)
            );
          }
        }
      } catch (e) {
        console.error("Failed to load favorites", e);
      }
    };

    loadFavorites();
  }, [selectedVideo]);

  React.useEffect(() => {
    if (selectedVideo.id) {
      setIsFavorite(favorites.some((video) => video.id === selectedVideo.id));
    }
  }, [selectedVideo, favorites]);


  const toggleFavorite = async () => {
    try {
      let newFavorites;
      if (isFavorite) {
        newFavorites = favorites.filter(
          (video) => video.id.toString() !== selectedVideo.id.toString()
        );
      } else {
        newFavorites = [
          ...favorites,
          {
            ...selectedVideo,
            id: selectedVideo.id.toString(), 
          },
        ];
      }

      await AsyncStorage.setItem("favorites", JSON.stringify(newFavorites));
      setFavorites(newFavorites);
      setIsFavorite(!isFavorite);
    } catch (e) {
      console.error("Failed to update favorites", e);
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://gist.githubusercontent.com/sabbaghpierre/064cd8da42e0674e672b8e405b3a3792/raw"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const jsonData = await response.json();
        setData(jsonData);
        setSelectedVideo(jsonData[0]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const navigation = useNavigation();
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#FFD369" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "red" }}>Error: {error}</Text>
      </View>
    );
  }

  const handlePlayVideo = () => {
    navigation.navigate("VideoPlayer", { videoUrl: selectedVideo.videoUrl });
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Background Image */}
      <Image
        source={{ uri: selectedVideo.thumbnailUrl }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.3,
        }}
        blurRadius={5}
      />

      {/* Dark overlay */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      />

      {/* Content */}
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          paddingBottom: 20,
        }}
      >
        <View style={{ paddingHorizontal: 20 }}>
          <Text
            style={{
              color: "#EEEEEE",
              fontSize: 24,
              fontWeight: "bold",
              marginBottom: 10,
            }}
          >
            {selectedVideo.title}
          </Text>
          <Text
            style={{
              color: "#EEEEEE",
              marginBottom: 20,
            }}
          >
            {selectedVideo.description}
          </Text>

          {/* Play Video Button */}
          <View
            style={{ alignItems: "flex-start", flexDirection: "row", gap: 10 }}
          >
            <TouchableOpacity
              onPress={handlePlayVideo}
              style={{
                width: 200,
                backgroundColor: "#222831",
                borderWidth: 2,
                borderColor: "#FFD369",
                borderRadius: 8,
                paddingVertical: 12,
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Text
                style={{
                  color: "#EEEEEE",
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                Play Video
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={toggleFavorite}
              style={{
                width: 200,
                backgroundColor: isFavorite ? "#FFD369" : "#222831",
                borderWidth: 2,
                borderColor: "#FFD369",
                borderRadius: 8,
                paddingVertical: 12,
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Text
                style={{
                  color: isFavorite ? "#222831" : "#EEEEEE",
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                {isFavorite ? "Remove From Favorites" : "Add To Favorites"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ marginbottom: 20 }}>
          <FlatList
            horizontal
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingVertical: 10,
            }}
            data={data}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={() => <View style={{ width: 15 }} />}
            renderItem={({ item }) => (
              <ThumbnailCard
                onFocus={() => {
                  setSelectedVideo(item);
                }}
                style={{ borderRadius: 8 }}
                videoUrl={item.videoUrl}
                imageUrl={item.thumbnailUrl}
                isContinueWatching={item.isContinueWatching}
                playedDuration={item.episodePlayedPercentage}
              />
            )}
          />
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("Favorites")}
          style={{
            width: 200,
            backgroundColor: "#222831",
            borderWidth: 2,
            borderColor: "#FFD369",
            borderRadius: 8,
            paddingVertical: 12,
            alignItems: "center",
            marginTop: 20,
            marginLeft: 20,
          }}
        >
          <Text
            style={{
              color: "#EEEEEE",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            View Favorites
          </Text>
        </TouchableOpacity>
      </View>
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
  contentContainer: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 50,
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
