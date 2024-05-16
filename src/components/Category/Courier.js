import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, ScrollView,  } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import GlobleStyle from '../../utils/GlobleStyle';
import Api from '../../services/Api';
import { wp } from '../../utils/SizeResponcive';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from "react-redux";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const Courier = () => {
  const route = useRoute();
  const { productvenderTypeId } = route.params;
  const navigation = useNavigation();
  const [courierData, setCourierData] = useState([]);
  const [latitude, setLat] = useState(null);
  const [longitude, setLong] = useState(null);
 
  const cutomerId = useSelector((state) => state.CustomerIdSlice.customerId);

  useEffect(() => {
    getAsyncStorageData();
  }, []);
  
  console.log("}}}}}}}}",productvenderTypeId);

  const getAsyncStorageData = async () => {
    try {
      const lat = await AsyncStorage.getItem('lat');
      const long = await AsyncStorage.getItem('long');

      if (lat !== null && long !== null) {
        const latitude = parseFloat(lat);
        const longitude = parseFloat(long);
        setLat(latitude);
        setLong(longitude);
        console.log(latitude, "000000000000000000000",longitude);
        getLocalBrands(latitude,longitude)
      } else {
        console.log('Data not found in AsyncStorage');
      }
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  };


  const getLocalBrands = async (latitude,longitude) => {
    try {
      console.log("{{}}}", latitude,longitude);
      const endPoint = `/api/v1/Catalog/GetVendorByLatLog?EnteredDeliveryAddress=pune&CustomerID=0&storeID=1046&latlong=${latitude} ${longitude}&onlyfavorite=false&pageSize=10&pageIndex=1&VendorTypeID=5`;
    //  const endPoint=`/api/v1/Catalog/SearchProduct?pageSize=10&pageIndex=1&storeID=0&UserID=${cutomerId}&VendorTypeID=${productvenderTypeId}`
      const response = await Api.fetchEndpointData(endPoint);
      console.log(response.data);
      setCourierData(response.data);
    } catch (error) {
      console.log('This is an error', error);
    }
  };
  

  const handleFavoriteAdd = (data) => {
    console.log('Adding to favorites', data);
  };

  return (
    <SafeAreaView style={{  flex: 1,backgroundColor:"#FFFFFF",}}>
<KeyboardAwareScrollView contentContainerStyle={{flexGrow:1,paddingHorizontal:20}}>

      <TouchableOpacity onPress={() => navigation.navigate('TabStackNavigator')} >
          <View style={{  backgroundColor: '#F2F5F8', padding:10, borderRadius: 15,width:50}}>
            <MaterialIcons name="arrow-back" size={30} color={"black"} />
          </View>
        </TouchableOpacity>
       
      {courierData.map((data) => (
        <View key={data.id}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ProductDetail', {
                productId: data.id,
                latitude: latitude,
                longitude: longitude,
                productName: data.name,
                openTime: data.opentime,
                ratingAvg: data.ratingAvg,
                vendorTypeID:`${productvenderTypeId}`
              });
            }}
          >
            <Image source={{ uri: data.pictureUrl }} style={styles.localBrandImages} />
          </TouchableOpacity>
          <View style={{ top: 10 }}>
            <Text style={[GlobleStyle.CustomFont, styles.productNameText]}>{data.name}</Text>
            <Text style={[GlobleStyle.CustomFontText, styles.localBrandsDetailstext]}>
              Open Time {data.opentime} - Close Time {data.closetime}
            </Text>
            <View>
              {data.isfavorite === true ? (
                <TouchableOpacity onPress={() => handleFavoriteAdd(data)}>
                  <AntDesign name="heart" size={20} color={'red'} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => handleFavoriteAdd(data)}>
                  <AntDesign name="heart" size={17} color={'gray'} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      ))}
    </KeyboardAwareScrollView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  localBrandsDetailstext: {
    fontSize: 14,
    color: 'black',
  },
  localBrandImages: {
    height: wp(50),
    width: '100%',
    borderRadius: 8,
  },
  productNameText: {
    fontSize: 17,
    color: 'black',
  },
});

export default Courier;
