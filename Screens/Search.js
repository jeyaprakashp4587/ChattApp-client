/** @format */

import { ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { EvilIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";
import axios from "axios";
import { useData } from "../Context/Provider";
import Ripple from "react-native-material-ripple";
import { Image } from "react-native";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Api from "../Api";

const Search = () => {
  const navigation = useNavigation();
  const [AllUsers, setAllUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const { user, setChatuser, setUser } = useData();
  const [searchUsers, setSearchUsers] = useState([]);
  // searching the user
  const getUser = async () => {
    await axios.post(`${Api}/getuser`).then((data) => {
      setAllUsers(data.data);
    });
  };
  useEffect(() => {
    getUser();
  }, []);
  const HandleSearch = async () => {
    await getUser();
    const filter = AllUsers.filter((item) =>
      searchText.includes(item.firstname)
    );
    setSearchUsers(filter);
    // console.log(filter);
  };

  // add friends list
  const HandleAddfriend = async (userid) => {
    const friendExists = user.friendsList.some((item) => item._id === userid);
    if (!friendExists) {
      const res = await axios.post(`${Api}/addfriends`, {
        userid: user._id,
        frienduser: userid,
      });
      setUser(res.data);
    }
  };
  return (
    <LinearGradient
      colors={["#6a5ac3", "white"]}
      //   start={[1, 1]}
      //   end={[0, 1]}
      style={{ flex: 1, paddingHorizontal: 20 }}
    >
      {/* header */}
      <View
        style={{
          flexDirection: "row",
          height: 100,
          alignItems: "center",
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={27} color="white" />
        </TouchableOpacity>
        <Text
          style={{ color: "white", fontSize: 22, flex: 2, textAlign: "center" }}
        >
          Search
        </Text>
      </View>
      {/* search wrapper */}
      <View
        style={{
          paddingHorizontal: 20,
          height: 50,
          width: "100%",
          alignSelf: "center",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: 8,
          backgroundColor: "#404040",
          opacity: 0.4,
        }}
      >
        <Ripple onPress={HandleSearch}>
          <EvilIcons name="search" size={30} color="#E0DEEE" />
        </Ripple>
        <TextInput
          placeholder="Search"
          placeholderTextColor="white"
          style={{ flex: 1, borderWidth: 0, padding: 10, color: "white" }}
          onChangeText={(text) => setSearchText(text)}
        />
      </View>
      {/* user list */}
      <ScrollView style={{ borderWidth: 0, flex: 1, marginTop: 20 }}>
        {searchUsers.map((items, index) => (
          <View
            key={index}
            style={{
              // borderWidth: 1,
              borderColor: "red",
              height: 80,
              // backgroundColor: "#bfbfbf",
              flexDirection: "row",
              alignItems: "center",
              opacity: 0.9,
              columnGap: 8,
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "hsl(271, 100%, 70%)",
                borderRadius: 50,
              }}
            >
              <Image
                source={{ uri: items.ProfilePicture && items.ProfilePicture }}
                style={{ width: 60, height: 60, borderRadius: 50 }}
              />
            </View>
            <View
              style={{
                flexDirection: "column",
                padding: 5,
                flex: 1,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 20,
                }}
              >
                {items.firstname}
              </Text>
              <Text style={{ color: "#f2f2f2" }}>
                {items.Bio ? items.Bio : "Hey There!"}
              </Text>
            </View>
            <View style={{ flexDirection: "row", columnGap: 10 }}>
              <TouchableOpacity onPress={() => HandleAddfriend(items._id)}>
                <AntDesign name="plus" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("chat");
                  setChatuser(items);
                }}
              >
                <Feather name="send" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
};

export default Search;

const styles = StyleSheet.create({});
