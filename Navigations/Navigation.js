/** @format */

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../Screens/Home";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../Screens/Login";
import { NavigationContainer } from "@react-navigation/native";
import { View } from "react-native";
import { StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Chats from "../Screens/Chats";
import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../Consts/Const";
import { faL } from "@fortawesome/free-solid-svg-icons";
import Search from "../Screens/Search";
import User from "../Screens/User";
import {
  TransitionSpecs,
  HeaderStyleInterpolators,
} from "@react-navigation/stack";

const TabNavigation = () => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      initialRouteName="home"
      screenOptions={{
        tabBarStyle: {
          height: 80,
          backgroundColor: Colors.grey,
        },
        tabBarShowLabel: false,
        unmountOnBlur: true,
      }}
    >
      <Tab.Screen
        name="home"
        component={Home}
        options={{
          headerShown: false,
          tabBarIcon: () => <AntDesign name="home" size={27} color="white" />,
        }}
      />
      <Tab.Screen
        name="chat"
        component={Chats}
        options={{
          headerShown: false,
          tabBarIcon: () => (
            <MaterialIcons name="chat" size={27} color="white" />
          ),
          tabBarStyle: {
            display: "none",
          },
        }}
      />
      <Tab.Screen
        name="search"
        component={Search}
        options={{
          headerShown: false,
          tabBarIcon: () => <AntDesign name="plus" size={27} color="white" />,
          tabBarIconStyle: {
            backgroundColor: Colors.violet,
            position: "absolute",
            top: -36,
            width: 80,
            height: 80,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 40,
            borderColor: "white",
            borderWidth: 10,
          },
        }}
      />
      <Tab.Screen
        name="settings"
        component={Chats}
        options={{
          headerShown: false,
          tabBarIcon: () => (
            <Ionicons name="settings-outline" size={27} color="white" />
          ),
        }}
      />
      <Tab.Screen
        name="user"
        component={User}
        options={{
          headerShown: false,
          tabBarIcon: () => <AntDesign name="user" size={24} color="white" />,
        }}
      />
    </Tab.Navigator>
  );
};
// code for slide transition

// stack navigator
const StackNavigation = () => {
  const Stack = createNativeStackNavigator();
  return (
    <View style={style.container}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="login"
          screenOptions={{
            headerShown: false,
            gestureDirection: "horizontal",
            ...TransitionSpecs.SlideFromRightIOS,
            headerStyleInterpolator: HeaderStyleInterpolators.forFade,
          }}
        >
          <Stack.Screen
            name="index"
            component={TabNavigation}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="login"
            component={Login}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default StackNavigation;

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
});
