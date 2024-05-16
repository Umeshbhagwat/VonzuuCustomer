import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Touchable,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
} from "react-native";
// import {
//   GoogleSignin,
//   statusCodes,
//   GoogleSigninButton,
// } from "@react-native-google-signin/google-signin";
import { TextInput } from "react-native-paper";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import GlobleStyle from "../utils/GlobleStyle";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import PhoneInput from "react-native-phone-number-input";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { setCustomerId } from "../reduxtoolkit/CustomerIdSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
// import { LoginManager, AccessToken } from "react-native-fbsdk-next";
 
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "../utils/Responsive";
import Api from "../services/Api";
import { wp } from "../utils/SizeResponcive";
import { Wave } from "react-native-animated-spinkit";
import { RFPercentage } from "react-native-responsive-fontsize";
 
const Signup = () => {
  const [countryCode, setCountryCode] = useState("+1");
  const phoneInput = React.useRef(null);
  const [phoneNumber, setPhoneNumber] = useState();
  const [phoneNumberFocused, setPhoneNumberFocused] = useState(false);
  const [showSocialSignUp, setShowSocialSignUp] = useState(true);
  const [showSocialButtons, setShowSocialButtons] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lasttName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userInfo, setUserInfo] = useState("");
  const [responseMeg, setResponseMeg] = useState("");
  const navigation = useNavigation();
  const [userinfogoogle, SetUserInfo] = useState("");
  const [country, setcountry] = useState("+1");
 
  const handlCountrpicker = (code) => {
    setcountry(code.callingCode[0]);
  };
  const [Loading, setLoading] = useState(false);
  const dispatch = useDispatch();
 
  useEffect(() => {
    
    const unsubscribe = navigation.addListener('focus', () => {
  getImage()
     
    });
    return unsubscribe;
  // Orientation.lockToPortrait();
}, []);
 
 
 
