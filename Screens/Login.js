/** @format */

import { View, Text, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Colors, Images } from "../Consts/Const";
import { Image } from "react-native";
import Ripple from "react-native-material-ripple";
import loginimg from "../assets/login.jpg";
import { TextInput } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { useData } from "../Context/Provider";
import io from "socket.io-client";
import { KeyboardAvoidingView } from "react-native";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Api from "../Api";

// import jwt_decode from "jsonwebtoken";

const Login = () => {
  const nav = useNavigation();
  const socket = io(Api);
  const navigation = useNavigation();
  // import data from context
  const { setUser, user } = useData();
  const [loading, setloading] = useState(false);
  const [login, setLogin] = useState("main");
  // get user data from textinputs
  const [userName, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [socketId, setsocketId] = useState("");
  const HandlePassword = (text) => {
    setPassword(text);
  };
  const HandleFirstname = (text) => {
    setFirstname(text);
  };
  const HandleUsername = (text) => {
    setUsername(text);
  };
  // log in userdata

  const [loginUsername, setloginUsername] = useState("");
  const [loginPassword, setloginPassword] = useState("");
  const HandleLoginusername = (text) => {
    setloginUsername(text);
  };
  const HandleLoginpassword = (text) => {
    setloginPassword(text);
  };
  // handle signup
  useEffect(() => {
    socket.on("connect", () => {
      // console.log("user connected");
      setsocketId(socket.id);
      // console.log("user id ", socketId);
    });
  }, []);
  const HandleSignup = () => {
    axios
      .post(`${Api}/user`, {
        userName: userName,
        Password: Password,
        firstname: firstname,
        socketId: socketId,
      })
      .then((data) => {
        console.log(data.data);
        setLogin("signin");
      });
  };

  const HandleSignin = async () => {
    setloading(true);
    axios
      .post(`${Api}/login`, {
        UserName: loginPassword,
        Password: loginPassword,
      })
      .then((data) => {
        AsyncStorage.setItem("userid", data.data.user._id);
        setUser(data.data.user._id);
        if (data.data.user) {
          setloading(false);
          navigation.navigate("index");
        }
      });
  };
  useEffect(() => {
    const valid = async () => {
      const userdata = await AsyncStorage.getItem("userid");
      if (userdata) {
        setUser(userdata);
        navigation.navigate("index");
      }
    };
    valid();
  }, []);
  // -- components----- //
  // sign up
  const SignUp = () => {
    return (
      <View
        style={{ flex: 1, backgroundColor: "white", paddingHorizontal: 20 }}
      >
        <Header />
        <View style={{ flexDirection: "column", rowGap: 20 }}>
          <Text
            style={{ textAlign: "center", fontSize: 35, fontWeight: "bold" }}
          >
            Register
          </Text>
          <Text
            style={{ textAlign: "center", color: Colors.grey, fontSize: 17 }}
          >
            You and Your Friends always Connected
          </Text>
        </View>
        <View style={{ flexDirection: "column", rowGap: 20, marginTop: 50 }}>
          <TextInput
            placeholder="First Name"
            style={{
              borderWidth: 1,
              borderColor: Colors.grey,
              padding: 13,
              borderRadius: 10,
            }}
            onChangeText={HandleFirstname}
            value={firstname}
          />
          <TextInput
            placeholder="Email or username"
            style={{
              borderWidth: 1,
              borderColor: Colors.grey,
              padding: 13,
              borderRadius: 10,
            }}
            onChangeText={HandleUsername}
            value={userName}
          />
          <TextInput
            placeholder="Password"
            secureTextEntry={true}
            style={{
              borderWidth: 1,
              borderColor: Colors.grey,
              padding: 13,
              borderRadius: 10,
            }}
            onChangeText={HandlePassword}
            value={Password}
          />
          <TextInput
            placeholder="Confirm password"
            style={{
              borderWidth: 1,
              borderColor: Colors.grey,
              padding: 13,
              borderRadius: 10,
            }}
          />
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontSize: 17 }} numberOfLines={2}>
              I agree with the{" "}
              <Text style={{ color: Colors.blue }}>Term and Conditions</Text>{" "}
              and the <Text style={{ color: Colors.blue }}>Privacy Policy</Text>
            </Text>
          </View>
        </View>
        <View
          style={{
            width: "100%",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            rowGap: 40,
            marginTop: 40,
          }}
        >
          <Ripple
            style={{
              backgroundColor: Colors.blue,
              alignItems: "center",
              justifyContent: "center",
              width: "70%",
              padding: 10,
              borderRadius: 20,
            }}
            onPress={() => HandleSignup()}
          >
            <Text style={{ color: "white", fontSize: 18 }}>Sign up</Text>
          </Ripple>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{ textAlign: "center", color: Colors.grey, fontSize: 16 }}
            >
              Already have an account?
            </Text>
            <Text style={{ color: Colors.blue }}> Login</Text>
          </View>
        </View>
      </View>
    );
  };
  // sign in log in
  const SignIn = () => {
    return (
      <SafeAreaView
        style={{
          backgroundColor: "white",
          paddingHorizontal: 20,
          flex: 1,
          flexDirection: "column",
          rowGap: 30,
        }}
      >
        <Header />
        <Text style={{ fontSize: 35, fontWeight: "bold", textAlign: "center" }}>
          Login
        </Text>
        <Text style={{ color: Colors.grey, fontSize: 17, textAlign: "center" }}>
          Remember to get up & stretch once in a while-your friends at chat.
        </Text>
        {/* text input fields */}
        <KeyboardAvoidingView>
          <View style={{ flexDirection: "column", rowGap: 25 }}>
            <TextInput
              placeholder="Email or username"
              focusable
              style={{
                borderWidth: 1,
                borderColor: Colors.grey,
                padding: 13,
                borderRadius: 10,
              }}
              onChangeText={HandleLoginusername}
              value={loginUsername}
            />
            <TextInput
              placeholder="Password"
              secureTextEntry={true}
              textContentType="password"
              style={{
                borderWidth: 1,
                borderColor: Colors.grey,
                padding: 13,
                borderRadius: 10,
              }}
              onChangeText={HandleLoginpassword}
              value={loginPassword}
            />
          </View>
        </KeyboardAvoidingView>
        {/* button */}
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            rowGap: 40,
            marginTop: 30,
          }}
        >
          <Ripple
            style={{
              backgroundColor: Colors.blue,
              alignItems: "center",
              justifyContent: "center",
              width: "70%",
              padding: 10,
              borderRadius: 20,
            }}
            onPress={() => HandleSignin()}
          >
            <Text style={{ color: "white", fontSize: 18 }}>Sign in </Text>
          </Ripple>
          <Ripple>
            <Text
              style={{ textAlign: "center", color: Colors.blue, fontSize: 15 }}
            >
              Forgot Password?
            </Text>
          </Ripple>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 17 }}>Don't have an account? </Text>
          <Pressable onPress={() => setLogin("signup")}>
            <Text
              style={{ color: Colors.blue, textDecorationLine: "underline" }}
            >
              Sign up here
            </Text>
          </Pressable>
        </View>
        <ActivityIndicator
          style={{ display: loading ? "flex" : "none" }}
          size={40}
        />
      </SafeAreaView>
    );
  };
  // main screen
  const Main = () => {
    return (
      <View
        style={{
          backgroundColor: "white",
          flex: 1,
          width: "100%",
          paddingHorizontal: 20,
          // rowGap: 30,
          rowGap: 20,
        }}
      >
        {/* header bar */}
        <Header />
        {/* header */}
        <Text
          style={{
            color: Colors.black,
            fontSize: 35,
            textAlign: "center",
            fontWeight: 600,
          }}
        >
          Get Started
        </Text>
        <Text style={{ color: Colors.grey, fontSize: 18, textAlign: "center" }}>
          Start with siging up or sign in
        </Text>
        <View
          style={{
            justifyContent: "center",
            alignContent: "center",
            width: "100%",
            flexDirection: "row",
          }}
        >
          <Image
            // source={{ uri: "https://i.ibb.co/BPCS0WW/9649925-7495.jpg" }}
            source={require("../assets/login.jpg")}
            style={{
              width: 300,
              height: 300,
              borderRadius: 5,
              marginHorizontal: "auto",
              // borderWidth: 1,
            }}
          />
        </View>
        {/* buttons */}
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            rowGap: 20,
            marginTop: 20,
          }}
        >
          <Ripple
            style={{
              backgroundColor: "#0383F6",
              padding: 15,
              paddingHorizontal: 30,
              width: "70%",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 40,
            }}
            onPress={() => setLogin("signup")}
          >
            <Text style={{ color: "white", fontWeight: 600 }}>Sign up</Text>
          </Ripple>
          <Ripple
            style={{
              backgroundColor: "white",
              padding: 15,
              paddingHorizontal: 30,
              width: "70%",
              justifyContent: "center",
              alignItems: "center",
              elevation: 8,
              borderRadius: 40,
            }}
            onPress={() => setLogin("signin")}
          >
            <Text>Sign in</Text>
          </Ripple>
        </View>
      </View>
    );
  };
  // header
  const Header = () => (
    <View
      style={{
        height: 80,
        //   borderWidth: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <FontAwesome6 name="bars-staggered" size={24} color="black" />
      <Entypo
        name="message"
        size={24}
        color="white"
        style={{
          backgroundColor: "#0383F6",
          borderRadius: 30,
          padding: 5,
        }}
      />
    </View>
  );
  // ------ //
  return (
    <View style={{ flex: 1 }}>
      {login === "main" ? (
        <Main />
      ) : login === "signin" ? (
        <SignIn />
      ) : login === "signup" ? (
        <SignUp />
      ) : null}
    </View>
  );
};

export default Login;
