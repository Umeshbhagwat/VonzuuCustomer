import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, RefreshControl } from 'react-native';
import { myOrder } from './products';
import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import GlobleStyle from '../utils/GlobleStyle';
import { responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import Api from '../services/Api';
import { Wave } from 'react-native-animated-spinkit';
import Toast from "react-native-toast-message"
import { RFPercentage } from 'react-native-responsive-fontsize';
import moment from 'moment';
import { black } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';

const MyOrders = () => {
  const [Loading, setLoading] = useState(true)
  const navigation = useNavigation();
  const [myOrders, setMyOrders] = useState([]);
  const [oredrIteams, setOrderIteams] = useState([]);
  const [time, settime] = useState();
  const [refreshing, setrefreshing] = useState(false)
  // const [allOrderTypes,setAllOrderTypes]=useState(["Restorannt","Groseries","PickDrop","Pate"])
  const [allOrderTypes,setAllOrderTypes]=useState([{id:0,name:"All"},{id:1,name:"Restaurants"},{id:3,name:"Courier"},{id:2,name:"Groceries"},{id:4,name:"Pate"},{id:5,name:"Pharmacy"},{id:6,name:"PickDrop"}])
  const cutomerId = useSelector((state) => state.CustomerIdSlice.customerId);
   
  // console.log("???????",myOrders)

  // useEffect(() => {
  //   fetchData();
  //   setLoading(true)
  // }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      intialFetchData();
    });
    return unsubscribe
  }, [])
  
  const handleRefresh=()=>{
    setrefreshing(true)
    fe
  }
  const handlePerticularOrder = (item) => {
    // console.log("handlePerticularOrder @@@@@", item.orderId)
    navigation.navigate('OrderDetail', { orderId: item.orderId })
  }

  const handleRepeatOrder=(item)=>{
    navigation.navigate('RepetatOrder', { orderId: item.orderId })
  }

  console.log("data avilable in my orders", myOrders);
  // console.log("all order iteams", oredrIteams);

  const intialFetchData=async()=>{
    try {
      // const endPoint = `/api/v1/Ordering/GetOrders?CustomerId=${cutomerId}&pageSize=10&pageIndex=1`
      const endPoint = `/api/v1/Ordering/GetOrders?CustomerId=${cutomerId}&OrderID=0&pageSize=10&pageIndex=1&Vendortype=0`
      const response = await Api.fetchEndpointData(endPoint);
      setMyOrders(response.data);
      setOrderIteams(response.data[0].orderItems);
      setLoading(false)
    } catch (error) {
      setLoading(false)
      Toast.show({
        text1: "Vonzuu",
        text2: "fetch data error for many kind",
        type: "error",
        visibilityTime: 3000
      })
      console.log("ereror in myOrders", error);

    }
  }

  const fetchData = async (item) => {
    try {
      // const endPoint = `/api/v1/Ordering/GetOrders?CustomerId=${cutomerId}&pageSize=10&pageIndex=1`
      const endPoint = `/api/v1/Ordering/GetOrders?CustomerId=${cutomerId}&OrderID=0&pageSize=10&pageIndex=1&Vendortype=${item}`
      const response = await Api.fetchEndpointData(endPoint);
      setMyOrders(response.data);
      setOrderIteams(response.data[0].orderItems);
      setLoading(false)
    } catch (error) {
      setLoading(false)
      Toast.show({
        text1: "Vonzuu",
        text2: "fetch data error for many kind",
        type: "error",
        visibilityTime: 3000
      })
      console.log("ereror in myOrders", error);

    }
  }

  const truncateText = (text, maxWords) => {
    const words = text.split(' ');
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(' ') + ' ...';
    }
    return text;
  }
  
  const ti = moment(time).format('YYYY-MM-DD HH:mm:ss');
  
const handlePickAndDropPayment = (OrderID) =>{
  const paremnter = 20
  navigation.navigate('Payment',{selectedAddressId:null,paremnter,OrderID})
  console.log(OrderID,"PPPP")
}

