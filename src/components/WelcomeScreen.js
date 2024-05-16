import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Keyboard,
  StatusBar,
  KeyboardAvoidingView,
  SafeAreaView,
} from "react-native";
import { TextInput } from "react-native-paper";
// import {
//   responsiveHeight,
//   responsiveWidth,
//   responsiveFontSize
// } from "react-native-responsive-dimensions";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "../utils/Responsive";
import { CallingCodePicker } from "@digieggs/rn-country-code-picker";
import GlobleStyle from "../utils/GlobleStyle";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import PhoneInput from "react-native-phone-number-input";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setCustomerId } from "../reduxtoolkit/CustomerIdSlice";
import Api from "../services/Api";
import * as logger from "../utils/logger";
import { wp } from "../utils/SizeResponcive";
import { Wave } from "react-native-animated-spinkit";
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
// import auth from '@react-native-firebase/auth';
// import {LoginManager, AccessToken} from 'react-native-fbsdk-next';
// import Orientation from 'react-native-orientation';
import Toast from "react-native-toast-message"
import { RFPercentage } from "react-native-responsive-fontsize";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const WelcomeScreen = () => {
  const [countryCode, setCountryCode] = useState("");
  const [selectedCallingCode, setSelectedCallingCode] = useState("");
  const phoneInput = React.useRef(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumberFocused, setPhoneNumberFocused] = useState(false);
  const [showSocialSignUp, setShowSocialSignUp] = useState(true);
  const [password, setPassword] = useState("");
  const [showSocialButtons, setShowSocialButtons] = useState(true);
  const [signInWithEmail, setSignInWithEmail] = useState(true);
  const [responseMeg, setResponseMeg] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [Loading, setLoading] = useState(false)
  const [userInfo, SetUserInfo] = useState('');
  const [userData, setUserData] = useState({});
  const navigation = useNavigation();

  // console.log(typeof(countryCode),"--------------------->")

  // const [countryCode, setcountryCode] = useState("+1")

  const handelecountrychange = (code) => {
    // setCountryCode(code)
    setCountryCode(code.callingCode[0])


  }

  const dispatch = useDispatch();

  useEffect(() => {
    // Orientation.lockToPortrait();
    setResponseMeg("");
    setEmail("");
    setPassword("");
    getCutomerId();

  }, []);

  const getCutomerId = async () => {
    try {
      const customerId = await AsyncStorage.getItem("customerId");
      logger.log("The customerId****", customerId);
      dispatch(setCustomerId(customerId));
    } catch (error) {
      logger.error("Error getting customerId from AsyncStorage:", error);
    }
  };

  //   useEffect(() => {
  //     GoogleSignin.configure({
  //         webClientId: '641306258826-cavo5gc43b1dpokb0os5794b3r3n013b.apps.googleusercontent.com',
  //         offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  //        hostedDomain: '', // specifies a hosted domain restriction
  //       forceCodeForRefreshToken: true,
  //     });
  // }, []);


  const cutomerId = useSelector((state) => state.CustomerIdSlice.customerId);
  console.log("customerId from Store", cutomerId);

  const handlefaceBook = () => {
    logger.log("This is a handle Facebook");
  };

  const handlePhoneNumberFocus = () => {
    logger.log("This is a blur");
    setShowSocialButtons(false);
  };

  const handlePhoneNumberBlur = () => {
    logger.log("This is a blur");
    setShowSocialButtons(true);
  };

  //   const handaleGoogle = async () => {
  //     try {
  //       await GoogleSignin.hasPlayServices();
  //       const userInfo = await GoogleSignin.signIn();
  //       SetUserInfo(userInfo.user); // Update state with user information
  //       console.log('User Info:', userInfo.user); // Log user information to console
  //   } catch (error) {
  //       if (error.code === statusCodes.SIGN_IN_CANCELLED) {
  //           // user cancelled the login flow
  //       } else if (error.code === statusCodes.IN_PROGRESS) {
  //           // operation (e.g. sign in) is in progress already
  //       } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
  //           // play services not available or outdated
  //       } else {
  //           // some other error happened
  //       }
  //   }
  // };


  // const facebookLogin = async () => {
  //   // Attempt login with permissions
  //   const result = await LoginManager.logInWithPermissions([
  //     'public_profile',
  //     'email',
  //   ]);

  //   if (result.isCancelled) {
  //     throw 'User cancelled the login process';
  //   }

  //   // Once signed in, get the users AccesToken
  //   const data = await AccessToken.getCurrentAccessToken();

  //   if (!data) {
  //     throw 'Something went wrong obtaining access token';
  //   }

  //   // Create a Firebase credential with the AccessToken
  //   const facebookCredential = auth.FacebookAuthProvider.credential(
  //     data.accessToken,
  //   );

  //   // Sign-in the user with the credential
  //   return auth().signInWithCredential(facebookCredential);
  // };

  const validatePassword = (password) => {
    const regex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{"':;?/>.<,])(?=.*[a-zA-Z]).{8,}$/;
    return regex.test(password);
  };
  const [Err, seterr] = useState("");

  const handleSignIn = async () => {
    setLoading(true);
    // Validate inputs before signing in
    if (!signInWithEmail && phoneNumber.length !== 10) {
      seterr("Enter valid  10 Number");
      setLoading(false);
      return;
    }
    if (signInWithEmail && !validateEmail(email)) {
      seterr("Please Enter Valid email");
      // Alert.alert("Emil invalid");
      setResponseMeg("Please chack your email and password..");

      setLoading(false);
      return;
    } else {
      if (!validatePassword(password)) {
        seterr("Please Enter your Password");
        // Alert.alert("ivalid pass");
        setLoading(false);
      } else {
        try {
          const endpoint = `/api/v1/User/CustomerLogin`;
          const data = {
            storeId: 1046,
            apiKey: "BDD6B8BC-6C51-49C6-8E17-9E09B86E4DBB",
            uniqueSeoCode: "1",
            email: `${email}`,
            phone: `${countryCode} ${phoneNumber}`,
            pswd: `${password}`,
            imei1: "string",
            imei2: "string",
            deviceNo: "string",
            latPos: "string",
            longPos: "string",
            deviceToken: "string",
            deviceType: "string",
            guestUserId: 0,
          };
          console.log("&&&&", data);
          const response = await Api.postEndpointData(endpoint, data);

          // console.log(response.data.status,"123123123123")
          if (response) {
            logger.log("Sign Up succsess..");
            console.log("?????????}}}}}",response.data);
            const customerId = response.data.userID;

            const custEmail = response.data.email;
            const custFirstName =response.data.firstName;
            const custlastName =response.data.lastName;
            const custMobileNo =response.data.mobileNo;

            await AsyncStorage.setItem("customerId", customerId.toString());
            await AsyncStorage.setItem("custEmail", custEmail.toString());
            await AsyncStorage.setItem("custFirstName", custFirstName.toString());
            await AsyncStorage.setItem("custlastName", custlastName.toString());
            await AsyncStorage.setItem("custMobileNo", custMobileNo.toString());

            dispatch(setCustomerId(customerId));
            Toast.show({
              visibilityTime: 2000,
              text1: "Vonzuu",
              text2: "Signup Successgfully",
              type: "success"
            })
            navigation.navigate("TabStackNavigator");
            Keyboard.dismiss();
            setLoading(false)
          } else {
            logger.log("error in singn Up");
            // Handle the case when OTP verification fa
            setLoading(false)
            Toast.show({
              visibilityTime: 3000,
              // text1:"Vonzuuaa",
              text1: "",
              type: "error"
            })
          }
        } catch (error) {

          logger.error("Error fetching data:", error);
          setLoading(false)
          Toast.show({
            visibilityTime: 3000,
            // text1:"Vonzuuaa",
            text1: "Please check Email and phone number",
            type: "error"
          })
          if (
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            logger.error("API Error:", error.response.data.message);
            setLoading(false)
            Toast.show({
              visibilityTime: 3000,
              // text1:"Vonzuuaa",
              text1: error.response.data.message,
              type: "error"
            })
          }
          Keyboard.dismiss();
        }




      }
    }
  };

  const toggleSignInMethod = () => {
    setSignInWithEmail(!signInWithEmail);
  };

  const [ImageData, setImageData] = useState("https://vonzuuliveimage.s3.amazonaws.com/v2/app-assets/home-images/Rectangle+2800-2.png")
  console.log(ImageData, "PPPPPPPPPPPPPPPPPPPPP")
  const getImage = async () => {
    const endpoint = "/api/v1/User/AppVersion_N_LoginImage?StoreId=1046"
    const response = await Api.fetchEndpointData(endpoint)
    if (response.data.statusCode === 404) {

      setImageData(response.data.data)
      // console.log("=========================================>?>>>>",response.data.data)
    } else {

    }
  }

  const handlePhoneNumberChange = (text) => {
    // Remove any non-digit characters
    const cleanedText = text.replace(/\D/g, "");

    // Validate phone number (exactly 10 digits)
    if (cleanedText.length <= 10) {
      setPhoneNumber(cleanedText);
    }
  };

  const handleEmailChange = (text) => {
    // Validate email (you can use a more sophisticated validation)
    setEmail(text);
  };

  const handleCallingCodeChange = (callingCode) => {
    setSelectedCallingCode(callingCode);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* <ScrollView
      keyboardShouldPersistTaps={"always"}
      automaticallyAdjustKeyboardInsets={false}
    > */}
        {/* <StatusBar  translucent={true} backgroundColor={"transparent"}/> */}
        <Image
          source={{ uri: ImageData }}
          style={styles.imageBanner}
          resizeMode="cover"
        />
        <View style={styles.overlayContainer}>
          <Image
            source={require("../assets/images/VonzuuLogo.png")}
            style={styles.logoImage}
          />
        </View>

        <View
          style={{
            backgroundColor: "white",
            paddingHorizontal: 14,
            marginTop: -10,
            borderTopRightRadius: 12,
            borderTopLeftRadius: 12,
            paddingTop: 20,
            paddingBottom: 30,
          }}
        >
          <Text
            style={{
              color: "#141B2D",
              fontSize: 26,
              alignSelf: "center",
              fontFamily: "Poppins-SemiBold",
            }}
          >
            Order Anything{" "}
          </Text>
          <Text
            style={{
              color: "#141B2D",
              fontSize: 26,
              alignSelf: "center",
              fontFamily: "Poppins-SemiBold",
            }}
          >
            Anytime & Anywhere{" "}
          </Text>

          <View style={[styles.countryCodeContainer, {
            // backgroundColor:"red",
            borderBottomWidth: 1,
            borderColor: Err === "Enter valid  10 Number" ? "red" : "#ccc",
          }]}>

            {signInWithEmail ? (
              <View>

                <TextInput
                  label="Email"
                  keyboardType="email-address"
                  autoCapitalize="none" // Add this line
                  value={email}
                  onChangeText={(text) => handleEmailChange(text)}
                  style={[styles.textInput,
                  {
                    borderWidth: Err === "Please Enter Valid email" ? 1 : null,
                    borderColor: Err === "Please Enter Valid email" ? "red" : null,
                  },
                  ]}
                  theme={{
                    colors: { primary: Err === "Please Enter Valid email" ? "red" : "#002244", underlineColor: "transparent" },
                  }}
                />


                {
                  Err === "Please Enter Valid email" ? (
                    <Text
                      style={{
                        color: "red",
                        fontSize: RFPercentage(1.4),
                        fontFamily: "Poppins-MediumItalic",
                        alignSelf: "flex-end",
                        marginTop: 3,
                      }}
                    >
                      {Err}
                    </Text>
                  ) : null
                }
              </View>




            ) : (

              <PhoneInput
                ref={phoneInput}
                value={phoneNumber}
                onChangeCountry={handelecountrychange}
                defaultValue={phoneNumber} // Display the full phone number
                defaultCode="US" // Default country code
                onChangeText={(text) => handlePhoneNumberChange(text)}
                onFocus={handlePhoneNumberFocus}
                onBlur={handlePhoneNumberBlur}
                containerStyle={{
                  height: verticalScale(80),
                  width: horizontalScale(300),
                }}
                textContainerStyle={styles.phoneInputTextContainer}
              />
            )}


          </View>
          {
            Err === "Enter valid  10 Number" ? (
              <Text
                style={{
                  color: "red",
                  fontSize: RFPercentage(1.4),
                  fontFamily: "Poppins-MediumItalic",
                  alignSelf: "flex-end",
                  marginTop: 3,
                }}
              >
                {Err}
              </Text>
            ) : null
          }

          <View style={{ marginTop: 20 }}>
            {/* <TextInput secureTextEntry={passwordVisible} placeholder="Enter Password" placeholderTextColor={"#6D7E8B"} style={{ borderBottomWidth: 1, borderBottomColor: "#D2D9DE", paddingLeft: 14, fontSize: 16, color: "#6D7E8B", fontFamily: "Poppins-Regular" }} /> */}
            <TextInput
              label="Password"
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={!passwordVisible} // Use secureTextEntry to hide/show password
              style={[styles.textInput, {
                borderWidth: Err === "Please Enter your Password" ? 1 : null,
                borderColor: Err === "Please Enter your Password" ? "red" : null,
              },]} 
              theme={{
                colors: { primary: Err === "Please Enter your Password" ? "red" : "#002244", underlineColor: "transparent" },
              }}
              placeholder="Enter Password"
            />
            {Err === "Please Enter your Password" ?
              (

                <Text
                  style={{
                    color: "red",
                    fontSize: RFPercentage(1.4),
                    fontFamily: "Poppins-MediumItalic",
                    alignSelf: "flex-end",
                    marginTop: 3,
                  }}
                >
                  {Err}
                </Text>) : null
            }
            <TouchableOpacity
              style={{ position: "absolute", right: 20, top: 10 }}
              onPress={() => setPasswordVisible(!passwordVisible)}
            >
              <Entypo
                name={passwordVisible ? "eye" : "eye-with-line"}
                size={24}
                color="#002244"
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={{ alignSelf: "flex-end", marginVertical: 4 }}
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Poppins-Medium",
                color: "black",
              }}
            >
              Forgot Password?
            </Text>
          </TouchableOpacity>

          {/* <View
            style={{
              alignItems: "center",
              paddingHorizontal: 15,
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "red" }}>{responseMeg}</Text>
          </View> */}

          {Loading ? (
            <View style={{ marginTop: 20, alignSelf: "center" }}>
              <Wave size={40} color="#33FFC2" animating={Loading} />
            </View>
          ) : (
            <TouchableOpacity
              style={{
                backgroundColor: "#33FFC2",
                alignItems: "center",
                paddingVertical: 12,
                marginTop: 30,
                borderRadius: 8,
              }}
              onPress={() => {
                handleSignIn();
              }}
            >
              <Text
                style={{
                  color: "black",
                  fontSize: 18,
                  fontFamily: "Poppins-SemiBold",
                }}
              >
                Sign In
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={{ alignSelf: "center", marginTop: 25 }}
            onPress={toggleSignInMethod}
          >
            <Text
              style={{
                color: "black",
                fontSize: 14,
                fontFamily: "Poppins-SemiBold",
              }}
            >
              {signInWithEmail
                ? "Sign In By Using Phone Number"
                : "Sign In By Using Email"}
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              color: "#6D7E8B",
              fontFamily: "Poppins-SemiBold",
              fontSize: 16,
              alignSelf: "center",
              marginVertical: 10,
            }}
          >
            OR
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              alignSelf: "center",
              // marginVertical:5,
            }}
          >
            <TouchableOpacity
              onPress={() => facebookLogin()}
              style={{
                paddingVertical: 8,
                borderWidth: 1,
                borderColor: "#F0F1F3",
                alignItems: "center",
                paddingHorizontal: 8,
                borderRadius: 12,
                marginRight: 5,
              }}
            >
              <Ionicons
                name="logo-facebook"
                size={35}
                color={"#4267B2"}
                style={{}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handaleGoogle()}
              style={{
                paddingVertical: 8,
                borderColor: "#F0F1F3",
                alignItems: "center",
                borderWidth: 1,
                paddingHorizontal: 8,
                borderRadius: 12,
                marginLeft: 5,
              }}
            >
              <Image
                source={require("../assets/images/google.png")}
                style={{ width: 35, height: 35 }}
              />
            </TouchableOpacity>
          </View>

          {/*            
            <View>
        <LoginButton
          onLoginFinished={
            (error, result) => {
              if (error) {
                console.log("login has error: " + result.error);
              } else if (result.isCancelled) {
                console.log("login is cancelled.");
              } else {
                AccessToken.getCurrentAccessToken().then(
                  (data) => {
                    console.log(data.accessToken.toString())
                  }
                )
              }
            }
          }
          onLogoutFinished={() => console.log("logout.")}/>
      </View> */}

          <TouchableOpacity
            style={{ alignSelf: "center", marginTop: 18 }}
            onPress={() => navigation.navigate("Signup")}
          >
            <Text style={{ fontWeight: "bold", color: "black" }}>
              Sign Up New User ?
            </Text>
          </TouchableOpacity>
        </View>
        {/* </ScrollView> */}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: "column-reverse",
    backgroundColor: "#f5f5f5",
    // borderTopLeftRadius:12
  },
  welcomeContainer: {
    height: verticalScale(650),
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  headingText: {
    fontSize: moderateScale(25),
    // fontWeight: 700
  },
  textInput: {
    backgroundColor: "transparent",
    // width: horizontalScale(330),
    width: wp(93)
    // Set the background color to transparent
  },
  headingContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
  },
  signInBtnMain: {
    paddingVertical: 20,
    alignItems: "center",
  },
  signInBtnContainer: {
    height: verticalScale(50),
    width: horizontalScale(330),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  signInBtnText: {
    fontSize: moderateScale(22),
    fontWeight: "bold",
  },
  TextInputContainer: {
    padding: 5,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  countryCodeContainer: {
    marginRight: 2,
    borderBottomWidth: 1, // Add a border to visually separate the countryCode
    borderColor: "#ccc",
  },
  picker: {
    width: horizontalScale(20), // Adjust the width as needed
    color: "black",
    paddingHorizontal: 60,
  },
  PhoneInputFieldContainer: {
    width: horizontalScale(50),
  },

  phoneInputContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
  },
  phoneInputTextContainer: {
    backgroundColor: "transparent", // Set the background color to transparent
  },

  socialButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "black",
    marginHorizontal: 20,
    borderRadius: 10,
    marginVertical: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  container: {
    // position: "relative",

    flex: 1, backgroundColor: "white"

  },
  imageBanner: {
    width: "100%",
    height: wp(80),
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  logoImage: {
    width: 50,
    height: 50,
    margin: 16,
  },

  text: {
    fontSize: 15,
    color: "black",
    marginLeft: 120,
    marginBottom: 40,
  },
  boldText: {

  },
});
export default WelcomeScreen;
