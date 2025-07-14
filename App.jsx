// In App.js in a new project

import {
  createStaticNavigation
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import {
  StyleSheet
} from "react-native";
import FavoritesScreen from './ui/FavoritesScreen.js';
import HomeScreen from './ui/HomeScreen.js';
import VideoPlayerScreen from './ui/VideoPlayerScreen.js';

const RootStack = createNativeStackNavigator({
  initialRouteName: "Home",
  screenOptions: {
    headerShown: false,
  },
  screens: {
    Home: HomeScreen,
    VideoPlayer: VideoPlayerScreen,
    Favorites: FavoritesScreen,
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
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