const handleSelectedCatogory=(item)=>{
   setSelectedCategory(item.id)
   fetchData(item.id)
}


  const renderItem = ({ item, index }) => {
console.log(item,"List dat")

    settime(item.createdOnUtc)
    const formattedDate = moment(item.createdOnUtc).format('YYYY-MM-DD HH:mm:ss');
    return (
      <View style={{ padding: 15, borderRadius: 10, borderWidth: 2, borderColor: "#E7ECEF", marginHorizontal: 20, marginBottom: 20 }}>
        <View style={{ flexDirection: "row", justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center',marginVertical:20}}>
           {item.paymentStatus === false?(
            <TouchableOpacity style={{bottom:60,position:"absolute",backgroundColor:"red",paddingHorizontal:5,borderRadius:5}}onPress={()=>handlePickAndDropPayment(item.orderId)}>
            <Text style={{color:"white",fontWeight:"bold",}}>Payment Pending</Text>
           </TouchableOpacity> 
           ):(<Text></Text>)}
            
            <Image source={{ uri: item.vendorImageURL }} style={{ height: 50, width: 50, borderRadius: 2 }} resizeMode='contain' />


            <Text style={{ fontSize: RFPercentage(2), color: '#2D2A2E', fontFamily: "Poppins-SemiBold", marginLeft: 20 }}>{item.vendorName}</Text>


          </View>

          <Text style={{ fontSize: RFPercentage(2.2), color: '#0D1D28', fontFamily: "Poppins-Bold" }}>${item.orderTotal}</Text>

        </View>

        <View style={{ borderStyle: 'dashed', borderWidth: 0.5, borderColor: 'gray', marginTop: 10 }}></View>

        <View style={{ marginVertical: 8, justifyContent: "space-between", flexDirection: 'row' }}>


          {item.orderStatusId === 22 ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>

              <Ionicons name="sync-circle-sharp" size={22} color={"#04A971"} />
              <Text style={{ color: "#04A971", fontFamily: "Poppins-Regular", fontSize: RFPercentage(1.6), marginLeft: 6 }}>{item.orderStatus}</Text>
            </View>
          ) : item.orderStatusId === 40 ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <AntDesign name="closecircle" size={19} color={"#FF604A"} />
              <Text style={{ color: "#FF604A", fontFamily: "Poppins-Regular", fontSize: RFPercentage(1.6), marginLeft: 6 }}>{item.orderStatus}</Text>

            </View>
          ) : item.orderStatusId === 4 ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="checkmark-circle-sharp" size={22} color={"#04A971"} />
              <Text style={{ color: "#04A971", fontFamily: "Poppins-Regular", fontSize: RFPercentage(1.6), marginLeft: 6 }}>{item.orderStatus}</Text>

            </View>
          ) : item.orderStatusId === 10 ? (
          <View>
            <Text style={{ color: "black", fontSize: RFPercentage(1.6), fontFamily: "Poppins-Regular" }}>{item.orderStatus}</Text>
          </View>) : item.orderStatusId === 3 ? (
          <View>
            <Text style={{ color: "black", fontSize: RFPercentage(1.6), fontFamily: "Poppins-Regular" }}>{item.orderStatus}</Text>
          </View>):
         item.orderStatusId === 22 ? (
          <View>
            <Text style={{ color: "black", fontSize: RFPercentage(1.6), fontFamily: "Poppins-Regular" }}>{item.orderStatus}</Text>
          </View>):item.orderStatusId === 25 ? (
          <View>
            <Text style={{ color: "black", fontSize: RFPercentage(1.6), fontFamily: "Poppins-Regular" }}>{item.orderStatus}</Text>
          </View>
          ):null 
        }
          <Text style={{ color: "black", fontSize: RFPercentage(1.6), fontFamily: "Poppins-Regular" }}>{formattedDate}</Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: 'center', marginTop: 5 }}>
          <ScrollView horizontal={true} style={{}} showsHorizontalScrollIndicator={false}>
            {item.orderItems.map((data, id) => (
              <View key={id} style={{ alignItems: 'center', justifyContent: 'center', }}>
                <Text style={[GlobleStyle.CustomFont, { color: "black", marginRight: 10 }]}>{data.productName}</Text>


                <Text style={[GlobleStyle.CustomFontText, { fontSize: RFPercentage(1.5), width: 150, textAlign: "center", fontFamily: "Poppins-Regular" }]}>
                  {truncateText(data.attributeDescription, 10)} 
                </Text>

              </View>
 
            ))}
          </ScrollView>

          <Text style={[GlobleStyle.CustomFontText, { fontSize: 14, color: 'red', marginLeft: 5 }]}>{item.productStatus}</Text>

        </View>

        <View>
          <Text style={[GlobleStyle.CustomFontText, { fontSize: 15, color: 'black' }]}>{item.productdate}</Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: 'space-around', }} >
          <TouchableOpacity style={{ alignItems: 'center', width: "45%", paddingVertical: 7, borderWidth: 1, borderColor: "#0D1D28", borderRadius: 11 }} onPress={() => handleRepeatOrder(item)}>
            <Text style={[GlobleStyle.CustomFont, { fontSize: RFPercentage(2), color: 'black', fontFamily: "Poppins-Medium", }]}>Repeat order</Text>

          </TouchableOpacity>

          <TouchableOpacity style={{ alignItems: 'center', width: "45%", paddingVertical: 7, borderWidth: 1, borderColor: "#0D1D28", borderRadius: 11 }} onPress={() =>handlePerticularOrder(item)}>
            <Text style={[GlobleStyle.CustomFont, { fontSize: RFPercentage(2), color: 'black', fontFamily: "Poppins-Medium", }]}>Order Detail</Text>

          </TouchableOpacity>
        </View>
      </View>
    )
  }
