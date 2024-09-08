import React, { Component, useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import TopBar from "../../components/Bar/TopBar";
import PrevButton from "../../components/Button/PrevButton";
import { globalstyle } from "../../styles/globalstyle";
import Slug from "../../components/Slug";
import logo from "../../assets/img/logo.webp";
import { FontAwesome } from "@expo/vector-icons";
import BlueButton from "../../components/Button/BlueButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginUser } from "../../utils/api";
import AuthContext from "../../context/AuthContext";

const Login = ({ navigation }) => {
  const { setAuth, auth } = useContext(AuthContext);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [forceRender, setForceRender] = useState(false);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleLogin = async () => {
    const userData = {
      email: email,
      password: password,
    };

    try {
      const response = await loginUser(userData);
      console.log("Login successful:", response);
      setAuth({
        token: response.token,
        user: response.user,
      });
      await AsyncStorage.setItem("token", response.token);
      await AsyncStorage.setItem("user", JSON.stringify(response.user));

      navigation.navigate("User");
    } catch (error) {
      console.log("Error logging in user:", error);
      window.alert("Information Error!");
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ position: "absolute", top: 40, left: 20 }}>
        <PrevButton navigation={navigation} />
      </View>

      {/* Logo */}
      <Image style={styles.logo} source={logo} />
      {/* Form */}
      <View style={{ width: "100%" }}>
        <Text style={styles.text}>ENTER AN EMAIL TO LOG IN</Text>
        <TextInput
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#acacad"
          style={styles.input}
        />
        <Text style={styles.text}>ENTER PASSWORD</Text>
        <View style={[styles.input, { marginBottom: 22 }]}>
          <TextInput
            placeholder=""
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#acacad"
            secureTextEntry={!isPasswordVisible}
            style={{ color: "#fff", fontSize: 17, fontFamily: "Mada_Medium" }}
          />
          <TouchableOpacity
            style={styles.visibilityButton}
            onPress={togglePasswordVisibility}
          >
            {isPasswordVisible ? (
              <FontAwesome name="eye-slash" size={20} color="#acacad" />
            ) : (
              <FontAwesome name="eye" size={20} color="#acacad" />
            )}
          </TouchableOpacity>
        </View>
        <BlueButton text={"LOG IN"} onclick={handleLogin} />
        <View style={[globalstyle.row, { alignSelf: "center", marginTop: 25 }]}>
          <Text
            style={styles.signIn}
            onPress={() => navigation.navigate("SignIn")}
          >
            REGISTER{" "}
          </Text>
          <Text style={styles.middleText}>Or </Text>
          <Text style={styles.signIn}>Countinue As GUEST </Text>
        </View>
        <View style={[{ alignSelf: "center", marginVertical: 35 }]}>
          <Text style={styles.bottomText}>
            By signing up or loggin in, you agree to our{" "}
          </Text>
          <View style={[globalstyle.row, { alignSelf: "center" }]}>
            <Text style={styles.bottomLink}> Terms & Conditions </Text>
            <Text style={styles.bottomText}>and </Text>
            <Text style={styles.bottomLink}> Privacy Policy </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: Platform.OS === "ios" ? "center" : "flex-end",
    backgroundColor: "#000",
    paddingHorizontal: 20,
  },
  logo: {
    width: 240,
    height: 100,
    objectFit: "contain",
    alignSelf: "center",
    marginBottom: 20,
  },
  text: {
    marginTop: 10,
    color: "#fff",
    fontFamily: "Mada_SemiBold",
    fontSize: 14,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#fff",
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 2,
    marginBottom: 13,
    color: "#fff",
    marginTop: 5,
    fontFamily: "Mada_Medium",
    fontSize: 17,
  },
  visibilityButton: {
    position: "absolute",
    right: 10,
    top: 15,
  },
  signIn: {
    color: "#fff",
    fontFamily: "Mada_SemiBold",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  middleText: {
    color: "#fff",
    fontFamily: "Mada_SemiBold",
    fontSize: 15,
    marginHorizontal: 3,
  },
  bottomText: {
    color: "#acacad",
    fontFamily: "Mada_Regular",
    fontSize: 15,
  },
  bottomLink: {
    color: "#acacad",
    fontFamily: "Mada_Regular",
    fontSize: 15,
    textDecorationLine: "underline",
  },
});

export default Login;
