import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, PermissionsAndroid, Image, ScrollView, StyleSheet, Alert } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Geolocation from '@react-native-community/geolocation';
import GlobleStyle from '../../utils/GlobleStyle';
import { RFPercentage } from "react-native-responsive-fontsize";
import { MAP_API_KEY } from "@env";
import { wp } from '../../utils/SizeResponcive';
import { useSelector,useDispatch } from 'react-redux';
import LongText from '../../AllComponents/LongText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Api from '../../services/Api';
export default function ConfirmPickUp({route}) {
    const { currentLocation ,lastLocation,fare,veHicalIdRiderId,paymentMethod} = route.params;
    const cutomerId = useSelector((state) => state.CustomerIdSlice.customerId);
    console.log(">>********>",veHicalIdRiderId );
    console.log("???????????????",paymentMethod);
    const navigation = useNavigation();
    const [locationName, setLocationName] = useState('');
    const [destinationName, setDestinationName] = useState('');
    const[name,setName]=useState('');
    const[phoneNumber,setPhoneNumber]=useState('');

    useEffect(() => {
        // Function to get location name based on latitude and longitude
        const getLocationName = async () => {
            try {
                const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${currentLocation.latitude},${currentLocation.longitude}&key=${MAP_API_KEY}`);
                const data = await response.json();
                if (data.results && data.results.length > 0) {
                    setLocationName(data.results[0].formatted_address);
                }
            } catch (error) {
                console.error('Error fetching location name:', error);
            }
        };

        // Call the function when component mounts
        getLocationName();
    }, [currentLocation]);

    useEffect(() => {
        // Function to get location name based on latitude and longitude
        const getLocationName = async () => {
            try {
                const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lastLocation.latitude},${lastLocation.longitude}&key=${MAP_API_KEY}`);
                const data = await response.json();
                if (data.results && data.results.length > 0) {
                    setDestinationName(data.results[0].formatted_address);
                }
            } catch (error) {
                console.error('Error fetching location name:', error);
            }
        };

        // Call the function when component mounts
        getLocationName();
    }, [lastLocation]);
  

    useEffect(() => {
        const fetchData = async () => {
          try {
            const custFirstName = await AsyncStorage.getItem("custFirstName");
            let custMobileNo = await AsyncStorage.getItem("custMobileNo");
            
            // Extract the last 10 digits of custMobileNo
            if (custMobileNo.length > 10) {
              custMobileNo = custMobileNo.slice(-10);
            }
    
            console.log("custFirstName:", custFirstName);
           
            // console.log("custMobileNo:", custMobileNo);
    
            // Check if the component is still mounted before updating state
            if (isMounted.current) {
              setName(custFirstName);
              setPhoneNumber(custMobileNo);
            }
          } catch (error) {
            console.error('Error retrieving data:', error);
          }
        };
    
        fetchData();
      }, []);

    const handleContinue = async () => {
        try {
            const endpoint = '/api/v1/Agent/ConfirmRide';
            const data = {
                rideId: veHicalIdRiderId.riderId,
                vehicleId: veHicalIdRiderId.vehicalId,
                paymentMethodSystemName: `${paymentMethod}`,
                contactPerson: name,
                contactNumber: phoneNumber
            };
            console.log("$$$$$$$$$$$", data);
            const response = await Api.postEndpointData(endpoint, data);
            if (response.data.statusCode === 200) {
             
                 getCustomerOrderRide(); // Make sure to await here
            }
        } catch (error) {
            console.log("this is an error", error);
        }
    };
const logic = 45;
    
    const getCustomerOrderRide = async () => {
        try {
            console.log("Just testing....");
            const endPoint = `/api/v1/Ordering/CustomerOpenRide?CustomerID=${cutomerId}`; // Check spelling of cutomerId
            const response = await Api.fetchEndpointData(endPoint);
            console.log("This is an Order Details", response.data.data);
            const allData = response.data.data;
            allData.pickNdrop.forEach(element => {
                const OrderId = element.orderID;
                console.log("++++++++", OrderId);
                if(OrderId ===0){
                    Alert.alert('Waiting For the Rider Confirmation');
                }
                else{
                    Alert.alert("Done")
                  navigation.navigate('TrackOrder',{data:OrderId,logic})
                }
            });
        } catch (error) {
            console.log("This is an error", error);
        }
    };
    
    

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {/* <ScrollView style={{flex:1}}> */}
            <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <MapView
                    style={{ height: '50%' }}
                    initialRegion={{
                        latitude: currentLocation.latitude,
                        longitude: currentLocation.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    <Marker
                        coordinate={{
                            latitude: currentLocation.latitude,
                            longitude: currentLocation.longitude,
                        }}
                        title="Current Location"
                    />
                </MapView>
                <TouchableOpacity onPress={() => navigation.goBack("")} style={{ backgroundColor: '#F2F5F8', alignSelf: "flex-start", padding: 12, borderRadius: 15, marginLeft: 10, position: 'absolute', marginTop: 5 }}>
                    <MaterialIcons name="arrow-back" size={30} color={'black'} />
                </TouchableOpacity>

                <View style={{alignItems:"center",justifyContent:"center",alignSelf:"center",position:"absolute",marginTop:'25%'}}>
                   <Image  source={require('../../assets/images/Group.png')} style={{height:200,width:200}}/>          
                </View>
               <ScrollView style={{backgroundColor:"white"}}>
                <View style={{borderTopLeftRadius:10,borderTopRightRadius:10}}>
                     <Text style={[GlobleStyle.CustomFontText,{padding:20,color:"black"}]}>Confirm pickup location</Text>    
                     <Text style={[GlobleStyle.headerText,{paddingHorizontal:20,color:"black",fontSize:RFPercentage(1.9)}]}>{locationName}</Text>
                     <View style={{paddingVertical:20,flexDirection:"row",justifyContent:"space-between",}}>
                        <Text style={[GlobleStyle.headerText,{paddingHorizontal:13,color:"gray",width: wp(32),}]}>Destination</Text>
                        <LongText text={destinationName} maxLength={40}/>
                      
                     </View>
                         <View style={{borderWidth:1,borderColor:'#E7ECEF',margin:10}}></View>   

                     <View style={{paddingVertical:10,flexDirection:'row',justifyContent:'space-between'}}>
              
                          <Text style={[GlobleStyle.CustomFont,{paddingHorizontal:15,color:"gray",width:wp(68),}]}>Fare </Text>
                          <Text style={[GlobleStyle.CustomFont,{paddingHorizontal:15,color:"black",width:wp(68),}]}>${fare} </Text>
                     </View>
                     <TouchableOpacity
              onPress={() => handleContinue()}
              style={{
                backgroundColor: "#33FFC2",
                borderRadius: 8,
                alignItems: "center",
                padding: 15,
                marginHorizontal: 15,
                margin: 15
              }}
            >
              <Text style={[styles.signInBtnText, GlobleStyle.CustomHeadingColor]}>
              Continue
              </Text>
            </TouchableOpacity>
                </View>
             </ScrollView>
            </KeyboardAwareScrollView>
            {/* </ScrollView> */}
        </SafeAreaView>
    );
}

const styles=StyleSheet.create({
    signInBtnText: {
        fontSize:RFPercentage(2.3),
        fontWeight: "bold",
      }
})