const [ImageData, setImageData] = useState("https://vonzuuliveimage.s3.amazonaws.com/v2/app-assets/home-images/Rectangle+2800-2.png")
console.log(ImageData,"PPPPPPPPPPPPPPPPPPPPP")
const getImage = async () =>{
  const endpoint = "/api/v1/User/AppVersion_N_LoginImage?StoreId=1046"
  const response = await Api.fetchEndpointData(endpoint)
  if (response.data.statusCode === 404) {
    
    setImageData(response.data.data)
    // console.log("=========================================>?>>>>",response.data.data)
  } else {
    
  }
}
  console.log(country, "----------------------------------------------------");
 
  // const handaleGoogle = async () => {
  //   try {
  //     await GoogleSignin.hasPlayServices();
  //     const userInfo = await GoogleSignin.signIn();
  //     SetUserInfo(userInfo.user); // Update state with user information
  //     console.log("User Info:", userInfo.user); // Log user information to console
  //   } catch (error) {
  //     if (error.code === statusCodes.SIGN_IN_CANCELLED) {
  //       // user cancelled the login flow
  //     } else if (error.code === statusCodes.IN_PROGRESS) {
  //       // operation (e.g. sign in) is in progress already
  //     } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
  //       // play services not available or outdated
  //     } else {
  //       // some other error happened
  //     }
  //   }
  // };
 
  useEffect(() => {
    // GoogleSignin.configure({
    //   androidClientId:
    //     "641306258826-siqqj32junedpiv756visjckruhm74li.apps.googleusercontent.com",
    // });
    setUserInfo("");
    setResponseMeg("");
  }, []);
 
  // const facebookLogin = async () => {
  //   // Attempt login with permissions
  //   const result = await LoginManager.logInWithPermissions([
  //     "public_profile",
  //     "email",
  //   ]);
  //   console.log(
  //     result,
  //     "face dattatat________________________________________________________________"
  //   );
  //   if (result.isCancelled) {
  //     throw "User cancelled the login process";
  //   }
 
  //   // Once signed in, get the users AccesToken
  //   const data = await AccessToken.getCurrentAccessToken();
 
  //   if (!data) {
  //     throw "Something went wrong obtaining access token";
  //   }
 
  //   // Create a Firebase credential with the AccessToken
  //   const facebookCredential = auth.FacebookAuthProvider.credential(
  //     data.accessToken
  //   );
 
  //   // Sign-in the user with the credential
  //   return auth().signInWithCredential(facebookCredential);
  // };
 
  const signIn = async () => {
    // try {
    //   const hasPlayService = await GoogleSignin.hasPlayServices();
    //   if (hasPlayService) {
    //     const userInfo = await GoogleSignin.signIn();
    //     console.log(JSON.stringify(userInfo));
    //     setUserInfo(userInfo);
    //   }
    // } catch (error) {
    //   console.log("ERROR IS: " + JSON.stringify(error));
    // }
  };
 
  const handleFacbook = () => {
    console.log("This is an fandle fecBook", userInfo);
  };
 
  const handlePhoneNumberFocus = () => {
    console.log("This is an blure");
    setShowSocialButtons(false);
  };
 
  const handlePhoneNumberBlur = () => {
    console.log("This is an blure");
    setShowSocialButtons(true);
  };
 
  const handleSignIn = () => {
    console.log("This is an Phone Number", phoneNumber);
  };
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  const handleInputChange = (text) => {
    if (/^\d{0,10}$/.test(text)) {
      setPhoneNumber(text);
    }
  };
  const validatePassword = (password) => {
    const regex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{"':;?/>.<,])(?=.*[a-zA-Z]).{8,}$/;
    return regex.test(password);
  };
 
  const handleSignupData = async () => {
    setError("");
    setLoading(true);
    if (firstName.length >= 4) {
      if (lasttName.length >= 4) {
        if (!validateEmail(email)) {
          setError("Enter Valid Email");
          setLoading(false);
          // Toast.show({
          //   text1: "Please enter a valid email address.",
          //   type: "error",
          //   visibilityTime: 2000,
          // });
        } else {
          if (!validatePassword(password)) {
            setLoading(false);
            setError("Please Enter Valid Password");
            // Toast.show({
            //   text1:
            //     "Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters.",
            //   type: "error",
            //   visibilityTime: 2000,
            // });
          } else {
            try {
              const endpoint = "/api/v1/User/Signup";
              const data = {
                storeId: 1046,
                apiKey: "BDD6B8BC-6C51-49C6-8E17-9E09B86E4DBB",
                uniqueSeoCode: "1",
                id: 0,
                firstName: `${firstName}`,
                lastName: `${lasttName}`,
                email: `${email}`,
                mobileNo: `${country} ${phoneNumber}`,
                pswd: `${password}`,
                profilePic: `${userinfogoogle.photo}`,
                imei1: "",
                imei2: "",
                deviceNo: "",
                latPos: "",
                longPos: "",
                deviceToken: "string",
                deviceType: "",
                userProvider: "",
                userIdentifier: `${userinfogoogle.id}`,
                token: "",
              };
             
              const response = await Api.postEndpointData(endpoint, data);
              console.log("+++++++++",response.data);
 
             
              console.log("+++++", JSON.stringify(response));
              if (response.data.statusCode === 200) {
                console.log("Sign Up succsess..");
 
                const customerId = response.data.data.userID;
                
                console.log(")))))))", customerId);
                // dispatch(setCustomerId(customerId));
                await AsyncStorage.setItem("custEmail",response.data.data.email.toString());
                await AsyncStorage.setItem("custFirstName",response.data.data.firstName.toString());
                await AsyncStorage.setItem("custlastName", response.data.data.lastName.toString());
                await AsyncStorage.setItem("custMobileNo", response.data.data.mobileNo.toString());

                // await AsyncStorage.setItem('customerId', customerId.toString());
                Toast.show({
                  visibilityTime: 2000,
                  text1: "Vonzuu",
                  text2: "Signup Successgfully",
                  type: "success",
                });
                setLoading(false);
                navigation.navigate("VerifyPhone", { customerId: customerId });
              } else {
                Toast.show({
                  visibilityTime: 2000,
                  // text1: "Vonzuuaaa",
                  text1: response.message,
                  type: "error",
                });
                setLoading(false);
                // console.log(response.message);
                // Handle the case when OTP verification fails
              }
            } catch (error) {
              console.error("Error fetching data:", error);
              if (
                error.response &&
                error.response.data &&
                error.response.data.message
              ) {
                console.error("API Error:", error.response.data.message);
                setResponseMeg(error.response.data.message);
                setError(error.response.data.message);
                console.log(error.response.data.message, "123131");
                Toast.show({
                  visibilityTime: 2000,
                  // text1: "Vonzuuzz",
                  text2: error.response.data.message,
                  type: "error",
                });
                setLoading(false);
              }
            }
          }
        }
      } else {
        setLoading(false);
        setError("Please Enter Last Name");
      }
    } else {
      setLoading(false);
      setError("Please Enter Name");
    }
  };
  const [Error, setError] = useState("");
 
  const handleSignupDatas = async () => {
    setLoading(true);
  };
 
  return (
    <SafeAreaView>
    <ScrollView style={{}} automaticallyAdjustKeyboardInsets={false}>
      <Image
        source={{uri : ImageData}}
        style={styles.imageBanner}
        resizeMode="cover"
      />
      <View style={styles.overlayContainer}>
        <Image
          source={require("../assets/images/VonzuuLogo.png")}
          style={styles.logoImage}
        />
      </View>

      <View style={styles.overlayContainerBackIcon}>
            <TouchableOpacity style={{
                padding: 12,
                backgroundColor: '#F2F5F8',
                
                borderRadius: 15,
                alignItems: 'center',
                justifyContent: 'center',
            }} onPress={() => navigation.goBack()}>
             
                <MaterialIcons name="arrow-back" size={20} color="black" />
             
            </TouchableOpacity>
         </View>   
 
      <View style={styles.welcomeContainer}>
        <TextInput
          label="First  Name"
          onChangeText={(text) => setFirstName(text)}
          style={[
            styles.textInput,
            {
              borderWidth: Error === "Please Enter Name" ? 1 : null,
              borderColor: Error === "Please Enter Name" ? "red" : null,
            },
          ]}
          theme={{
            colors: {
              primary: Error === "Please Enter Name" ? "red" : "#002244",
              underlineColor: "transparent",
            },
          }}
          placeholder="Name"
        />
        {Error === "Please Enter Name" ? (
          <Text
            style={{
              color: "red",
              fontSize: RFPercentage(1.4),
              fontFamily: "Poppins-MediumItalic",
              alignSelf: "flex-end",
              marginTop: 3,
            }}
          >
            {Error}
          </Text>
        ) : null}
        <TextInput
          label="Last Name"
          onChangeText={(text) => setLastName(text)}
          style={[
            styles.textInput,
            {
              borderWidth: Error === "Please Enter Last Name" ? 1 : null,
              borderColor: Error === "Please Enter Last Name" ? "red" : null,
            },
          ]}
          theme={{
            colors: {
              primary: Error === "Please Enter Last Name" ? "red" : "#002244",
              underlineColor: "transparent",
            },
          }}
          placeholder="last name"
        />
        {Error === "Please Enter Last Name" ? (
          <Text
            style={{
              color: "red",
              fontSize: RFPercentage(1.4),
              fontFamily: "Poppins-MediumItalic",
              alignSelf: "flex-end",
              marginTop: 3,
            }}
          >
            {Error}
          </Text>
        ) : null}
        <TextInput
          label="Email"
          autoCapitalize="none"
          onChangeText={(text) => setEmail(text)}
          style={[
            styles.textInput,
            {
              borderWidth: Error === "Enter Valid Email" ? 1 : null,
              borderColor: Error === "Enter Valid Email" ? "red" : null,
            },
          ]}
          theme={{
            colors: {
              primary: Error === "Enter Valid Email" ? "red" : "#002244",
              underlineColor: "transparent",
            },
          }}
        />
        {Error === "Enter Valid Email" ? (
          <Text
            style={{
              color: "red",
              fontSize: RFPercentage(1.4),
              fontFamily: "Poppins-MediumItalic",
              alignSelf: "flex-end",
              marginTop: 3,
            }}
          >
            {Error}
          </Text>
        ) : null}
 
        {/* <View style={{ flexDirection: 'row', justifyContent: "space-evenly", marginHorizontal: 5 }}> */}
        <View style={styles.countryCodeContainer}>
          <PhoneInput
            ref={phoneInput}
            onChangeCountry={handlCountrpicker}
            defaultValue={phoneNumber} // Display the full phone number
            defaultCode="US" // Default country code
            onChangeText={handleInputChange}
            onFocus={handlePhoneNumberFocus}
            onBlur={handlePhoneNumberBlur}
            containerStyle={{
              height: verticalScale(80),
              width: horizontalScale(300),
            }}
            textContainerStyle={styles.phoneInputTextContainer}
          />
        </View>
 
        {/* </View> */}
        <TextInput
          label="Password"
          onChangeText={(text) => setPassword(text)}
          style={[
            styles.textInput,
            {
              borderWidth: Error === "Please Enter Valid Password" ? 1 : null,
              borderColor:
                Error === "Please Enter Valid Password" ? "red" : null,
            },
          ]}
          theme={{
            colors: {
              primary:
                Error === "Please Enter Valid Password" ? "red" : "#002244",
              underlineColor: "transparent",
            },
          }}
          placeholder="e.g.:Umesh@123"
          placeholderTextColor={"#BCBAB5"}
        />
        {Error === "Please Enter Valid Password" ? (
          <Text
            style={{
              color: "red",
              fontSize: RFPercentage(1.4),
              fontFamily: "Poppins-MediumItalic",
              alignSelf: "flex-end",
              marginTop: 3,
            }}
          >
            {Error}
          </Text>
        ) : null}
 
        {Loading ? (
          <View style={{ marginTop: 20, alignSelf: "center" }}>
            <Wave size={40} color="#33FFC2" animating={Loading} />
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => {
              handleSignupData();
            }}
            style={{
              paddingVertical: 14,
              backgroundColor: "#33FFC2",
              borderRadius: 8,
              alignItems: "center",
              marginTop: 20,
            }}
          >
            <Text
              style={[styles.signInBtnText, GlobleStyle.CustomHeadingColor]}
            >
              Sign Up
            </Text>
          </TouchableOpacity>
        )}
 
        <Text
          style={{
            color: "#0D1D28",
            fontSize: 14,
            alignSelf: "center",
            marginTop: 10,
          }}
        >
          OR
        </Text>
 
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            alignSelf: "center",
            marginVertical: 15,
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
      </View>
    </ScrollView>
   </SafeAreaView> 
  );
};
 
