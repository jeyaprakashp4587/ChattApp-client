/** @format */

import { StatusBar } from "expo-status-bar";
import { Alert, BackHandler, StyleSheet, Text, View } from "react-native";
import { ProviderData } from "./Context/Provider";
import { SafeAreaView } from "react-native-safe-area-context";
import StackNavigation from "./Navigations/Navigation";
import Chats from "./Screens/Chats";
import { useEffect } from "react";

export default function App() {
  return (
    <ProviderData>
      <StackNavigation />
    </ProviderData>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    // marginTop: 20,
    // borderWidth: 2,
  },
});
