/** @format */

import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Colors } from "../Consts/Const";
import Ripple from "react-native-material-ripple";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { ScrollView } from "react-native";
import { useData } from "../Context/Provider";
import io from "socket.io-client";
import { Alert } from "react-native";
import axios from "axios";
import Api from "../Api";
import { Vibration } from "react-native";
import { Audio } from "expo-av";
import { MaterialIcons } from "@expo/vector-icons";

// ---------------------------
const Chats = ({ navigation }) => {
  const {
    Chatuser,
    user,
    receivemessagefromContext,
    setChatuser,
    chatuserTrigger,
    convoContext,
  } = useData();
  const socket = io(Api);
  const [sendmsg, setSendmsg] = useState([]);
  const [receivemsg, setReceivemsg] = useState([]);
  const Flatlist_Scroll = useRef(null);
  // this convo state for merge and align send and receive message
  const [convo, setConvo] = useState([]);
  const [messageText, setMessageText] = useState("");
  // save the send message to DB
  // send the message details to databse via socket
  const saveMessageSocket = () => {
    socket.emit("sendMessageDB", {
      sendMessage: messageText,
      SendMsgTime: formattedTime,
      SendMsgType: "send",
      SenderId: user._id,
      ReceiverId: Chatuser._id,
      // send receive
      ReceiveMsgType: "receive",
    });
  };

  //
  const sendMessageDB = async () => {
    try {
      const res = await axios.post(`${Api}/sendMessageDB`, {
        sendMessage: messageText,
        SendMsgTime: formattedTime,
        SendMsgType: "send",
        SenderId: user._id,
        ReceiverId: Chatuser._id,
        // send receive
        ReceiveMsgType: "receive",
      });
      console.log(res.data);
      const filterChat = res.data.Chats.find(
        (item) => item.SenderId === user._id && item.ReceiverId === Chatuser._id
      );
      setConvo(filterChat.Messages);
    } catch (e) {
      console.log(e);
    }
  };

  // get the messages when chat is mounted
  const getMessage = async () => {
    await axios
      .post(`${Api}/getMessages`, {
        UserId: user._id,
        SenderId: user._id,
        ReceiverId: Chatuser._id,
      })
      .then((data) => {
        setConvo(data.data);
        console.log(data.data);
      });
    if (Flatlist_Scroll.current) {
      Flatlist_Scroll.current.scrollToEnd({ animated: true });
    }
  };
  // trigger the ChatuserPage
  useEffect(() => {
    getMessage();
    console.log("chatrigger", chatuserTrigger);
  }, [chatuserTrigger]);
  // set input message
  const HandleMessagetext = (text) => {
    setMessageText(text);
  };
  // update chatuser data
  // console.log(Chatuser._id);
  const updateChatuser = async () => {
    const res = await axios.post(`${Api}/updatechatuser`, {
      userId: Chatuser._id,
    });
    setChatuser(res.data);
  };
  useEffect(() => {
    updateChatuser();
  }, []);
  useEffect(() => {
    updateChatuser();
  }, [Chatuser._id]);

  useEffect(() => {
    setReceivemsg([...receivemsg, receivemessagefromContext]);
    getMessage();
    console.log("console for receive");
  }, [receivemessagefromContext]);
  // ---------------- chat trigger------------//
  const inputmsg = useRef(null);
  // build the sound effects for send/receive messages
  const [receiveSoundEffect, setreceiveSoundEffect] = useState();
  useEffect(() => {
    // const buildAudio = async () => {
    //   const permissionstatus = await Audio.getPermissionsAsync();
    //   // console.log(permissionstatus.granted);
    //   const requestPermission = await Audio.requestPermissionsAsync();
    //   // console.log(requestPermission.granted);
    //   // buid for receive message
    //   const { sound } = await Audio.Sound.createAsync(
    //     {
    //       uri: "https://audio.jukehost.co.uk/bKclSM5fjXjal4TKdH9zlQymbyFkGqAW",
    //     },
    //     { shouldPlay: false }
    //   );
    //   setreceiveSoundEffect(sound);
    // };
    // buildAudio();
    // get message
    saveChatDB();
    getMessage();
  }, []);
  // set message status
  const [MessageStatus, setMessageStatus] = useState("send");
  // send the send and receive msg to user DB
  const saveChatDB = async () => {
    await axios.post(`${Api}/saveChat`, {
      SenderId: user._id,
      ReceiverId: Chatuser._id,
      userId: user._id,
    });
  };
  useEffect(() => {
    const filter = user.Chats.some(
      (item) => item.SenderId === user._id && item.ReceiverId === Chatuser._id
    );

    if (!filter) {
      saveChatDB();
      console.log("condition", filter);
    }
  }, [Chatuser._id]);

  useEffect(() => {
    getMessage();
  }, [Chatuser._id]);
  // get time
  const currentDate = new Date();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const meridiem = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  const formattedTime =
    formattedHours + "." + formattedMinutes + " " + meridiem;
  // handle chat button
  useEffect(() => {
    getMessage();
  }, [convoContext]);
  const HandleSend = async () => {
    if (Flatlist_Scroll.current) {
      Flatlist_Scroll.current.scrollToEnd({ animated: true });
    }
    // send the send messages to DB for save
    // sendMessageDB();
    saveMessageSocket();
    // setConvo(convoContext);
    // play sound effects
    if (receiveSoundEffect) {
      // await receiveSoundEffect.replayAsync();
    }
    // ---
    if (inputmsg.current) {
      inputmsg.current.clear();
    }

    //end get time
    socket.emit("chat", {
      Message: messageText,
      Receiver: Chatuser._id,
      Sender: user.firstname,
      Time: formattedTime,
      senderId: user._id,
      Receivername: Chatuser.firstname,
    });
    setSendmsg([
      ...sendmsg,
      { Type: "send", Message: messageText, Time: formattedTime },
    ]);
  };
  // vibrate the phone if the receive message was true
  // if (receivemessagefromConetext) Vibration.vibrate();
  // build the voice chat
  const [recordBg, setRecordBg] = useState(false);
  const [recordVioce, setRecordVoice] = useState();
  const HandleStartRecord = async () => {
    setRecordBg(true);
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await recording.startAsync();
      setRecordVoice(recording);
    } catch (err) {
      console.log(err);
    }
  };
  const HandleStopRecord = async () => {
    setRecordBg(false);
    try {
      await recordVioce.stopAndUnloadAsync();
      console.log(recordVioce.getURI());
    } catch (err) {
      console.log(err);
    }
  };
  // play the sound
  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      {
        uri: recordVioce.getURI(),
      },
      { shouldPlay: false }
    );
  };
  // delete the message
  // message display state
  const [MessageOptions, setMessageOptions] = useState(false);
  // set the message index
  const [messageIndex, setMessageIndex] = useState();
  const [deleteType, setDeleteType] = useState("");
  const deleteMsg = () => {
    if (deleteType === "send") {
      const deleteSendmsg = sendmsg.filter(
        (msg, index) => index !== messageIndex
      );
      setSendmsg(deleteSendmsg);
    }
    if (deleteType === "receive") {
      const deleteRecivemsg = receivemsg.filter(
        (msg, index) => index !== messageIndex
      );
      setReceivemsg(deleteRecivemsg);
    }
  };
  // set the  chatrooom status
  const chatRoom = async () => {
    const res = await axios.post(`${Api}/ChatRoom`, {
      userId: user._id,
      chatRoomId: Chatuser._id,
    });
  };
  useEffect(() => {
    chatRoom();
  }, [Chatuser._id]);
  useEffect(() => {
    chatRoom();
  }, []);

  const [img, setImg] = useState("https://i.ibb.co/DkjPcNj/pending.png");

  return (
    <SafeAreaView
      style={{
        backgroundColor: "white",
        flex: 1,
        paddingTop: 50,
        backgroundColor: Colors.violet,
      }}
    >
      {/* Top wrapper */}
      <View
        style={{
          // borderWidth: 1,
          height: 100,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 20,
        }}
      >
        <Ripple onPress={() => navigation.navigate("home")}>
          <AntDesign name="arrowleft" size={24} color="white" />
        </Ripple>
        <View style={{ flexDirection: "column", alignItems: "center" }}>
          <Text style={{ color: "white", fontSize: 20 }}>
            {Chatuser.firstname}
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              // borderWidth: 1,
              // flex: 1,
              width: "100%",
            }}
          >
            <Entypo
              name="dot-single"
              size={27}
              color={Chatuser.status === "true" ? "#87e48e" : "#b30000"}
            />
            <Text
              style={{
                color: "white",
                flex: 0,
                textAlign: "center",
                paddingRight: 20,
              }}
            >
              {Chatuser.status === "true" ? "online" : "offline"}
            </Text>
          </View>
        </View>
        <Ripple onPress={() => setMessageOptions(!MessageOptions)}>
          <MaterialCommunityIcons
            name="dots-horizontal"
            size={27}
            color="white"
          />
        </Ripple>
        {/* message edit and delete options */}
        <View
          style={{
            borderWidth: 1,
            width: 200,
            borderColor: Colors.grey,
            position: "absolute",
            backgroundColor: "white",
            top: "80%",
            zIndex: 50,
            right: 20,
            borderRadius: 10,
            flexDirection: "column",
            rowGap: 20,
            padding: 15,
            justifyContent: "space-between",
            display: MessageOptions ? "flex" : "none",
          }}
        >
          <TouchableOpacity style={{ flexDirection: "row", columnGap: 10 }}>
            <AntDesign name="edit" size={24} color="black" />
            <Text>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flexDirection: "row", columnGap: 10 }}
            onPress={() => deleteMsg()}
          >
            <AntDesign name="delete" size={24} color="black" />
            <Text>Delete</Text>
            {/* delete option */}
            {/* <View style={{ display: "flex" }}>
              <TouchableOpacity>
                <Text>delete for me</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text>delete for everyone</Text>
              </TouchableOpacity>
            </View> */}
            {/* delete options */}
          </TouchableOpacity>
          <TouchableOpacity style={{ flexDirection: "row", columnGap: 10 }}>
            <Entypo name="forward" size={24} color="black" />
            <Text>forward</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ flexDirection: "row", columnGap: 10 }}>
            <Feather name="info" size={24} color="black" />
            <Text>info</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ flexDirection: "row", columnGap: 10 }}>
            <Entypo name="reply" size={24} color="black" />
            <Text>reply</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* message wrapper */}
      <View
        style={{
          backgroundColor: "white",
          flex: 1,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          paddingVertical: 30,
        }}
      >
        {/* messges */}
        <ScrollView
          ref={Flatlist_Scroll}
          style={{
            borderWidth: 0,
            borderColor: "blue",
            // paddingTop: 30,
            paddingHorizontal: 20,
          }}
        >
          {/* {convo.map((item, index) => (
           
          ))} */}
          <FlatList
            data={convo}
            scrollsToTop={true}
            renderItem={({ item, index }) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  justifyContent:
                    item && item.Type && item.Type === "send"
                      ? "flex-end"
                      : "flex-start",
                  marginBottom: 20,
                }}
              >
                <TouchableOpacity
                  onLongPress={() => {
                    setMessageOptions(true),
                      setMessageIndex(index),
                      setDeleteType(item.Type === "send" ? "send" : "receive");
                  }}
                >
                  <View
                    style={{
                      padding: 15,
                      paddingHorizontal: 40,
                      paddingLeft: 20,
                      borderRadius: 40,
                      borderBottomRightRadius:
                        item && item.Type && item.Type === "send" ? 0 : 40,
                      borderTopLeftRadius:
                        item && item.Type && item.Type === "send" ? 40 : 0,
                      backgroundColor:
                        item && item.Type && item.Type === "send"
                          ? "violet"
                          : "#e6e6ff",
                      flexDirection: "row",
                      justifyContent: "space-around",
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "bold",
                        color:
                          item && item.Type && item.Type === "send"
                            ? "white"
                            : "black",
                      }}
                    >
                      {item && item.message}
                    </Text>
                    <Text
                      style={{
                        color: "white",
                        paddingHorizontal: 10,
                        fontSize: 12,
                        alignSelf: "flex-end",
                      }}
                    >
                      {item && item.Time && item.Time}
                    </Text>
                    <Image
                      source={{ uri: img }}
                      style={{
                        width: 25,
                        height: 25,
                        resizeMode: "cover",
                        position: "absolute",
                        right: 10,
                        bottom: 10,
                        display: item.Type === "send" ? "flex" : "none",
                      }}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            )}
          />
        </ScrollView>
      </View>
      {/* message inoputs */}
      <View
        style={{
          // zIndex: 40,
          // position: "absolute",
          // bottom: 20,
          // borderWidth: 1,
          width: "100%",
          paddingHorizontal: 20,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          columnGap: 10,
          height: 80,
          backgroundColor: "white",
        }}
      >
        <View
          style={{
            backgroundColor: "#f0f1f1",
            flexDirection: "row",
            justifyContent: "space-between",
            flex: 1,
            paddingHorizontal: 20,
            alignItems: "center",
            borderRadius: 40,
          }}
        >
          <TextInput
            ref={inputmsg}
            placeholder="Type Message"
            style={{ borderWidth: 0, flex: 1, height: "100%", padding: 15 }}
            onChangeText={HandleMessagetext}
            focusable={false}
          />
          <Ripple
            onPressIn={HandleStartRecord}
            onPressOut={HandleStopRecord}
            style={{
              backgroundColor: recordBg ? Colors.violet : "#f0f1f1",
              borderRadius: 40,
              padding: 7,
            }}
          >
            <MaterialIcons
              name="keyboard-voice"
              size={35}
              color={Colors.grey}
            />
          </Ripple>
        </View>
        <Ripple onPress={HandleSend}>
          <Feather
            name="send"
            size={24}
            color="white"
            style={{
              backgroundColor: Colors.violet,
              padding: 15,
              borderRadius: 50,
            }}
          />
        </Ripple>
      </View>
    </SafeAreaView>
  );
};

export default Chats;
