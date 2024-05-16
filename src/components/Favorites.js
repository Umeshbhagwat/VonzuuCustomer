import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { favorites } from './products';
import { useSelector, useDispatch } from 'react-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import GlobleStyle from '../utils/GlobleStyle';
import { TabRouter, useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Api from '../services/Api';
import { Wave } from 'react-native-animated-spinkit';
import Toast from "react-native-toast-message"
import { RFPercentage } from 'react-native-responsive-fontsize';

const Favorites = () => {
  const [latitude, longitude] = useSelector((state) => state.LatlongSlices.userLatLong);
  const [favoriteVendors, setFavoriteVendors] = useState([]);
  const [Loading, setLoading] = useState(false)
  const navigation = useNavigation();

  const cutomerId = useSelector((state) => state.CustomerIdSlice.customerId);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
      setLoading(true)
    });
    // setLoading(true)
    return unsubscribe


  }, []);
  const fetchData = async () => {
    try {
      const endpoint = `/api/v1/Catalog/GetVendorByLatLog?CustomerID=${cutomerId}&storeID=1046&latlong=${18.511793} ${73.848209}&onlyfavorite=true&pageSize=10&pageIndex=1`;
      const response = await Api.fetchEndpointData(endpoint);
      const favoriteData = response.data.filter(vendor => vendor.isfavorite === true);
      setFavoriteVendors(favoriteData);
      setLoading(false)
    } catch (error) {
      console.log('Error in fetching data', error);
      setLoading(false)
      seteroore("data not found")
      Toast.show({
        visibilityTime: 2000,
        text1: "Vonzuu",
        text2: "Data not found",
        type: "error"
      })
    }
  };
  const [error, seteroore] = useState()
  const handleFavoriteRemove = async (data) => {
    const VenderId = data.id;
    console.log("@@@@@@", VenderId);
    try {
      const endpoint = `/api/v1/Catalog/FavoriteAddRemove?CustomerId=${cutomerId}&VendorID=${VenderId}`;
      const responce = await Api.putEndpointData(endpoint);
      // Update the state with an empty array to trigger re-render
      setFavoriteVendors([]);
      fetchData();
    } catch (error) {
      console.log('Error in handle deleteCartItem', error);
    }
  };
  console.log(favoriteVendors, "1231313----")
  return (
    <SafeAreaView style={{flex:1, backgroundColor: "#FFFFFF" }}>
      {
        Loading ? (<View style={{ height: "100%", alignItems: 'center', justifyContent: 'center' }}><Wave size={50} color='#33FFC2' animating={Loading} /></View>) : (
          <View style={styles.mainContainer}>
            <View style={{ left: 25, paddingTop: 10 }}>
              <Text style={[GlobleStyle.CustomFont, styles.faverateheasding]}> Your Favorites </Text>
            </View>
          { favoriteVendors.length >0 ?(
               <ScrollView style={{marginTop:20}}>

               {favoriteVendors.map((data) => (
                 <View>
                   <TouchableOpacity 
                   
                   style={{flexDirection:'row',alignItems:'center',backgroundColor:"white",marginHorizontal:12}}
                   onPress={() => {
                     navigation.navigate('ProductDetail', {
                       productId: data.id, latitude: latitude, longitude: longitude, productName: data.name,
                       openTime: data.opentime, ratingAvg: data.ratingAvg,
                     })
                   }}>
                           <Image source={{ uri: data.pictureUrl }} style={styles.localBrandImages} resizeMode='cover' />
                       
                        <View style={{marginLeft:10}}>

                     
                     
                           <Text style={{
                            fontSize:RFPercentage(2.4),
                            fontFamily:"Poppins-SemiBold",
                            color:"black",
                            width:280
                           }}>{data.name}</Text>
                      
                          <Text style={{
                            fontSize:RFPercentage(1.7),
                            fontFamily:"Poppins-Regular",
                            color:"black",
                            width:280
                          }}>Open Time {data.opentime}-Close Time {data.closetime}</Text>
                        

                        <View style={{flexDirection:'row',alignItems:'center'}}>

                         <FontAwesome name="star" size={17} color={"#1DC291"} />
                        
                             <Text style={{
                                fontSize:RFPercentage(1.7),
                                fontFamily:"Poppins-Regular",
                                color:"black",
                                marginHorizontal:3
                             }}>{data.ratingAvg}</Text>
                           
                        
 
                           {data.isfavorite === true ? (
                             <TouchableOpacity onPress={() => handleFavoriteRemove(data)}>
                               <AntDesign name="heart" size={20} color={'gray'} />
                             </TouchableOpacity>
                           ) : (
                             <TouchableOpacity onPress={() => handleFavoriteRemove(data)}>
                               <AntDesign name="heart" size={17} color={'red'} />
                             </TouchableOpacity>
                           )}
                         
                           </View>
 
                         </View>
                    
 
                   </TouchableOpacity>
 
                   <View style={{ padding: 20, }}>
                     <View style={{ borderWidth: 1, borderBlockColor: "#E3E7EF" }}></View>
                   </View>
 
                 </View>
               ))}
 
 
             </ScrollView>

          ):(
            <View style={{justifyContent:"center",alignItems:"center",flex:1}}>
              <Text style={[GlobleStyle.CustomFont,{color:"black"}]}>No favorite item is available</Text>
            </View>
          )}
           
           
          </View>
        )
        
      }
      
      </SafeAreaView>


  );
}

const styles = StyleSheet.create({
  faverateheasding: {
    fontSize: 20, color: 'black'
  },
  porductImage: {
    height: 80,
    width: 100,
    borderRadius: 10
  },
  horizontalLine: {
    height: 1,
    backgroundColor: '#F2F4F8',
    marginHorizontal: 10,
    top: 5
  },
  itemContainer: {

    padding: 17,

  },
  mainContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF"
  },
  localBrandsDetailstext: {
    fontSize: 13,
    color: 'black',
  },
  localBrandImages: {
    height: 100,
    width: 100,
    borderRadius: 8,
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
    paddingHorizontal: 15,
  },
})

export default Favorites;
