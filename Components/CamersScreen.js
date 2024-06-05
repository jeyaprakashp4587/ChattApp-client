/** @format */

import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import Ripple from "react-native-material-ripple";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Camera } from "expo-camera";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import { useNavigation } from "@react-navigation/native";

const CameraScreen = (props) => {
  const navigation = useNavigation();
  const [camera, setCamera] = useState();
  const [capturedPicture, setCapturedPicture] = useState();
  // click camera
  const HandleClick = async () => {
    if (camera) {
      const photo = await camera.takePictureAsync();
      setCapturedPicture(photo);
      console.log(photo);
      await MediaLibrary.saveToLibraryAsync(photo.uri);
    }
  };
  return (
    <View
      style={{
        // flex: 1,
        height: "100%",
        width: "100%",
        display: props.camera ? "flex" : "none",
      }}
    >
      <Camera
        ref={(ref) => setCamera(ref)}
        style={{
          flex: 1,
          justifyContent: "center",
          paddingBottom: "30%",
          alignItems: "flex-end",
          flexDirection: "row",
        }}
        type={props.cameratype}
      >
        {/* camera buttons */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Ripple onPress={() => navigation.goBack()}>
            <FontAwesome name="times" size={30} color="white" />
          </Ripple>
          <Ripple onPress={HandleClick}>
            <Entypo name="circle" size={90} color="white" />
          </Ripple>
          <Ripple style={{ flex: 0 }}>
            <MaterialCommunityIcons
              name="camera-flip-outline"
              size={30}
              color="white"
            />
          </Ripple>
        </View>
      </Camera>
    </View>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({});
