import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet,Image, TouchableOpacity} from 'react-native';
import { responsiveHeight, responsiveWidth,} from "react-native-responsive-dimensions";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import {userData} from './products';
import { useNavigation } from '@react-navigation/native';
import GlobleStyle from '../utils/GlobleStyle';
import Api from '../services/Api';
import * as logger from "../utils/logger";
import { useSelector,useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';
import { clearCustomerId } from '../reduxtoolkit/CustomerIdSlice';
import { Wave } from 'react-native-animated-spinkit';
import Toast from "react-native-toast-message"
import { RFPercentage } from 'react-native-responsive-fontsize';
 

const Account = () => {
  const [Loading, setLoading] = useState(true)
 
   const [userInfo,setUserInfo]=useState([])
   const cutomerId = useSelector((state) => state.CustomerIdSlice.customerId);
   console.log("++++",cutomerId)
  const navigation = useNavigation();
 
 
  const dispatch=useDispatch();
  
//   useEffect(()=>{
//     dispatch(clearCustomerId());
//   },[dispatch])
  
  const getUserDetails=async()=>{
      try {
         const endPoint=`/api/v1/User/GetUserDetails?CustomerID=${cutomerId}&StoreId=1046&APIKey=BDD6B8BC-6C51-49C6-8E17-9E09B86E4DBB&UniqueSeoCode=1`;
         const response=await Api.fetchEndpointData(endPoint);
       setLoading(false)
        setUserInfo(response.data);
      } catch (error) {
        setLoading(false)
        Toast.show({
          visibilityTime:2000,
          text1:"Vonzuu",
          text2:error.response.data.message,
          type:"error"
      })
         console.log("This is an error ",error);
      }
  }
 
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // This function will run when the screen comes into focus
      console.log('Screen focused');
      setLoading(true)
   getUserDetails();
      // You can perform any necessary actions here
    });
    return unsubscribe
// setLoading(true)
//    getUserDetails();
}, []);
 
console.log("this is an usre info",userInfo);
 
