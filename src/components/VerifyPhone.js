import React, { useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import GlobleStyle from '../utils/GlobleStyle';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setCustomerId } from '../reduxtoolkit/CustomerIdSlice';
import { useSelector, useDispatch } from 'react-redux';
import Api from '../services/Api';

const VerifyPhone = () => {
  const [otp, setOtp] = useState(['', '', '', '',]);
  const [verficationMes,setverificationMes]=useState(false)

  const expectedOtp = '1234';
  const otpInputs = useRef([]);
  const dispatch=useDispatch();
  const navigation = useNavigation(); 
  
  const route = useRoute();
const { customerId } = route.params;
  
console.log("cutomerId>>>>",customerId);
  const handleVerify = async () => {
    const enteredOtp = otp.join('');
    
    console.log("This is an OTP ", enteredOtp);
  
    try {
      const endPoint = `/api/v1/User/CustomerVerification`;
      const data = {
        "storeId": 1046,
        "apiKey": "BDD6B8BC-6C51-49C6-8E17-9E09B86E4DBB",
        "uniqueSeoCode": "1",
        "customerId": `${customerId}`,
        "otp": `${enteredOtp}`,
        "isGuestId": true,
        "guestUserId": 0
      };
  
      const response = await Api.postEndpointData(endPoint, data);
  
      // Assuming the response contains information about successful verification,
      // you can check the response data and then navigate accordingly.
      if (response.data.resultData ==="Verification successful") {
        console.log('OTP verified successfully');
        // navigation.navigate('AuthStack');
        dispatch(setCustomerId(customerId));
        await AsyncStorage.setItem('customerId', customerId.toString());
        navigation.navigate('TabStackNavigator');

      } else {
        console.log('OTP verification failed', otp);
        setverificationMes(true);
        // Handle the case when OTP verification fails
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle the error as needed
    }
   
  };
  

  const handleKeyPress = (event, index) => {
    if (event.nativeEvent.key === 'Backspace' && index > 0) {
      otpInputs.current[index - 1].focus();
    }
  };
  
  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
  
    setOtp(newOtp);
  
    // If text is entered and the current input is not the last one, focus on the next input
    if (text !== '' && index < otpInputs.current.length - 1) {
      otpInputs.current[index + 1].focus();
    }
  };
  
  

  const handlePrviousScreen=()=>{
    console.log("This is backScreen")
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <View style={{ height: 45, width: 45, borderRadius: 50, backgroundColor: "#E7ECEF", justifyContent: "center", alignItems: "center", marginHorizontal: 10, marginVertical: 30 }}>
        <TouchableOpacity onPress={() => handlePrviousScreen()}>
          <MaterialIcons name="arrow-back-ios" size={25} color={"black"} />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Text style={[GlobleStyle.CustomFont, GlobleStyle.CustomHeadingColor, styles.headingText]}>Verify Phone</Text>
        {/* <Text style={GlobleStyle.CustomFont}>Enter the code sent +971 -273 473 84</Text> */}
        <View style={styles.otpInputContainer}>
          {Array.from({ length: 4 }).map((_, index) => (
            <TextInput
              key={index}
              style={styles.otpInput}
              value={otp[index]}
              onChangeText={(text) => handleOtpChange(text, index)}
              keyboardType="numeric"
              maxLength={1}
              ref={input => otpInputs.current[index] = input}
              onKeyPress={event => handleKeyPress(event, index)}
            />
          ))}
        </View>
        <View style={{ flexDirection: "row-reverse", marginHorizontal: 15, marginVertical:20}}>
          <Text style={[GlobleStyle.CustomFont, styles.resendCode]}>Resend Code</Text>
        </View>
        <View style={styles.verifyBtnMain}>
          <TouchableOpacity onPress={handleVerify}>
            <View style={[styles.verifyBtnContainer, GlobleStyle.PrimaryColor]}>
              <Text style={[styles.verifyInBtnText, GlobleStyle.CustomHeadingColor, GlobleStyle.CustomFont]}>Verify OTP</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      {
        verficationMes?(<View style={{justifyContent:"center",alignItems:"center"}}>
           <Text style={{color:'red'}}>Verification failed...</Text>
        </View>):(<View>

        </View>)
      }
    </View>
  );
};

export default VerifyPhone;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    marginHorizontal: 15,
  },
  headingText: {
    fontSize:22,
  },
  otpInputContainer: {
    flexDirection: 'row',
    marginTop: 20,
    color: 'black',
  },
  otpInput: {
    flex: 1,
    height: 40,
    borderBottomWidth: 1,
    borderColor: 'black',
    marginHorizontal: 5,
    marginVertical: 10,
    textAlign: 'center',
    fontSize: 18,
    color: "black",
  },
  resendCode: {
    borderColor: 'black',
    borderBottomWidth: 1,
    color: "black",
    fontSize: 20,
  },
  verifyBtnMain: {
    marginVertical:30,
    paddingVertical: 20,
    alignItems: "center",
  },
  verifyBtnContainer: {
    height: responsiveHeight(7), width: responsiveWidth(90),
    alignItems: "center",
    justifyContent: "center", borderRadius: 10,
  },
  verifyInBtnText: {
    fontSize: 20,
  },
});
