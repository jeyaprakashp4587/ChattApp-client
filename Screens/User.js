/** @format */

import { View, Text, TouchableOpacity, Pressable, Button } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "react-native";
import axios from "axios";
import { useData } from "../Context/Provider";
import { Colors } from "../Consts/Const";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Camera, CameraType } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import CameraScreen from "../Components/CamersScreen";
import Ripple from "react-native-material-ripple";
import { TextInput } from "react-native";
import Api from "../Api";
// "https://192.168.43.24:3000"

const User = () => {
  const { user, setUser } = useData();
  // console.log(user);
  // user bio
  // edit profile
  const [edit, setEdit] = useState(false);
  const navigation = useNavigation();
  // image pick option
  const [option, setOptions] = useState(false);
  const [openCamera, setOpenCamera] = useState(false);
  const handleOptions = () => {
    setOptions(!option);
  };
  // set camers type front or bacl
  const [type, setType] = useState(CameraType.back);
  // camera
  // get camera permission
  const requestCamersPermission = Camera.requestCameraPermissionsAsync();
  const status = Camera.getCameraPermissionsAsync();
  // console.log(requestCamersPermission);

  const HandleCamera = () => {
    setOpenCamera(true);
  };

  // set the image from get camera and imagepicker
  const [image, setImage] = useState(null);
  // get meadia permission
  const requestImagepermission =
    ImagePicker.requestMediaLibraryPermissionsAsync();
  // handlre image picker
  const HandleImagePicker = async () => {
    // --------
    const result = await ImagePicker.launchImageLibraryAsync();
    setImage(result.assets[0].uri);
  };

  // handle submit editing
  const HandleSubmitEdit = () => {
    setEdit(!edit);
  };
  // upload the camera or imagepicker to database
  const uploadImage = async () => {
    try {
      const res = await axios.post(`${Api}/upload`, {
        form: image,
        user: user._id,
      });
      // console.log(res);
      setUser(res.data);
    } catch (error) {
      console.error(error);
    }
  };
  // state for change username and Bio
  const [userNameText, setuserNameText] = useState();
  const [BioText, setBioText] = useState();
  const [firstname, setFirstname] = useState();
  const HandleUsername = (text) => {
    setuserNameText(text);
  };
  const HandleFirstname = (text) => {
    setFirstname(text);
  };
  const HandleBio = (text) => {
    setBioText(text);
    // console.log(text);
  };
  // update user details
  const HandleUpdate = async () => {
    try {
      const res = await fetch(`${Api}/updateuser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user._id,
          Bio: BioText,
          Username: userNameText,
          Firstname: firstname,
        }),
      });
      const data = await res.json();
      setUser(data);
      // console.log("updated", data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingHorizontal: openCamera ? 0 : 20,
        backgroundColor: "white",
        position: "relative",
      }}
    >
      {/* header */}
      <View
        style={{
          height: 100,
          //   borderWidth: 1,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={27} color="black" />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 20,
            flex: 2,
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          My Profile
        </Text>
      </View>
      {/* user card */}
      <LinearGradient
        // colors={["#6a5ac3", "#998fd6", "white"]}
        colors={["#1F1F1F", "#1F1F1F"]}
        style={{
          width: "90%",
          height: 160,
          marginHorizontal: "auto",
          borderRadius: 10,
          padding: 20,
          alignSelf: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
            columnGap: 10,
            position: "relative",
          }}
        >
          <Image
            source={{
              uri: user.ProfilePicture
                ? user.ProfilePicture
                : "https://i.ibb.co/MM0hXjg/user.png",
            }}
            style={{
              width: 70,
              height: 70,
              borderRadius: 50,
            }}
            resizeMode="cover"
          />
          <TouchableOpacity onPress={() => handleOptions()}>
            <FontAwesome
              name="edit"
              size={18}
              color="orange"
              style={{
                position: "absolute",
                bottom: -30,
                right: 10,
                display: edit ? "flex" : "none",
              }}
            />
          </TouchableOpacity>
          {/* model  */}
          <View
            style={{
              width: 200,
              height: 120,
              backgroundColor: "white",
              borderRadius: 10,
              padding: 15,
              flexDirection: "column",
              justifyContent: "space-around",
              rowGap: 10,
              display: option ? "flex" : "none",
              position: "absolute",
              zIndex: 1,
              top: 140,
              elevation: 5,
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "#d9d9d9",
                borderRadius: 5,
                padding: 7,
              }}
              onPress={HandleCamera}
            >
              <Text>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "#d9d9d9",
                borderRadius: 5,
                padding: 7,
              }}
              onPress={HandleImagePicker}
            >
              <Text>Select From Gallery</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "column", position: "relative" }}>
            <Text style={{ color: "white", fontSize: 25 }}>
              {user ? user.firstname : "none"}
            </Text>

            <Text style={{ color: Colors.grey }}>
              {user ? user.Bio : "I'm Here"}
            </Text>
          </View>
        </View>
      </LinearGradient>
      <View
        style={{
          flexDirection: "row",
          marginTop: 30,
          justifyContent: "center",
          columnGap: 10,
        }}
      >
        <Text style={{ fontSize: 18 }}>Edit Profile</Text>
        <Ripple onPress={() => setEdit(!edit)}>
          <AntDesign name="edit" size={24} color="orange" />
        </Ripple>
      </View>
      {/* camera */}
      <View
        style={{
          display: openCamera ? "flex" : "none",
          width: "100%",
          position: "absolute",
          top: 0,
          zIndex: 10,
          height: "100%",
        }}
      >
        <CameraScreen camera={openCamera} cameratype={type} />
      </View>
      <Image
        resizeMode="cover"
        source={{ uri: image }}
        style={{
          width: "100%",
          height: 300,
          marginTop: 50,
        }}
      />
      {/* edit user name and bio */}
      <View
        style={{
          // borderWidth: 2,
          position: "absolute",
          width: "90%",
          height: 250,
          marginHorizontal: "auto",
          alignSelf: "center",
          marginTop: "80%",
          elevation: 8,
          borderRadius: 10,
          backgroundColor: "white",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-around",
          paddingHorizontal: 25,
          paddingVertical: 15,
          display: edit ? "flex" : "none",
        }}
      >
        <TextInput
          onChangeText={HandleFirstname}
          placeholder="Enter FirstName"
          style={{
            borderWidth: 1,
            borderColor: "#cccccc",
            width: "100%",
            borderRadius: 4,
            padding: 10,
          }}
        />
        <TextInput
          onChangeText={HandleUsername}
          placeholder="Enter Username"
          style={{
            borderWidth: 1,
            borderColor: "#cccccc",
            width: "100%",
            borderRadius: 4,
            padding: 10,
          }}
        />
        <TextInput
          onChangeText={HandleBio}
          placeholder="Bio"
          style={{
            borderWidth: 1,
            borderColor: "#cccccc",
            width: "100%",
            borderRadius: 4,
            padding: 10,
          }}
        />
        <TouchableOpacity
          onPress={HandleUpdate}
          style={{
            backgroundColor: Colors.violet,
            padding: 10,
            width: "100%",
          }}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            Confirm
          </Text>
        </TouchableOpacity>
      </View>
      {/*show image for testing  */}
      <Image source={{ uri: image }} />
      <Button title="click" onPress={uploadImage}></Button>
    </SafeAreaView>
  );
};

export default User;