const handleLogout = async () => {
  try {
  
    await AsyncStorage.removeItem('customerId')
    await AsyncStorage.removeItem('custEmail') 
    console.log('AsyncStorage data cleared for key ')
    dispatch(clearCustomerId());

   //  navigation.navigate('Signup');
   navigation.navigate('WelcomeScreen')
  } catch (error) {
    console.error('Error clearing AsyncStorage data:', error);
  }
 
  
};
 
  return (<View>
 
    {
      Loading ? (<View style={{ height: "100%", alignItems: 'center', justifyContent: 'center' }}><Wave size={50} color='#33FFC2' animating={Loading} /></View>):(
       
        <ScrollView>
    <View style={styles.mainContainer}>
      {userInfo.map((data)=>(
         <View style={styles.profileConatiner} key={data.id}>
         <View>
             <View>
                    <Image  source={{ uri: data.profilePic }} style={styles.userProfileImage} />
             </View>
 
         </View>
         <View style={{alignItems:"center",justifyContent:"center"}}>
          <Text style={[GlobleStyle.CustomFont, { fontSize: 22, color: 'black' }]}> {data.firstName} {data.lastName}</Text>
                 
          <Text style={[GlobleStyle.CustomFontText,{color:"black",fontSize:RFPercentage(2)}]}>{data.email}</Text>
         </View>
         <TouchableOpacity onPress={() =>navigation.navigate('EditProfile')} style={{top:10}}>
  
          <Text style={[GlobleStyle.CustomFontText, { fontSize: 15, color: '#9B56FF' }]}>Edit Profile </Text>
       
         </TouchableOpacity>
       </View>
      ))}
      
     
      <TouchableOpacity>
     <View style={styles.allContentMain}>
      
      
      <TouchableOpacity style={styles.headingAndLogoContainer}>
       <View>
              <Image source={require('../assets/images/Payments.png')} style={styles.logoImage} />
           </View>  
       
        <View style={styles.headingContainer}>
          <Text style={[GlobleStyle.CustomFontText, { fontSize: 15, color: 'black' }]}>Payment</Text>
        </View>
      </TouchableOpacity>
   
 
        <View style={styles.forwordArrow}>
           <Text style={[GlobleStyle.CustomFontText, { fontSize: 25, color: 'black' }]}>{'>'}</Text>
        </View>
 
     </View>
   </TouchableOpacity>
 
 
   <TouchableOpacity>
     <View style={styles.allContentMain}>
    
      <View style={styles.headingAndLogoContainer}>
         <View>
              <Image source={require('../assets/images/Vonzuuwallet.png')}style={styles.logoImage} />
           </View>  
       
        <View style={styles.headingContainer}>
          <Text style={[GlobleStyle.CustomFontText, { fontSize: 15, color: 'black' }]}>Vonzuu Wallet</Text>
        </View>
       </View>
 
       <View style={styles.forwordArrow}>
           <Text style={[GlobleStyle.CustomFontText, { fontSize: 25, color: 'black' }]}>{'>'}</Text>
        </View>
    
     </View>
 
  </TouchableOpacity>
 
     <View style={styles.allContentMain}>
        
        <View style={styles.headingAndLogoContainer}>
          <View >
              <Image source={require('../assets/images/Adress.png')}style={styles.logoImage} />
           </View>  
       
        <TouchableOpacity style={styles.headingContainer} onPress={()=>navigation.navigate('AddNewAdress')}>
          <Text style={[GlobleStyle.CustomFontText, { fontSize: 15, color: 'black' }]}>Manage address</Text>
        </TouchableOpacity>
       </View>
 
       <View style={styles.forwordArrow}>
           <Text style={[GlobleStyle.CustomFontText, { fontSize: 25, color: 'black' }]}>{'>'}</Text>
        </View>
 
     </View>
 
     <View style={styles.allContentMain}>
       <View style={styles.headingAndLogoContainer}>
          <View>
              <Image source={require('../assets/images/support.png')} style={styles.logoImage} />
           </View>  
       
        <TouchableOpacity style={styles.headingContainer} onPress={()=>navigation.navigate('HelpAndSupport')}>
          <Text style={[GlobleStyle.CustomFontText, { fontSize: 15, color: 'black' }]}>Help & Support</Text>
        </TouchableOpacity>
       </View>
       <View style={styles.forwordArrow}>
           <Text style={[GlobleStyle.CustomFontText, { fontSize: 25, color: 'black' }]}>{'>'}</Text>
        </View>
 
     </View>
 
     <TouchableOpacity style={styles.allContentMain} onPress={()=>handleLogout()}>
        <View style={styles.headingAndLogoContainer}>
         <View >
              <Image source={require('../assets/images/Logout.png')} style={styles.logoImage} />
           </View>  
        <View style={styles.headingContainer}>
          <Text style={[GlobleStyle.CustomFontText, { fontSize: 15, color: 'black' }]}>Logout</Text>
        </View>
       
       </View>
       <View style={styles.forwordArrow}>
           <Text style={[GlobleStyle.CustomFontText, { fontSize: 25, color: 'black' }]}>{'>'}</Text>
        </View>
 
     </TouchableOpacity>
 
 
{/*  
     <TouchableOpacity style={styles.allContentMain} onPress={navigation.navigate()}>
       <View style={styles.headingAndLogoContainer}>
          <View>
             
              <MaterialIcons name='delete-outline' size={40}  color=''/>
           </View>  
       
        <View style={styles.headingContainer}>
          <Text style={[GlobleStyle.CustomFontText, { fontSize: 15, color: 'black' }]}>Delete Account</Text>
        </View>
        </View>
 
        <View style={styles.forwordArrow}>
           <Text style={[GlobleStyle.CustomFontText, { fontSize: 25, color: 'black' }]}>{'>'}</Text>
        </View>
 
     </TouchableOpacity> */}
    
    </View>
   </ScrollView>
      )
    }
   
  </View>
 
  );
}
 
const styles=StyleSheet.create({
    mainContainer:{
       flex:1,
      //  backgroundColor:"white"
       },
       profileConatiner:{
         height:responsiveHeight(35),
         // backgroundColor:"#F2F5F8",
         alignItems:"center",
         justifyContent:"center"
       } ,
       logoImage:{
         height:30,width:35,tintColor:"#AAA&AD"
       } ,
       allContentMain:{
        flexDirection:"row",
        paddingHorizontal:5,
        paddingVertical:10,
        justifyContent:"space-between"
       },
       forwordArrow:{
         right:10
       },
       headingContainer:{
        left:30,
         justifyContent:"center"
       },
       headingAndLogoContainer:{
        justifyContent:"flex-start",flexDirection:"row",
        left:10
       },
       
       userProfileImage:{
        height:100,width:100,
        borderRadius:50
       }
  }
)
export default Account;
 