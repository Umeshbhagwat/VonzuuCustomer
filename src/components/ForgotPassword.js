import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import GlobleStyle from "../utils/GlobleStyle";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import Modal from "react-native-modal";
import Entypo from "react-native-vector-icons/Entypo";
import { useSelector, useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setCustomerId } from "../reduxtoolkit/CustomerIdSlice";
import Api from "../services/Api";
import Toast from "react-native-toast-message";
import { RFPercentage } from "react-native-responsive-fontsize";
 
const ForgotPassword = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isBottomModalVisible, setBottomIsModalVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passError, setPassError] = useState(false);
  const [enterWrongOtpMes, setEnterWrongOtpMes] = useState(false);
  const [email, SetEmail] = useState("");
  const [showErrorMesg, setShowErrorMesg] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const expectedOtp = "1234";
  const otpInputs = useRef([]);
  const [Error, setError] = useState(false);
 
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  const [showTrue, setshowTrue] = useState(false);
  const cehckEmail = async () => {
    if (!validateEmail(email)) {
      setError(true);
      setshowTrue(false);
    } else {
      try {
        const endPoint = `/api/v1/User/ForgotPassword`;
        const data = {
          email: `${email}`,
          phone: "",
          imei1: "",
          imei2: "",
          deviceNo: "",
          latPos: "",
          longPos: "",
          deviceToken: "",
          deviceType: "",
        };
        const responce = await Api.postEndpointData(endPoint, data);
        // console.log(responce.data.statusCode, "1231232131232");
        if (responce.data.statusCode === 200) {
          // Alert.alert("Data aya")
          setshowTrue(true);
          setError(false);
          setCustomerId(responce.data.userID);
          console.log(responce.data.userID,"this is and vrify otp data")
          await AsyncStorage.setItem("customerId", responce.data.userID.toString());
          // dispatch(setCustomerId(responce.data.userID));
        }
      } catch (error) {
        setError(true);
        setshowTrue(false);
        Alert.alert("Please Enter Valid email");
      }
    }
  };
 
  const dispatch = useDispatch();
  const navigation = useNavigation();
 
  const handleVerify = async () => {
    const enteredOtp = otp.join("");
console.log(customerId,"this and customer id")
    console.log("This is an OTP ", enteredOtp);
 
    try {
      const endPoint = `/api/v1/User/VerifyOtp`;
      const data = {
        storeId: 1046,
        apiKey: "BDD6B8BC-6C51-49C6-8E17-9E09B86E4DBB",
        uniqueSeoCode: "1",
        customerId: `${customerId}`,
        otp: `${enteredOtp}`,
      };
 
      const response = await Api.postEndpointData(endPoint, data);
      console.log(response,"========")
      if (response.data.statusCode === 200) {
        console.log("OTP verified successfully");
        setBottomIsModalVisible(true);
      } else {
        console.log("OTP verification failed", otp);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setEnterWrongOtpMes(true);
      setTimeout(() => {
        setEnterWrongOtpMes(false);
      }, 2000);
      // Handle the error as needed
    }
    // navigation.navigate('WelcomeScreen')
  };
 
  const handleKeyPress = (event, index) => {
    if (event.nativeEvent.key === "Backspace" && index > 0) {
      otpInputs.current[index - 1].focus();
      const newOtp = [...otp];
      newOtp[index - 1] = ""; // Clear the value in the previous input field
      setOtp(newOtp);
    }
  };
 
  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
 
    setOtp(newOtp);
 
    if (index < otpInputs.current.length - 1 && text !== "") {
      otpInputs.current[index + 1].focus();
    }
    console.log("This is otp value", text);
  };
 
  const handleConfirmPassword = async () => {
    if (password === confirmPassword) {
      try {
        const endpoint = `/api/v1/User/SetPassword`;
        const data = {
          storeId: 1046,
          apiKey: "BDD6B8BC-6C51-49C6-8E17-9E09B86E4DBB",
          uniqueSeoCode: "1",
          newPassword: `${confirmPassword}`,
          customerId: `${customerId}`,
        };
        console.log(
          "values of setpass and confirm pass",
          password + " " + confirmPassword
        );
 
        const responce = await Api.postEndpointData(endpoint, data);
        if (responce.data.statusCode === 200) {
          Toast.show({
            text1:"Passwrod reset complete",
            type:"info",
            visibilityTime:2000
          })
          navigation.navigate("WelcomeScreen");
        }
      } catch (error) {
        console.log("this is an error in setPassword", error);
      }
    } else {
      setPassError(true);
      setTimeout(() => {
        setPassError(false);
      }, 2000);
    }
  };
 
  const SendForgotPassRequest = async () => {};
 
  const handleResendPassword = async () => {
    try {
      const endPoint = "";
      const data = {};
      const responce = Api.postEndpointData(endPoint, data);
    } catch (error) {}
  };
 
  return (
    <View style={styles.container}>
      <SafeAreaView>

      {/* <View style={{ height: 45, width: 45, borderRadius: 50, backgroundColor: "#E7ECEF", justifyContent: "center", alignItems: "center", marginHorizontal: 10, marginVertical: 30 }}>
        <TouchableOpacity onPress={() => handlePrviousScreen()}>
          <MaterialIcons name="arrow-back-ios" size={25} color={"black"} />
        </TouchableOpacity>
      </View> */}
      {/* <View style={styles.content}> */}

      <TouchableOpacity onPress={() => navigation.goBack()}>
          <View
            style={{
              padding: 8,
              backgroundColor: "#F2F5F8",
              width: 45,
              borderRadius: 10,
              left: 10,
            }}
          >
            <MaterialIcons name="arrow-back" size={25} color={"black"} />
          </View>
        </TouchableOpacity>

        <Text style={[GlobleStyle.CustomFont, styles.headingText]}>
          Forgot Password
        </Text>
        <View style={{ flexDirection: "row",  alignItems:"center",justifyContent: "space-between" }}>
          <TextInput
            label="Eamil"
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={(text) => SetEmail(text)}
            // secureTextEntry={!passwordVisible} // Use secureTextEntry to hide/show password
            style={
             
              { borderWidth: 1, borderColor: Error === true ? "red" : "gray" ,width:"82%",borderRadius:12,padding:15}
            }
            theme={{
              colors: { primary: "#002244", underlineColor: "transparent" },
            }}
            placeholder="Enter email"

          />
          <TouchableOpacity
            style={{
             padding:12,
              backgroundColor: "#33FFC2",
            //  width:"14%",height:"100%",
           
            
              borderRadius: 10,
            }}
            onPress={() => cehckEmail()}
          >
            <Text
              style={[GlobleStyle.CustomFont, { fontSize: 15, color: "black" }]}
            >
              Send
            </Text>
          </TouchableOpacity>
        </View>
        {Error === true ? (
          <Text
            style={{
              color: "red",
              fontFamily: "Poppins-MediumItalic",
              fontSize: RFPercentage(1.3),
              marginTop: 2,
              alignSelf: "center",
            }}
          >
            Please Provide valid email address
          </Text>
        ) : null}
 
        {showTrue === true ? (
          <View style={styles.otpInputContainer}>
            {Array.from({ length: 4 }).map((_, index) => (
              <TextInput
                key={index}
                style={styles.otpInput}
                value={otp[index]}
                onChangeText={(text) => handleOtpChange(text, index)}
                keyboardType="numeric"
                maxLength={1}
                ref={(input) => (otpInputs.current[index] = input)}
                onKeyPress={(event) => handleKeyPress(event, index)}
              />
            ))}
          </View>
        ) : null}
 
        <TouchableOpacity
          style={{
            flexDirection: "row-reverse",
            marginHorizontal: 15,
            marginVertical: 20,
          }}
          onPress={() => SendForgotPassRequest()}
        >
          <Text style={[GlobleStyle.CustomFont, styles.resendCode]}>
            Resend Code
          </Text>
        </TouchableOpacity>
 
        {enterWrongOtpMes ? (
          <Text
            style={{
              color: "red",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Please enter correct OTP
          </Text>
        ) : (
          <Text></Text>
        )}
 
        <View style={styles.verifyBtnMain}>
          <TouchableOpacity onPress={handleVerify}>
            <View style={[styles.verifyBtnContainer, GlobleStyle.PrimaryColor]}>
              <Text
                style={[
                  styles.verifyInBtnText,
                  GlobleStyle.CustomHeadingColor,
                  GlobleStyle.CustomFont,
                ]}
              >
                Verify OTP
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      {
        <Modal
          isVisible={isBottomModalVisible}
          style={styles.bottomModal}
          backdropTransitionOutTiming={0}
          onBackdropPress={() => setBottomIsModalVisible(false)}
          onSwipeComplete={() => setBottomIsModalVisible(false)}
          swipeDirection={["down"]}
        >
          <View style={styles.modalContent}>
            {
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Text
                  style={[
                    GlobleStyle.CustomFont,
                    { fontSize: 18, color: "black" },
                  ]}
                >
                  Set New Password{" "}
                </Text>
 
                <View style={styles.TextInputContainer}>
                  <TextInput
                    label="Password"
                    onChangeText={(text) => setPassword(text)}
                    secureTextEntry={!passwordVisible} // Use secureTextEntry to hide/show password
                    style={styles.textInput}
                    theme={{
                      colors: {
                        primary: "#002244",
                        underlineColor: "transparent",
                      },
                    }}
                    placeholder="Set Password"
                  />
                  {/* Add eye icon to toggle password visibility */}
                  <TouchableOpacity
                    style={{ top: 10, left: 5 }}
                    onPress={() => setPasswordVisible(!passwordVisible)}
                  >
                    {/* <Entypo
                            name={passwordVisible ? 'eye' : 'eye-with-line'}
                            size={24}
                            color="#002244"
                            /> */}
                  </TouchableOpacity>
                </View>
 
                <View style={[styles.TextInputContainer, { left: 8 }]}>
                  <TextInput
                    label="Password"
                    onChangeText={(text) => setConfirmPassword(text)}
                    secureTextEntry={!passwordVisible} // Use secureTextEntry to hide/show password
                    style={styles.textInput}
                    theme={{
                      colors: {
                        primary: "#002244",
                        underlineColor: "transparent",
                      },
                    }}
                    placeholder="Confirm Password"
                  />
                  {/* Add eye icon to toggle password visibility */}
                  <TouchableOpacity
                    style={{ top: 10, left: 5 }}
                    onPress={() => setPasswordVisible(!passwordVisible)}
                  >
                    <Entypo
                      name={passwordVisible ? "eye" : "eye-with-line"}
                      size={24}
                      color="#002244"
                    />
                  </TouchableOpacity>
                </View>
 
                <View>
                  {passError ? (
                    <View>
                      <Text style={{ color: "red" }}>
                        set password and confirm password must be same{" "}
                      </Text>
                    </View>
                  ) : (
                    <View></View>
                  )}
                </View>
 
                <View style={styles.verifyBtnMain}>
                  <TouchableOpacity onPress={() => handleConfirmPassword()}>
                    <View
                      style={[
                        styles.ConfirmBtnContainer,
                        GlobleStyle.PrimaryColor,
                      ]}
                    >
                      <Text
                        style={[
                          styles.verifyInBtnText,
                          GlobleStyle.CustomHeadingColor,
                          GlobleStyle.CustomFont,
                        ]}
                      >
                        Confirm Password
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            }
          </View>
        </Modal>
      }
      </SafeAreaView>
    </View>
    
  );
};
 
export default ForgotPassword;
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // top: 40,
    paddingTop:40,
    paddingHorizontal:15,
    backgroundColor:"white",
    // marginHorizontal: 15,
 
  },
  content: {
  
  },
  headingText: {
    fontSize: 22,
    color: "black",
    paddingVertical: 10,
  },
  otpInputContainer: {
    flexDirection: "row",
    marginTop: 20,
    color: "black",
  },
  otpInput: {
    flex: 1,
    height: 40,
    borderBottomWidth: 1,
    borderColor: "black",
    marginHorizontal: 5,
    marginVertical: 10,
    textAlign: "center",
    fontSize: 18,
    color: "black",
  },
  resendCode: {
    borderColor: "black",
    borderBottomWidth: 1,
    color: "black",
    fontSize: 20,
  },
  verifyBtnMain: {
    marginVertical: 30,
    paddingVertical: 20,
    alignItems: "center",
  },
  verifyBtnContainer: {
    height: responsiveHeight(7),
    width: responsiveWidth(90),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  ConfirmBtnContainer: {
    height: responsiveHeight(7),
    width: responsiveWidth(50),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  verifyInBtnText: {
    fontSize: 20,
  },
  bottomModal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "#f5f5f5",
    padding: 22,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: responsiveHeight(40), // Adjust the height as needed
  },
  TextInputContainer: {
    padding: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    color: "black",
  },
  textInput: {
    // backgroundColor: 'transparent',
    width: 300,
borderWidth:1,borderColor:"grey",
    borderRadius: 10,
    padding: 10,
    // Set the background color to transparent
  },
});
 