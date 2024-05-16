import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { wp } from '../utils/SizeResponcive';


const SplashScreenIos = () => {
 
  
  return (
    <SafeAreaView style={{flex:1,alignItems:'center',justifyContent:'center',backgroundColor:"white"}}>
    <StatusBar translucent={true} hidden={true}/>
     <Image source={require('../assets/images/VonzuuLogo2.png')} style={{width:wp(30),height:wp(30)}} resizeMode='contain'/>
      
     </SafeAreaView>
  );
}

export default SplashScreenIos;

const styles=StyleSheet.create({
    images:{
      width:wp(50),
      height:wp(50)
      
    }
})