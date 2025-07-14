import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import TvFocusable from "../components/TvFocusable";

export default function FavoritesScreen() {
  const [favorites, setFavorites] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const navigation = useNavigation();

  React.useEffect(() => {
    const loadFavorites = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("favorites");
        if (jsonValue) {
          try {
            const parsed = JSON.parse(jsonValue);
            if (Array.isArray(parsed)) {
              const normalized = parsed.map((item) => ({
                ...item,
                id: item.id?.toString(),
              }));
              setFavorites(normalized);
            }
          } catch (parseError) {
            console.error("Failed to parse favorites", parseError);
            await AsyncStorage.setItem("favorites", JSON.stringify([]));
            setFavorites([]);
          }
        }
      } catch (e) {
        console.error("Failed to load favorites", e);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  const removeFavorite = async (videoId) => {
    try {
      const newFavorites = favorites.filter((video) => video.id !== videoId);
      await AsyncStorage.setItem("favorites", JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (e) {
      console.error("Failed to remove favorite", e);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#FFD369" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#222831", padding: 20 }}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              marginBottom: 25,
              backgroundColor: "#393E46",
              borderRadius: 10,
              overflow: "hidden",
              minHeight: 160,
              alignItems: "stretch",
            }}
          >
            <View style={{ aspectRatio: 16 / 9 }}>
              <Image
                source={{ uri: item.thumbnailUrl }}
                style={{
                  width: "100%",
                  height: "100%",
                  resizeMode: "cover",
                }}
              />
            </View>

            <View
              style={{
                flex: 1,
                padding: 15,
                justifyContent: "space-between",
              }}
            >
              <View>
                <Text
                  style={{
                    color: "#EEEEEE",
                    fontSize: 18,
                    fontWeight: "bold",
                    marginBottom: 8,
                    lineHeight: 22,
                  }}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {item.title}
                </Text>
                <Text
                  style={{
                    color: "#EEEEEE",
                    fontSize: 14,
                    marginBottom: 15,
                  }}
                  numberOfLines={2}
                >
                  {item.description}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("VideoPlayer", {
                      videoUrl: item.videoUrl,
                    })
                  }
                  style={{
                    width: 200,
                    backgroundColor: "#FFD369",
                    paddingVertical: 10,
                    paddingHorizontal: 15,
                    borderRadius: 6,
                    alignItems: "center",
                    minWidth: 120,
                  }}
                >
                  <Text
                    style={{
                      color: "#222831",
                      fontWeight: "bold",
                      fontSize: 16,
                    }}
                  >
                    Play
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => removeFavorite(item.id)}
                  style={{
                    width: 200,
                    backgroundColor: "transparent",
                    borderWidth: 1,
                    borderColor: "#FF5555",
                    paddingVertical: 10,
                    paddingHorizontal: 15,
                    borderRadius: 6,
                    alignItems: "center",
                    minWidth: 120,
                  }}
                >
                  <Text
                    style={{
                      color: "#FF5555",
                      fontWeight: "bold",
                      fontSize: 16,
                    }}
                  >
                    Remove
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingTop: 100,
            }}
          >
            <Text
              style={{
                color: "#EEEEEE",
                fontSize: 20,
                textAlign: "center",
                marginBottom: 15,
                fontWeight: "bold",
              }}
            >
              No favorites yet
            </Text>
            <Text
              style={{
                color: "#AAAAAA",
                fontSize: 16,
                textAlign: "center",
              }}
            >
              Add some from the home screen!
            </Text>
            <TvFocusable
              hasTVPreferredFocus
              onPress={() => {
                navigation.goBack();
              }}
              child={
                <View
                  style={{
                    marginTop: 20,
                    justifyContent: "center",
                    alignItems: "center",
                    width: 150,
                    height: 50,
                    backgroundColor: "#FFD369",
                    borderRadius: 8,
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    Go Back
                  </Text>
                </View>
              }
            ></TvFocusable>
          </View>
        }
      />
    </View>
  );
}
