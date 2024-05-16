import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  PermissionsAndroid,
} from "react-native";
import { userData } from "./products";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import GlobleStyle from "../utils/GlobleStyle";
import { TextInput } from "react-native-paper";
import PhoneInput from "react-native-phone-number-input";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import Modal from "react-native-modal";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useSelector, useDispatch } from "react-redux";
// import RNFS from "react-native-fs";
import Api from "../services/Api";
import RNFetchBlob from "rn-fetch-blob";
import Toast from "react-native-toast-message";
import ImagePicker from "react-native-image-crop-picker";
import ImageCropPicker from "react-native-image-crop-picker";
import { RFPercentage } from "react-native-responsive-fontsize";
// import ImagePicker from 'react-native-image-picker';
 
const EditProfile = () => {
  const phoneInput = React.useRef(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberFocused, setPhoneNumberFocused] = useState(false);
  const [showSocialSignUp, setShowSocialSignUp] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [Fname, setFname] = useState(null);
  const [Lname, setLname] = useState(null);
  const [userInfo, setUserInfo] = useState([]);
  const [base64Image, setBase64Image] = useState("");
 
 
  const cutomerId = useSelector((state) => state.CustomerIdSlice.customerId);
 
  const navigation = useNavigation();
 
  const getUserDetails = async () => {
    try {
      const endPoint = `/api/v1/User/GetUserDetails?CustomerID=${cutomerId}&StoreId=1046&APIKey=BDD6B8BC-6C51-49C6-8E17-9E09B86E4DBB&UniqueSeoCode=1`;
      const response = await Api.fetchEndpointData(endPoint);
       console.log("}}}}}}}",response.data)
      setUserInfo(response.data);
    } catch (error) {
      console.log("This is an error ", error);
    }
  };
 
  useEffect(() => {
    getUserDetails();
  }, []);
 
  const handlePhoneNumberFocus = () => {
    // console.log("This is an blure")
    setShowSocialButtons(false);
  };
 
  const handlePhoneNumberBlur = () => {
    //  console.log("This is an blure")
    setShowSocialButtons(true);
  };
 
  const options = {
    mediaType: "photo",
    includeBase64: true,
  };

  const openCamera = async () => {
    try {
      const image = await ImagePicker.openCamera({
        width: 100,
        height: 100,
        cropping: true,
        includeBase64: true,
        mediaType: "photo",
      });
  
      setSelectedImage(image.path);
      setBase64Image(image);
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error opening camera:", error);
    }
  };
 

  const openGallery = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 100,
        height: 100,
        cropping: true,
        includeBase64: true,
        mediaType: "photo",
      });
  
      setSelectedImage(image.path);
      setBase64Image(image);
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error opening gallery:", error);
    }
  }

  const toggleModal = () => {
    setIsModalVisible(true);
  };
  const imagedata = base64Image.data;
 
  const handleSaveChanges = async () => {
    // const imageDataString = JSON.stringify
 
    try {
      const endPoint = `/api/v1/User/UpdateCustomer`; // Update this with your API endpoint
 
      const dataa = {
        storeId: 1046,
        apiKey: "BDD6B8BC-6C51-49C6-8E17-9E09B86E4DBB",
        uniqueSeoCode: "1",
        // id: `${cutomerId}`,
        id: `${cutomerId}`,
        firstName: "",
        lastName:"",
        email: "",
        mobileNo: "",
        pswd: "",
         profilePic: `${imagedata}`,
         //{
        //   uri: selectedImage.uri,
        //   type:selectedImage.type,
        //   filename:selectedImage.fileName
        // },
        // profilePic:"",
        profilePic:`${base64Image.data}`,
        imei1: "",
        imei2: "",
        deviceNo: "",
        latPos: "",
        longPos: "",
        deviceToken: "",
        deviceType: "",
        mineType: "image/jpeg",
      };
       console.log("++++++++",dataa)
      const response = await Api.postEndpointData(endPoint, dataa);
      console.log("API response:", response.data,"apirespoinse");
      navigation.goBack("")
 
    } catch (error) {
      console.error("Error converting image to b", error);
    }
  };
 
  return (
    <ScrollView style={styles.mainContainer}>
      <View>
        {userInfo.map((data) => (
          <View style={styles.profileConatiner} key={data.id}>
            <View>
              {/*            
         <Image
                source={{ uri :data.profilePic }} // Use selectedImage if available, otherwise use data.userImage
                style={styles.userProfileImage}
              /> */}
              <Image
                source={{ uri: selectedImage ||data.profilePic }} // Use selectedImage if available, otherwise use data.userImage
                style={styles.userProfileImage}
              />
              <TouchableOpacity onPress={() => toggleModal()}>
                <View style={{ left: 60, bottom: 25 }}>
                  <Image
                    source={require("../assets/images/camera.png")}
                    style={styles.cameraImage}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ bottom: 25, alignItems: "center" }}>
              <Text
                style={[
                  GlobleStyle.CustomFont,
                  { fontSize: 22, color: "black" },
                ]}
              >
                {" "}
                {data.firstName} {data.lastName}
              </Text>
              <Text style={{ color: "black", fontSize: RFPercentage(1.9) }}>
                {data.email}
              </Text>
            </View>
          </View>
        ))}
 
        <View style={{ backgroundColor: "#FFFFFF" }}>
          <View style={styles.TextInputContainer}>
            <View>
              <TextInput
                cursorColor="black"
                //  textColor='red'
 
                label="First Name"
                // placeholderTextColor={"red"}
 
                onChangeText={(text) => setFname(text)}
                style={styles.textInput}
                theme={{
                  colors: { primary: "#002244", underlineColor: "transparent" },
                }}
              />
            </View>
 
            <View style={{ paddingVertical: 30 }}>
              <TextInput
                label="Last Name"
                placeholderTextColor={"black"}
                onChangeText={(text) => setLname(text)}
                style={styles.textInput}
                theme={{
                  colors: { primary: "#002244", underlineColor: "transparent" },
                }}
              />
            </View>
          </View>
 
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              marginHorizontal: 5,
            }}
          >
            {/* <View style={styles.countryCodeContainer}>
 
       <PhoneInput
            ref={phoneInput}
            defaultValue={phoneNumber}
            defaultCode="US" // Default country code
            onChangeText={text => setPhoneNumber(text)}
            onFocus={handlePhoneNumberFocus}
            onBlur={handlePhoneNumberBlur}
            containerStyle={{height:responsiveHeight(10),width:responsiveWidth(90)}}
            textContainerStyle={styles.phoneInputTextContainer}
             textInputStyle={styles.textInput}
            // withDarkTheme
          />
 
             </View>  */}
          </View>
        </View>
 
        <View style={{ marginVertical: 60, alignItems: "center" }}>
          <TouchableOpacity
            style={styles.saveChageBtnContainer}
            onPress={() => handleSaveChanges()}
          >
            <Text style={[GlobleStyle.CustomFont, styles.headingText]}>
              Save Changes
            </Text>
          </TouchableOpacity>
        </View>
 
        {
          <Modal
            isVisible={isModalVisible}
            backdropTransitionOutTiming={0}
            onBackdropPress={() => setIsModalVisible(false)}
            onSwipeComplete={() => setIsModalVisible(false)}
            swipeDirection={["down"]}
            style={styles.bottomModal}
          >
            <View style={styles.modalContent}>
              <Text style={[GlobleStyle.CustomFont, styles.headingText]}>
                Profile photo
              </Text>
              <View style={{ flexDirection: "row", padding: 20 }}>
                <TouchableOpacity onPress={() => openCamera()}>
                  <View style={styles.profilePhotoCameraBtnConatiner}>
                    <Feather name="camera" size={20} color={"black"} />
                  </View>
                  <View style={{ top: 10 }}>
                    <Text
                      style={[GlobleStyle.CustomFontText, { color: "black" }]}
                    >
                      Camera
                    </Text>
                  </View>
                </TouchableOpacity>
 
                <TouchableOpacity onPress={() => openGallery()}>
                  <View style={styles.profileGellearyCameraBtnConatiner}>
                    <FontAwesome name="photo" size={20} color={"black"} />
                  </View>
                  <View style={{ left: 30, top: 10 }}>
                    <Text
                      style={[GlobleStyle.CustomFontText, { color: "black" }]}
                    >
                      Gallery
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
 
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Text
                  style={[GlobleStyle.CustomFont, { color: "black", top: 20 }]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </Modal>
        }
      </View>
    </ScrollView>
  );
};
 
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  userProfileImage: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  profileConatiner: {
    height: responsiveHeight(30),
    backgroundColor: "#F2F5F8",
    alignItems: "center",
    justifyContent: "center",
  },
  cameraImage: {
    height: 30,
    width: 30,
  },
  TextInputContainer: {
    padding: 5,
    paddingHorizontal: 20,
  },
  textInput: {
    backgroundColor: "transparent",
    color: "black", // Set the background color to transparent
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
  countryCodeContainer: {
    marginRight: 2,
    borderBottomWidth: 1, // Add a border to visually separate the countryCode
    borderColor: "#E7ECEF",
    backgroundColor: "#FFFFFF",
  },
  headingText: {
    fontSize: 18,
    color: "black",
  },
  saveChageBtnContainer: {
    height: responsiveHeight(7),
    width: responsiveWidth(90),
    backgroundColor: "#33FFC2",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
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
    height: 220, // Adjust the height as needed
  },
  modalText: {
    fontSize: 20,
    marginBottom: 20,
  },
  bottomSheet: {
    backgroundColor: "white",
    padding: 16,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cameraImagesBtn: {
    height: 50,
    width: 50,
  },
  profilePhotoCameraBtnConatiner: {
    height: 50,
    width: 50,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    elevation: 10,
  },
  profileGellearyCameraBtnConatiner: {
    left: 30,
    height: 50,
    width: 50,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    elevation: 10,
  },
});
export default EditProfile;