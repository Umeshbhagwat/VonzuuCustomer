import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView, FlatList } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import GlobleStyle from '../utils/GlobleStyle';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Api from '../services/Api';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { rfs } from '../utils/Responivefontsize';
import Toast from "react-native-toast-message"
const Coupon = ({ route }) => {
  const [coupon, setCoupon] = useState([])
  console.log( coupon,">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
 
  const { orderDetailID, CurrentVender, subTotalcurrentuser } = route.params;
   console.log(subTotalcurrentuser,CurrentVender,"------>>>>l")
  const cutomerId = useSelector((state) => state.CustomerIdSlice.customerId);
  console.log("OMG ", cutomerId);
  console.log("This is an selected VenderID", CurrentVender);
  console.log("SubTotal", subTotalcurrentuser);
  const navigation = useNavigation();
  useEffect(() => {
  
    fechCouponCodeList();
  }, []);
 
  const fechCouponCodeList = async () => {  // <-- Added 'endpoint' parameter
    try {
      const endpoint = `/api/v1/Basket/CouponCodeList?CustomerId=${cutomerId}&VendorID=${CurrentVender}`;
      // /api/v1/Basket/CouponCodeList?CustomerId=4732152&VendorID=5269
      const response = await Api.fetchEndpointData(endpoint);
      console.log("&&&&&&",response.data);
      setCoupon(response.data);
    } catch (error) {
      console.log("error for getting fechCouponCodeList", error);
    }
  };
 
  const applyCoupons = async (data) => {
    console.log(data,"]]]]]]]]]]]]]")
    try {
      console.log("Coupan code",data);
      console.log("subTotalcurrentuser",subTotalcurrentuser);
      console.log("custID",cutomerId);
      console.log("venderid",CurrentVender);
      const sedData={
        "couponCode": `${data}`,
        "subTotal": `${subTotalcurrentuser}`,
        "customerId": `${cutomerId}`,
        "vendorId":`${CurrentVender}`
      }
      const endPoint = `/api/v1/Basket/ApplyCouponCode`;
      const response = await Api.postEndpointData(endPoint,sedData);
      console.log(response,"asdsadsadsadsadsadsadsadsadsadsadsadsadsadasdsa");
      if(response.data.statusCode === 200){
        navigation.navigate("MyCart",{data});
        console.log("Coupon is apply");
        Toast.show({
          text1:"copun is applied",
          type:"info",
          visibilityTime:3000
        })
      }
      else{
 
       
          Toast.show({
            visibilityTime: 2000,
            text1: "Vonzuu",
            text2: "Coupon Code is not Valid",
            type: "success",
          });
       
 
      }
 
    } catch (error) {
      Toast.show({
        text1:"coupn is inavlid ",
        type:"error",
        visibilityTime:2000
      })
      console.log("Error in the applyCoupons", error);
    }
  };
 
  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={styles.backButton}>
            <AntDesign name="left" size={25} color={"black"} />
          </View>
        </TouchableOpacity>
 
        <View style={styles.applyCouponText}>
          <Text style={[GlobleStyle.CustomFont, { fontSize: 18, color: "black" }]}>Apply coupon </Text>
        </View>
      </View>
 
      <View style={styles.couponInputContainer}>
        <TextInput placeholder='Enter coupon code' style={styles.couponInput} placeholderTextColor={'gray'}/>
        <Text style={{ position: 'absolute', top: 15, right: 70, fontSize: 25, color: "#ACB8C1", fontWeight: "bold" }}> | </Text>
        <TouchableOpacity style={styles.couponApplyButton}>
          <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 20 }}>Apply</Text>
        </TouchableOpacity>
      </View>
 
 
 
 
      {/* {
        coupon.map((data,index)=>
       <ScrollView  key={index}>
 
        <View style={{padding:20,flexDirection:"row",justifyContent:"space-evenly"}}>
              
          <Text style={[GlobleStyle.CustomFontText,{color:"#8D9DA8"}]}>{data.category}</Text>
            <Text style={styles.couponText}>{data.code}</Text>
          <Text style={[GlobleStyle.CustomFont,{fontSize:16,color:"black"}]}>{data.name}</Text>
          <Text style={[GlobleStyle.CustomFontText,{color:"black",fontSize:14,}]}>{data.description}</Text>
        
          <TouchableOpacity  onPress={() => applyCoupons(data)}>
              <Text style={[GlobleStyle.CustomFont,styles.applyButton]}>Apply</Text>   
          </TouchableOpacity>
        
        
          </View>
          <View style={{ borderWidth: 1, borderBlockColor: "#E3E7EF",marginHorizontal:20}}></View>
 
        </ScrollView>
      )} */}
      {
        coupon ? (<View>
 
          <Text style={styles.availableCouponsText}>Available coupons</Text>
 
          <FlatList data={coupon} renderItem={({ item }) => {
            console.log(item,"============/")
            return (
              <View style={{ backgroundColor: "white", paddingVertical: 20, marginHorizontal: 20, paddingHorizontal: 4, borderBottomWidth: 1, borderColor: "#F2F5F80" }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
 
                  <View style={{ backgroundColor: "#00B57E40", paddingHorizontal: 18, paddingVertical: 6, borderStyle: "dashed", borderWidth: 1.5, borderRadius: 5, borderColor: "#00B57E" }}>
 
                    <Text style={{ fontSize: RFPercentage(2), color: "black", fontFamily: "Poppins-SemiBold" }}>{item.code}</Text>
                  </View>
 
                  <TouchableOpacity onPress={() => applyCoupons(item.code)}>
                    <Text style={{ color: "#9B56FF", fontFamily: "Poppins-SemiBold", fontSize: RFPercentage(2) }}>Apply</Text>
                  </TouchableOpacity>
                </View>
 
                <Text style={{ fontSize: RFPercentage(2.4), color: "black", fontFamily: "Poppins-SemiBold", marginTop: 20 }}>{item.name}</Text>
              </View>
            )
          }
          } />
        </View>
 
 
        ) : (
 
          <View><Text style={{ color: "red", fontSize: 20, alignSelf: 'center' }}>Coupon Not Available</Text></View>
 
        )
 
      }
    </ScrollView>
  );
}
 
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    // marginVertical:40
  },
  headerRow: {
    flexDirection: 'row',
  },
  backButton: {
    padding: 10,
    backgroundColor: '#F2F5F8',
    width: 50,
    borderRadius: 15,
    left: 8,
  },
  applyCouponText: {
    justifyContent: "center",
    left: 20,
  },
  couponInputContainer: {
    backgroundColor: "#E7ECEF",
    padding: 5,
    margin: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#F2F5F8",
  },
  couponInput: {
    fontSize: 15,
    color:"black"
  },
  couponApplyButton: {
    position: 'absolute',
    top: 15,
    right: 10,
  },
  availableCouponsText: {
    margin: 10,
    marginLeft: 20,
    color: "#8D9DA8",
    fontSize: 17,
  },
  couponItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 5,
  },
  couponItem: {
    margin: 10,
    padding: 8,
    borderWidth: 2,
    borderColor: "#00B57E",
    width: 200,
    borderRadius: 10,
    borderStyle: 'dashed',
    backgroundColor: '#9FE2BF',
    justifyContent: "center"
  },
  couponText: {
    marginHorizontal: 5,
    color: "black",
    fontSize: 17,
    margin: 10,
    padding: 8,
    borderWidth: 2,
    borderColor: "#00B57E",
    width: 200,
    borderRadius: 10,
    borderStyle: 'dashed',
    backgroundColor: '#9FE2BF',
    justifyContent: "center"
  },
  applyButton: {
    marginHorizontal: 10,
    color: "#9B56FF",
    fontSize: 20,
  },
});
 
export default Coupon;
 