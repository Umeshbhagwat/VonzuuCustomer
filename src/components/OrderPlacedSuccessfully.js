import React, { useEffect } from 'react';
import { View, Text, StyleSheet,TouchableOpacity, ScrollView} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import GlobleStyle from '../utils/GlobleStyle';
import { useNavigation } from '@react-navigation/native';
import { responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";
import { setCartData,clearCartData } from '../reduxtoolkit/CartSlice';
import { useSelector, useDispatch } from 'react-redux';
import { RFPercentage } from 'react-native-responsive-fontsize';
const OrderPlacedSuccessfully = (props) => {
 
  const navigation=useNavigation();
  const dispatch=useDispatch();
  
  useEffect(()=>{
    dispatch(clearCartData());
  },[dispatch])
  const next = ()=>{
props.navigation.navigate("TabStackNavigator")
  }
  return (
      
      <View style={{backgroundColor:"white",alignItems:'center',flex:1}}>
 
         <View style={styles.successeLogo}>
          <MaterialCommunityIcons name="check-bold" size={80} color={"black"} />
         </View>
   
 
        <Text style={[GlobleStyle.CustomFont,{fontSize:RFPercentage(3),marginTop:20,color:"black"}]}>Order Placed SuccessFully!</Text>
       
        <Text style={[GlobleStyle.CustomFontText,{justifyContent:"center",alignItems:"center",textAlign:"center",fontSize:RFPercentage(2),width:"90%",marginTop:4,color:"#6D7E8B"}]}>
          Your Order has been placed SuccessFully.
          we will you when it'll be accepted by restaurant.</Text>    
       
          {/* <TouchableOpacity style={{backgroundColor:"white",marginTop:40,width:"85%",borderWidth:0.5,paddingVertical:10,alignItems:'center',justifyContent:'center',borderRadius:12}}
          // onPress={()=>navigation.navigate('OrderDetail',)}
          >
             <Text style={[styles.BtnText, GlobleStyle.CustomHeadingColor, GlobleStyle.CustomFont]}>Go To Booking Details</Text>
           
          </TouchableOpacity> */}
        
          <TouchableOpacity style={{backgroundColor:"#33FFC2",width:"85%",paddingVertical:10,alignItems:'center',marginTop:15,justifyContent:'center',borderRadius:12}} onPress={next}>
          
              <Text style={[styles.BtnText, GlobleStyle.CustomHeadingColor, GlobleStyle.CustomFont]}>Back To Home</Text>
         
          </TouchableOpacity>
 
      </View>
        
   
  );
}
 
const styles=StyleSheet.create({
    mainContainer:{
        
        
       backgroundColor:"#FFFFF"
    },
    successeLogo:{
        height:200,
        width:200,
        backgroundColor:"#33FFC2",
        borderRadius:100,
        alignItems:"center",
        justifyContent:"center",
        marginTop:120
    },
    successeLogoMain:{
        justifyContent:"center",
        alignItems:"center"
    },
   
      BtnContainer: {
      
        
      },
      BtnText: {
        fontSize: RFPercentage(2),
      },
    
})
 
export default OrderPlacedSuccessfully;
 