const styles = StyleSheet.create({
  welcomeContainer: {
    marginTop: -10,
    // height: responsiveHeight(75),
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingHorizontal: 20,
  },
  headingText: {
    fontSize: 24,
    fontWeight: 700,
  },
  textInput: {
    backgroundColor: "transparent", // Set the background color to transparent,
    marginTop: 15,
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
    height: responsiveHeight(7),
    width: responsiveWidth(90),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  signInBtnText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  TextInputContainer: {
    padding: 5,
    paddingHorizontal: 20,
  },
  countryCodeContainer: {
    marginRight: 5,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    paddingHorizontal: 10,
  },
  picker: {
    width: responsiveWidth(20), // Adjust the width as needed
    color: "black",
    paddingHorizontal: 60,
  },
  PhoneInputFieldContainer: {
    width: responsiveWidth(50),
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
    // position: 'relative',
    //    marginVertical:30
  },
  imageBanner: {
    width: "40%",
    height: "40%",
    aspectRatio: 2,
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  logoImage: {
    width: 50,
    height: 50,
    // margin: 16,
   
  },
 
  text: {
    fontSize: 15,
    color: "black",
    marginLeft: 120,
  },
  boldText: {
    fontWeight: "bold",
    color: "black",
  },
  signupBanner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 240,
    width: "100%",
  },
  imageBanner: {
    width: "100%",
    height: wp(80),
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  overlayContainerBackIcon: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding:20
  }
  ,
  
  logoImage: {
    width: 50,
    height: 50,
    margin: 16,
  },
});
export default Signup;
 