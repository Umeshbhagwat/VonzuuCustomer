import { FlatList, Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
// import { Image } from 'react-native-paper/lib/typescript/components/Avatar/Avatar';
import { wp } from '../../utils/SizeResponcive';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';
import LongTextWithMore from '../../AllComponents/LongTextWithMore';
 
const AllGroceryStore = ({currentLocation, onLocationSelect,data ,logic,maxLength = 35}) => {
 
    const navigation =useNavigation()
  const latitude = currentLocation.latitude;
  const longitude = currentLocation.longitude;
  return (
    <View>
      <FlatList
      data={data}
      renderItem={({item,index})=>{
        return(
            <TouchableOpacity
            style={{marginBottom:25,marginHorizontal:10,flexDirection:'row'}}
            onPress={()=>{
                navigation.navigate('ProductDetail', {
                  productId: item.id, latitude: latitude, longitude: longitude, productName: item.name,
                  openTime: item.opentime, ratingAvg: item.ratingAvg,logic})
                 }}
            >
<Image source={{uri:item.pictureUrl}} style={{width:wp(30),height:wp(35),marginLeft:8}} borderRadius={8}/>
<View style={{backgroundColor:"#2E9169",position:'absolute',borderRadius:4,paddingHorizontal:8,top:10,}}>
  <Text style={{fontFamily:"Poppins-Bold",color:"white",fontSize:RFPercentage(2)}}>{item.ratingAvg}</Text>
 
</View>
 
<View style={{marginLeft:18,}}>
 
<Text style={{fontFamily:"Poppins-Medium",fontSize:RFPercentage(2.4),color:"black",marginTop:5}}>{item.name}</Text>
{/* <LongTextWithMore text={item.description} maxLength={20}/>
*/}
<Text style={{color:"#737B89",fontFamily:"Poppins-Regular",fontSize:RFPercentage(1.8),width:wp(40),marginTop:3}}>{item.description.slice(0, maxLength)}...`</Text>
<Text style={{color:"#2E9169",fontFamily:"Poppins-Medium",fontSize:RFPercentage(1.8),marginTop:3}}>10% off on first order(HC)</Text>
<Text style={{color:"#737B89",fontFamily:"Poppins-Regular",fontSize:RFPercentage(1.6),marginTop:3}}>Deliver in 72 mins(HC)</Text>
</View>
 
            </TouchableOpacity>
        )
      }}
      />
    </View>
  )
}
 
export default AllGroceryStore
 
const styles = StyleSheet.create({})