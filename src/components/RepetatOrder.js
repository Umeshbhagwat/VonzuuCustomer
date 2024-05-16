import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, SafeAreaView } from 'react-native';
import GlobleStyle from '../utils/GlobleStyle';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';
import { useSelector, useDispatch } from "react-redux";
import Api from '../services/Api';
import { Wave } from 'react-native-animated-spinkit';
import Toast from "react-native-toast-message"
import { ScrollView } from 'react-native-gesture-handler';
import {MAP_API_KEY} from '@env';

const RepetatOrder = () => {
  const navigation = useNavigation();

  const route = useRoute();
  const { orderId } = route.params;
  const [orderDetails, setOrderDetails] = useState([]);
  const [Loading, setLoading] = useState(true);
  const [locationName, setLocationName] = useState(null);
  const [showMoreDetails,setShowMoreDetails]=useState(false)
  const cutomerId = useSelector((state) => state.CustomerIdSlice.customerId);
  const latLongData = useSelector((state) => state.LatlongSlices.userLatLong);
  
  const latitude = latLongData[0];
  const longitude = latLongData[1]; 
  
  const apiKey = MAP_API_KEY;

   console.log('this is an current latlong',latLongData);
   console.log('this is an latitude',latitude);   
   console.log('this is an latitude',longitude); 
  
   useEffect(() => {
    const getLocationName = async () => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
        );

        if (response.ok) {
          const data = await response.json();
          const results = data.results;
          if (results.length > 0) {
            const formattedAddress = results[0].formatted_address;
            setLocationName(formattedAddress);
          } else {
            setLocationName('Location not found');
          }
        } else {
          setLocationName('Error fetching location details');
        }
      } catch (error) {
        console.error('Error fetching location details:', error);
        setLocationName('Error fetching location details');
      }
    };

    getLocationName();
  }, [latitude, longitude]);

  console.log("This is an curtrent location name",locationName)

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {

        const endPoint = `/api/v1/Ordering/GetOrders?CustomerId=${cutomerId}&OrderID=${orderId}&pageSize=10&pageIndex=1`; // Add pageIndex=1 (or any value you need)
        const response = await Api.fetchEndpointData(endPoint);
        setLoading(false)
        setOrderDetails(response.data);
      } catch (error) {
        console.error('Error fetching order details:', error);
        setLoading(false)
        Toast.show({
          visibilityTime: 2000,
          text1: "Vonzuu",
          text2: "Error fetching order details",
          type: "error"
        })
      }
    };

    fetchOrderDetails();
    setLoading(true)
  }, [orderId]);

 const handleRepetOrder=async()=>{
  try {
    const endpoint=`/api/v1/Ordering/Re-Order`;
   const data={
    "orderId":`${orderId}`,
    "enteredAddress":`${locationName}`
   }
   const response=await Api.postEndpointData(endpoint,data);
   console.log("responce for reOrder",response.data.message);
   if(response.data.statusCode === 200)
   {
    Toast.show({
      visibilityTime: 2000,
      text1: "Re-Order is Done",
      text2: "Please Check the Cart",
      type: "success"
    })
    navigation.navigate("MyCart");
   }
   else{}
  } catch (error) {
    Toast.show({
      visibilityTime: 2000,
      text1: "Re-Order is Fail",
      text2: "Please try again",
      type: "error"
    })
    console.log("error in the re-Order",error)
  }

 }

 const handleShowMoreDetails=()=>{
  setShowMoreDetails(true);
}

  return (
  <SafeAreaView>
   <ScrollView>
    <View>
      {
        Loading ? (<View style={{ height: "100%", alignItems: "center", justifyContent: "center" }}>
          <Wave size={50} color='#33FFC2' animating={Loading} />
        </View>) : (
          <View>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => navigation.navigate('MyOrders')}>
                <View style={{ padding: 10, backgroundColor: '#F2F5F8', width: 50, borderRadius: 15, }}>
                  <MaterialIcons name="arrow-back" size={30} color={"black"} />
                </View>
              </TouchableOpacity>

              <View style={{ justifyContent: "center", left: 10 }}>
                <Text style={[GlobleStyle.CustomFont, { fontSize: 20, color: "black" }]}>Your Orders (#{orderId})</Text>
              </View>
            </View>

            <View>
              {orderDetails.map((item) => (
                <View key={item.orderId}>
                  <View style={{ flexDirection: "row", paddingLeft: 20 }}>
                    <View>
                      <Image source={{ uri: item.vendorImageURL }} style={{ height: responsiveHeight(5), width: responsiveWidth(10), borderRadius: 2 }} resizeMode='contain' />
                    </View>
                    <View style={{ padding: 10 }}>
                      <Text style={[GlobleStyle.CustomFont, { color: "black" }]}>{item.vendorName}</Text>

                      {item.orderItems.map((data) => (
                        <View  style={{  paddingVertical: 10, }}>
                          <View key={data.productId}style={{flexDirection: "row",}} >
                          <Image source={{ uri: data.productImgURL }} style={{ height: responsiveHeight(5), width: responsiveWidth(10), borderRadius: 2 }} resizeMode='contain' />

                          <View style={{ left: 5 }}>
                            <Text style={[GlobleStyle.CustomFontText, { color: "black" }]}>{data.productName}</Text>
                          </View>

                          <View>
                            <Text style={[GlobleStyle.CustomFontText, { color: "black" }]}>     {data.quantity} Quantity</Text>
                          </View>
                           
                          </View>  

                              <View>
                                <Text style={[GlobleStyle.CustomFontText, { color: "#6D7E8B",fontSize:12}]}>{data.attributeDescription}</Text>
                              </View>
    
                        </View>
                      ))}
                    </View>
                  </View>
                  <View style={{ borderStyle: 'dotted', borderWidth: 0.5, borderColor: 'gray', marginTop: 5, margin: 20 }}></View>

                  <View style={{ padding: 20 }}>
                    <View>
                      <Text style={[GlobleStyle.CustomFont, { fontSize: 20, color: "black" }]}>Bill Details</Text>
                    </View>

                    <View style={{ paddingVertical: 20 }}>
                      <View style={styles.BillDetailsContentConteiner}>
                        <Text style={[GlobleStyle.CustomFontText, { fontSize: 18, color: "#50616E" }]}>Subtotal</Text>
                        <Text style={[GlobleStyle.CustomFontText, { fontSize: 18, color: "#50616E" }]}>{item.orderSubtotalInclTax} {item.customerCurrencyCode}</Text>
                      </View>

                      <View style={styles.BillDetailsContentConteiner}>
                        <Text style={[GlobleStyle.CustomFontText, { fontSize: 18, color: "#50616E" }]}>Delivery Amount</Text>
                        <Text style={[GlobleStyle.CustomFontText, { fontSize: 18, color: "#50616E" }]}>{item.deliveryAmount} {item.customerCurrencyCode}</Text>
                      </View>

                      <View style={styles.BillDetailsContentConteiner}>
                        <Text style={[GlobleStyle.CustomFontText, { fontSize: 18, color: "#50616E" }]}>Order Discount</Text>
                        <Text style={[GlobleStyle.CustomFontText, { fontSize: 18, color: "#50616E" }]}>${item.orderDiscount} {item.customerCurrencyCode}</Text>
                      </View>

                        <View style={styles.BillDetailsContentConteiner}>
                        <Text style={[GlobleStyle.CustomFontText, { fontSize: 18, color: "#50616E" }]}>Tip</Text>
                        <Text style={[GlobleStyle.CustomFontText, { fontSize: 18, color: "#50616E" }]}>${item.tip} {item.customerCurrencyCode}</Text>
                      </View>   

                      <View style={styles.BillDetailsContentConteiner}>
                        <Text style={[GlobleStyle.CustomFontText, { fontSize: 18, color: "#50616E" }]}>Service Charge Amount</Text>
                        <Text style={[GlobleStyle.CustomFontText, { fontSize: 18, color: "#50616E" }]}>$ {item.serviceChargeAmount} {item.customerCurrencyCode}</Text>
                      </View>

                    </View>

                    <View style={{ borderWidth: 1, borderBlockColor: "#E3E7EF" }}></View>

                    <View style={styles.BillDetailsContentConteiner}>
                      <Text style={[GlobleStyle.CustomFontText, { fontSize: 18, color: "#50616E" }]}>Total Amount </Text>
                      <Text style={[GlobleStyle.CustomFont, { fontSize: 18, color: "black" }]}>{item.orderTotal.toFixed(2)} {item.customerCurrencyCode}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
        


            {/* <View style={{ margin: 20, flexDirection: "row", alignItems: "center" }}>
      <View style={{ justifyContent: "center", alignItems: "center", height: 20, width: 20, left: 10 }}>
       <Image source={require('../assets/images/mapLogo.png')} style={{ height: 40, width: 40, resizeMode: "contain" }} />
     </View>

        <View style={{ left: 40 }}>
          <Text style={[GlobleStyle.CustomFont, { fontSize: 20, color: "black" }]}>Home Address </Text>
          <Text style={[GlobleStyle.CustomFontText, { fontSize: 13, color: "#6D7E8B" }]}>8500 Pena Blvd,Denver,Co</Text>

        </View>
        <TouchableOpacity onPress={() => navigation.navigate('ManageAddress')}>
          <View style={{ flexDirection: "row", left: 100 }}>
            <Text style={[GlobleStyle.CustomFont, { fontSize: 15, color: "#9B56FF" }]}>Change</Text>
          </View>
        </TouchableOpacity>
        
      </View> */}

            {/* <View style={{justifyContent:"center",alignItems:"center"}}>
            <TouchableOpacity onPress={()=>navigation.navigate('TrackOrder')}>
                <View style={{height:responsiveHeight(8),width:responsiveWidth(90),margin:10,backgroundColor:'#33FFC2',borderRadius:10,alignItems:"center",justifyContent:"center"}}>
                   <Text style={[styles.BtnText, GlobleStyle.CustomHeadingColor, GlobleStyle.CustomFont]} > Track Order </Text>
                </View>
            </TouchableOpacity>
        </View> */}
          </View>)}

          <TouchableOpacity style={{padding:18,backgroundColor:'#33FFC2',marginHorizontal:15,borderRadius:10,marginVertical:60}} onPress={()=>handleRepetOrder()}>
            <Text style={[GlobleStyle.CustomFont,{textAlign:"center",color:"black",fontSize:16}]}>Repeat Order</Text>
          </TouchableOpacity>

    </View>
  </ScrollView> 
  </SafeAreaView> 
  );
}

export default RepetatOrder;

const styles = StyleSheet.create({
  BillDetailsContentConteiner: {
    justifyContent: 'space-between', flexDirection: "row", padding: 5
  },
  dottedBorder: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: '#E0D7FF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#9B56FF', // Border color
    borderStyle: 'dashed', // Dotted border style
  },
  BtnText: {
    fontSize: 20
  }
})