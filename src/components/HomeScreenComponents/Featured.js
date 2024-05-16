import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Alert, FlatList } from 'react-native';
import GlobleStyle from '../../utils/GlobleStyle';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { useSelector, useDispatch } from 'react-redux';
import { setData, setError ,clearData} from '../../reduxtoolkit/localBrandsSlice';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Api from '../../services/Api';
import { hp, wp } from '../../utils/SizeResponcive';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { RFPercentage } from 'react-native-responsive-fontsize';
import LongTextWithMore from '../../AllComponents/LongTextWithMore';
 
 
const Featured = ({currentLocation, onLocationSelect,data,logic }) => {
  console.log(data,"this is main logic")
  
  // console.log(data,"data is params")
  const customerId = useSelector((state) => state.CustomerIdSlice.customerId);
  
  const navigation = useNavigation();
  const dispatch = useDispatch();
  // const [productData, setProductData] = useState([]);
  const productData = useSelector((state) => state.allLocal.products);
  
  const latitude = currentLocation.latitude;
  const longitude = currentLocation.longitude;
// Alert.alert(latitude)
  // console.log("This lattude and longitude avilable in the localBrands ", latitude);
 
  const fetchApiData = useCallback(async (endpoint) => {
    try {
     
      const response = await Api.fetchEndpointData(endpoint);
      dispatch(setData(response.data));
    } catch (error) {
      dispatch(setError('Error fetching data. Please try again.'));
      console.error('Error fetching data:', error);
    }
  }, [dispatch,]);
 
  useEffect(() => {
    let endpoint;
 
    dispatch(clearData()); // Dispatch the clearData action before fetching new data
 
    if (onLocationSelect && onLocationSelect.latitude && onLocationSelect.longitude) {
      endpoint = `/api/v1/Catalog/GetVendorByLatLog?CustomerID=${customerId}&storeID=1046&latlong=${onLocationSelect.latitude} ${onLocationSelect.longitude}&pageSize=50&pageIndex=1`;
    } else {
      endpoint = `/api/v1/Catalog/GetVendorByLatLog?CustomerID=${customerId}&storeID=1046&latlong=${latitude} ${longitude}&pageSize=50&pageIndex=1`;
    }
 
    fetchApiData(endpoint);
  }, [latitude, longitude, onLocationSelect, fetchApiData, dispatch,]);
 
  const [isfavorite, setisfavorite] = useState(false)
  
  const handleFavoriteAdd = async (data) => {
    const vendorId = data.id;
 
const requestOptions = {
  method: "PUT",
  redirect: "follow"
};
 
fetch(`https://vonzuu.catalogapi.prelive.co.in/api/v1/Catalog/FavoriteAddRemove?CustomerId=${customerId}&VendorID=${vendorId}`, requestOptions)
  .then((response) => response.text())
  .then((result) => {
// setisfavorite(true)
 
  })
  .catch((error) => {
    Toast.show({
      text1:"Internal Error",
      type:"error",
      visibilityTime:3000
    })
  });
  
 
  };
  const [showAllText, setShowAllText] = useState(false);
 
  const toggleText = () => {
    setShowAllText(!showAllText);
  };
 
  const max =maxLength = 40
  return (
//     <View style={{marginLeft:7,marginVertical:5}}>
        
 
//     <ScrollView showsHorizontalScrollIndicator={false} horizontal >
// {data.map((data) => (
//   <View key={data.id} style={{}}>
//     <TouchableOpacity style={{marginRight:20,marginTop:10}} onPress={() => {
//       navigation.navigate('ProductDetail', {
//         productId: data.id, latitude: latitude, longitude: longitude, productName: data.name,
//         openTime: data.opentime, ratingAvg: data.ratingAvg,logic
//       })
//     }}>
  
//         <Image source={{ uri: data.imageUrl}} style={styles.localBrandImages} />
 
//     </TouchableOpacity>
   
   
//         <Text style={[GlobleStyle.NameOfRes, styles.productNameText]}>{data.name}</Text>
   
//         <Text style={[GlobleStyle.Description,]}>Open Time {data.opentime} - Close Time {data.closetime}</Text>
  
//       <View style={{ flexDirection: "row" }}>
//       <View style={{marginLeft:10}}>
 
 
//         {data.isfavorite === true? (
//         <TouchableOpacity onPress={()=>handleFavoriteAdd(data)}>
//           <AntDesign name="heart" size={20} color={'red'} />
//         </TouchableOpacity>
//         ) : (
//           <TouchableOpacity onPress={()=>handleFavoriteAdd(data)}>
//           <AntDesign name="heart" size={17} color={'grey'} />
//           </TouchableOpacity>
//         )}
 
 
 
 
//       </View>
//         <View style={{left:10}}>
//           <FontAwesome name="star" size={17} color={"#1DC291"} />
//         </View>
 
//         <View style={{ paddingHorizontal: 8 ,left:8}}>
//           <Text style={[GlobleStyle.CustomFont, styles.localBrandsDetailstext,]}>{data.ratingAvg}</Text>
//         </View>
 
       
      
 
//     </View>
//   </View>
// ))}
// </ScrollView>
 
//   </View>
 
<FlatList
style={{paddingHorizontal:10}}
data={data}
horizontal={true}
showsHorizontalScrollIndicator={false}
renderItem={({item,index})=>{
  return(
    <View>
    <TouchableOpacity
     style={{marginRight:20,marginLeft:8}} onPress={()=>{
       navigation.navigate('ProductDetail', {
         productId: item.id, latitude: latitude, longitude: longitude, productName: item.name,
         openTime: item.opentime, ratingAvg: item.ratingAvg,logic})
        }}>
<Image source={{uri:item.pictureUrl}} style={{width:wp(37),height:wp(30)}} borderRadius={8}/>
</TouchableOpacity>
<View style={{backgroundColor:"#2E9169",position:'absolute',borderRadius:4,paddingHorizontal:5,top:10,}}>
  <Text style={{fontFamily:"Poppins-Bold",color:"white",fontSize:RFPercentage(2)}}>{item.ratingAvg}.2</Text>
 
</View>
 
 
<Text style={{color:"black",fontSize:RFPercentage(2.3),fontFamily:"Poppins-SemiBold",marginTop:6}}>{item.name}</Text>
 
<LongTextWithMore text={item.description} maxLength={40} />
 
</View>
  )
}}
/>
 
  )
}
 
export default Featured
 
const styles = StyleSheet.create({
    localBrandsDetailstext: {
        fontSize: 14,
        color: 'black',
      },
      localBrandImages: {
        height:hp(20),
        width:wp(80),
        // backgroundColor: '#C0F6E3',
        resizeMode:'cover',
        borderRadius:10
      },
      localBrandImagesimageText: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        // marginHorizontal: 10,
      },
      productContainer: {
        padding: 8,
        flexDirection: 'row',
      },
      productNameText: {
        fontSize: 17,
        color: 'black',
      },
      headingText: {
        fontSize: 20,
        color: 'black',
      },
      productsScrollView: {
        // paddingHorizontal: 15,
      },
})