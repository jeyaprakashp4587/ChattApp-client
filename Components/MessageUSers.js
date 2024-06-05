/** @format */

import { StyleSheet, Text, View, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "../Consts/Const";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCheckDouble } from "@fortawesome/free-solid-svg-icons";
import io from "socket.io-client";

const MessageUSers = ({ convo }) => {
  // console.log(convo);
  return (
    <View
      style={{
        // borderWidth: 1,
        height: 100,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <View style={{ width: 90, borderWidth: 0 }}>
        <Image
          source={require("../assets/827.jpg")}
          style={{ width: "100%", height: "100%", borderRadius: 100 }}
        />
      </View>
      <View style={{ flexDirection: "column", flex: 1 }}>
        <Text style={{ fontSize: 20 }}>{convo ? convo.Sender : "user1"}</Text>
        <Text style={{ color: Colors.light_violet, fontWeight: 600 }}>
          {convo ? convo.Message : "none"}
        </Text>
      </View>
      <View
        style={{
          flexDirection: "column",
          alignItems: "flex-end",
          rowGap: 10,
        }}
      >
        <Text style={{ color: Colors.grey }}>
          {convo ? convo.Time : "none"}
        </Text>
        {convo[0] ? (
          <View
            style={{
              backgroundColor: "red",
              borderRadius: 30,
              width: 20,
              height: 20,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white" }}>1</Text>
          </View>
        ) : (
          <FontAwesomeIcon icon={faCheckDouble} color="blue" />
        )}
      </View>
    </View>
  );
};

export default MessageUSers;

const styles = StyleSheet.create({});
