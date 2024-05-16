
import { ActivityIndicatorBase, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { RFPercentage } from 'react-native-responsive-fontsize'
import Modal from "react-native-modal";
import { ActivityIndicator } from 'react-native-paper'
// import { TouchableOpacity } from 'react-native-gesture-handler'

const ModlCompomet = ({isVisible,MainLabel,MoadlClose,clearCartData,load}) => {


  return ( 
    <Modal visible={isVisible} transparent={true} >
            <View style={{alignItems:'center',justifyContent:'center',flex:1,paddingHorizontal:20,backgroundColor:"#D8C7C760"}}>

            <View style={{backgroundColor:"white",paddingVertical:20,borderRadius:12,paddingHorizontal:60,}}>
             
 <Text style={{color:"black",fontSize:RFPercentage(2.2),alignSelf:'center',fontFamily:"Poppins-SemiBold",textAlign:'center'}}>{MainLabel}</Text>

<View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:20}}>

    <TouchableOpacity  onPress={()=>clearCartData()}  style={{backgroundColor:"#33FFC2",paddingHorizontal:25,borderRadius:7,paddingVertical:4}}>
    <Text style={{color:"black",fontSize:RFPercentage(1.8),fontFamily:"Poppins-Medium"}}>Yes</Text>

  </TouchableOpacity>




  <TouchableOpacity onPress={()=>MoadlClose()} style={{backgroundColor:"#33FFC2",paddingHorizontal:25,borderRadius:7,paddingVertical:4}}>
    <Text style={{color:"black",fontSize:RFPercentage(1.8),fontFamily:"Poppins-Medium"}}>No</Text>

  </TouchableOpacity>

</View> 
            </View>
            </View>

      </Modal>
  )
}

export default ModlCompomet

const styles = StyleSheet.create({})