const [SelectedCategory, setSelectedCategory] = useState(0)
console.log(SelectedCategory) 
  const renderItemOrderTypes = ({ item ,index}) => {
    return (
      <TouchableOpacity onPress={()=>handleSelectedCatogory(item)} style={{marginLeft:22,backgroundColor:SelectedCategory === item.id? "#33FFC2":"#F2F5F8",paddingHorizontal:22,paddingVertical:5,borderRadius:12}}>
        <Text style={{ color:"black",fontSize:RFPercentage(1.5),fontFamily:"Poppins-Regular"}}>{item.name}</Text>
      </TouchableOpacity>
    );
  };
  
  return (
     
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
   
      
      <View style={{  paddingTop: 10,marginBottom:30,}}>
        <Text style={[GlobleStyle.CustomFont, styles.faverateheasding]}>My Orders</Text>

        <FlatList
       
        style={{flexGrow:0,marginTop:10}}
          showsHorizontalScrollIndicator={false}
          data={allOrderTypes}
          renderItem={renderItemOrderTypes}
          keyExtractor={(item, index) => index.toString()}
          horizontal={true} // Ensure it scrolls horizontally
        />

      </View>
      <View>
        {
          Loading ? (<View style={{ height: "100%", alignItems: 'center', justifyContent: 'center' }}><Wave size={50} color='#33FFC2' animating={Loading} /></View>) : (

            <View style={{ paddingBottom: 60,marginBottom:60,}}>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={myOrders.map(item => ({
                  ...item,
                  // Add this line
                }))}

                renderItem={renderItem}

                keyExtractor={(item) => item.id}
              // ItemSeparatorComponent={HorizontalLine}
              />
            </View>
          )}
      </View>

   
    </SafeAreaView>
  );

};
const styles = StyleSheet.create({
  faverateheasding: {
    fontSize: 22, color: 'black',marginLeft:20
  },
  porductImage: {
    height: 80,
    width: 100,
    borderRadius: 10
  },
  horizontalLine: {
    height: 1,
    backgroundColor: 'gray',
    marginHorizontal: 10,
    top: 5
  },


})

export default MyOrders;
