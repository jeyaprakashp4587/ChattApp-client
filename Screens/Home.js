/** @format */

/** @format */
import { View, Text, Modal, Pressable, BackHandler, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "../Consts/Const";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ScrollView } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import io, { Socket } from "socket.io-client";
import { useData } from "../Context/Provider";
import { TouchableOpacity } from "react-native";
import Ripple from "react-native-material-ripple";
import { Ionicons } from "@expo/vector-icons";
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import axios from "axios";
import { StatusBar } from "react-native";
import Api from "../Api";
import { RefreshControl } from "react-native";
import NetInfo from "@react-native-community/netinfo";

const Home = () => {
  // console.log(Api);
  // import data from context
  const {
    user,
    setChatuser,
    setUser,
    setReceivemsgfromContext,
    chatuserTrigger,
    setChatuserTrigger,
    setConvoContext,
  } = useData();
  // ------
  const navigation = useNavigation();

  // update when trigger
  useEffect(() => {
    const updateUser = async () => {
      const res = await axios.post(`${Api}/currentuser`, {
        UserId: user,
      });
      setUser(res.data);
    };
    updateUser();
  }, []);
  // socket
  const socket = io(Api);
  // const [socketStatus, setSocketstatus] = useState(false);
  const updateSocketstatus = async (status) => {
    await axios.post(`${Api}/socketStatus`, {
      UserId: user._id,
      status: status,
    });
    //

    //
  };
  useEffect(() => {
    // socket connections
    socket.on("connect", () => {
      socket.emit("update-socketId", user._id);
      updateSocketstatus(true);
      console.log("socket on");
    });
    // send the active status to db
    socket.on("disconnect", () => {
      console.log("socket disconnect");
      updateSocketstatus(false);
    });
    socket.on("msg", (data) => {
      // setReceivemsgfromContext(data);
      console.log("socket", data);
    });
    socket.on("senderChat", (data) => {
      console.log("socket", data.Chats.Messages);
      setConvoContext(data.Chats);
    });
    socket.on("receiveChat", (data) => {
      setConvoContext(data.Chats);
    });
  }, [user._id]);

  const [logintoggle, setLogintoggle] = useState(false);
  // check the network info
  const [isConnected, setIsConnected] = useState(null);
  // useEffect(() => {
  //   const unsubscribe = NetInfo.addEventListener((state) => {
  //     setIsConnected(state.isConnected);
  //     console.log("Network", state.isConnected ? "online" : "offline");
  //     // You can add your logic to send requests here if needed
  //     if (state.isConnected) {
  //       // Send request to server
  //       updateSocketstatus(true);
  //     }
  //     if (!state.isConnected) updateSocketstatus(false);
  //   });

  //   // Fetch initial network status
  //   NetInfo.fetch().then((state) => {
  //     setIsConnected(state.isConnected);
  //     console.log(
  //       "Initial network status:",
  //       state.isConnected ? "online" : "offline"
  //     );
  //     if (state.isConnected) {
  //       updateSocketstatus(true);
  //     }
  //     if (!state.isConnected) updateSocketstatus(false);
  //   });

  //   return () => {
  //     unsubscribe();
  //   };
  // }, []);

  // useEffect(() => {
  //   const handleBackPress = () => {
  //     Alert.alert(
  //       "Exit App",
  //       "Are you sure you want to exit?",
  //       [
  //         {
  //           text: "Cancel",
  //           onPress: () => {},
  //           style: "none",
  //         },
  //         {
  //           text: "OK",
  //           onPress: () => {
  //             updateSocketstatus(false);
  //             setTimeout(() => {
  //               BackHandler.exitApp();
  //             }, 1000);
  //           },
  //         },
  //       ],
  //       { cancelable: false }
  //     );
  //     return true;
  //   };
  //   // -----
  //   if (route.name === "home") {
  //     BackHandler.addEventListener(
  //       "hardwareBackPress",
  //       route.name === "home" && handleBackPress
  //     );
  //     return () => {
  //       if (route.name === "home") {
  //         BackHandler.removeEventListener(
  //           "hardwareBackPress",
  //           route.name === "home" && handleBackPress
  //         );
  //       }
  //     };
  //   }
  // }, []);
  // this remove icon for remove friends list
  const [removeIcon, setRemoveIcon] = useState(false);
  return (
    <SafeAreaView
      style={{
        backgroundColor: Colors.violet,
        flex: 1,
      }}
    >
      {/* top wrapper */}
      <View
        style={{
          height: 330,
        }}
      >
        {/* header */}
        <View
          style={{
            height: 100,
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: "row",
            paddingHorizontal: 20,
            position: "relative",
            // borderWidth: 1,
          }}
        >
          <Feather name="menu" size={24} color="white" />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              columnGap: 10,
            }}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                fontSize: 17,
              }}
            >
              Hi, {user && user.firstname}
            </Text>

            <TouchableOpacity onPress={() => setLogintoggle(!logintoggle)}>
              <Image
                source={{
                  uri:
                    user && user.ProfilePicture
                      ? user.ProfilePicture
                      : "https://i.ibb.co/MM0hXjg/user.png",
                }}
                style={{
                  width: 55,
                  height: 55,
                  borderRadius: 40,
                  borderWidth: 2,
                  borderColor: "white",
                }}
              />
            </TouchableOpacity>
            {/* logout wrapper  */}
            <Ripple
              onPress={() => navigation.navigate("login")}
              style={{
                position: "absolute",
                backgroundColor: "white",
                top: 60,
                right: 0,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
                padding: 10,
                columnGap: 10,
                display: logintoggle ? "flex" : "none",
              }}
            >
              <Text>Logout</Text>
              <Feather name="log-out" size={24} color="black" />
            </Ripple>
          </View>
        </View>
        {/* friends list */}
        <Text style={{ color: "white", fontSize: 23, paddingLeft: 20 }}>
          Friends List
        </Text>
        <ScrollView
          style={{
            flex: 1,
            marginTop: 10,
            paddingLeft: 20,
            borderColor: "red",
            // borderWidth: 1,
          }}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <View
            style={{
              flexDirection: "row",
              flex: 1,
              justifyContent: "flex-start",
              alignItems: "center",
              height: 100,
              columnGap: 15,
              // borderWidth: 2,
              width: "100%",
            }}
          >
            {user &&
              user.friendsList?.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    navigation.navigate("chat"), setChatuser(item);
                    setChatuserTrigger(!chatuserTrigger);
                  }}
                  onLongPress={() => setRemoveIcon(true)}
                >
                  {/* remove user icon*/}
                  <View
                    style={{
                      flexDirection: "column",
                      alignItems: "center",
                      rowGap: 5,
                      // borderWidth: 2,
                    }}
                  >
                    <Image
                      source={{
                        uri: item.ProfilePicture
                          ? item.ProfilePicture
                          : "https://i.ibb.co/MM0hXjg/user.png",
                      }}
                      style={{
                        width: 70,
                        height: 70,
                        borderRadius: 40,
                        borderWidth: 3,
                        borderColor: "white",
                      }}
                    />
                    <Text style={{ color: "white" }}>{item.firstname}</Text>
                    {/* remove user icon */}
                    <Ripple
                      style={{
                        position: "absolute",
                        right: -1,
                        display: removeIcon ? "flex" : "none",
                      }}
                      onPress={async () => {
                        try {
                          const res = await axios.post(`${Api}/removefriend`, {
                            FriendId: item._id,
                            userId: user._id,
                          });

                          if (res.status === 200) {
                            setUser(res.data);
                          } else {
                            console.error("Error:", res.data.error);
                          }
                        } catch (error) {
                          console.error("Error:", error);
                        }
                      }}
                    >
                      <Ionicons
                        name="person-remove-outline"
                        size={20}
                        color="white"
                      />
                    </Ripple>
                  </View>
                </TouchableOpacity>
              ))}
          </View>
        </ScrollView>
      </View>
      {/* details wrapper */}
      <ScrollView
        style={{
          backgroundColor: "white",
          marginTop: -50,
          borderRadius: 40,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          paddingHorizontal: 20,
        }}
      >
        {/* header */}
        <View style={{ flexDirection: "row", marginTop: 25, flex: 1 }}>
          <AntDesign name="search1" size={27} color="black" />
          <Text
            style={{
              color: "black",
              fontSize: 19,
              flex: 1,
              textAlign: "center",
            }}
          >
            Chats
          </Text>
        </View>
        {/* messages */}
        <Text style={{ fontSize: 19, marginTop: 20 }}>Messages(0)</Text>
        {/* message profiles */}
        {/* <MessageUSers convo={rec}/> */}
      </ScrollView>
      <StatusBar barStyle="light-content" />
    </SafeAreaView>
  );
};

export default Home;
