import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, FlatList } from 'react-native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Api from '../../services/Api';
import { hp, wp } from '../../utils/SizeResponcive';
import { TouchableOpacity } from 'react-native-gesture-handler';
import GlobleStyle from '../../utils/GlobleStyle';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';

const FoodOutlets = ({maindata,currentLocation,}) => {
  const latitude = currentLocation.latitude;
  const longitude = currentLocation.longitude;
  const navigation = useNavigation()
  console.log(maindata,"popopopopopo")
  const [offerData, setOfferData] = useState([]);

  useEffect(() => {
    getFoodOutlets();
  }, []);

  const getFoodOutlets = async () => {
    try {
      const endPoint = '/api/v1/Catalog/HomePage?StoreID=1046';
      const response = await Api.fetchEndpointData(endPoint);

      // Filter the data to only include items with sectionTitle "Special Offer"
      const getFoodOutletsData = response.data.filter(item => item.sectionTitle === "Food outlate you Love");

      setOfferData(getFoodOutletsData);
    } catch (error) {
      // console.log('Error in getSpecialOffers:', error);
    }
  };

  return (
    <View>
      {/* {offerData.map((data, index) => (
        <View key={index} style={styles.sectionContainer}>
          <Text style={[GlobleStyle.headerText]}>{data.sectionTitle}</Text> */}
          {/* <ScrollView horizontal showsHorizontalScrollIndicator={false}>
           */}
            <FlatList data={maindata}
            horizontal={true}
            renderItem={({item,index})=>{
           
             return(
                <TouchableOpacity
                
                onPress={() => {
                  navigation.navigate('ProductDetail', {
                    productId: item.id, latitude: latitude, longitude: longitude, productName: item.name,
                    openTime: item.opentime, ratingAvg: item.ratingAvg,
                  })
                }}
                key={item.id} style={{alignItems:"center",padding:10,borderWidth:1,marginHorizontal:10,marginTop:10,borderRadius:15,borderColor:"#E7ECEF"}}>
              
            <Image source={{uri:item.pictureUrl}} style={styles.specialOfferImage} borderRadius={100}/>
              <Text style={{
                color:"black",
                fontSize:RFPercentage(1.8),
                fontFamily:"Poppins-Regular",
                marginTop:14
              }}>{item.name}</Text>
         
            </TouchableOpacity>
             )

            
           
            }}/>
          
        </View>

  
  );
};

const styles = StyleSheet.create({
  productsScrollView: {
    paddingVertical: 10,
  },
  sectionContainer: {
    marginHorizontal: 10,
    marginVertical: 5,
  },
  headingText: {
    fontSize: 20,
    color: 'black',
  },

  specialOfferImage: {
    height:70,
    width:70,
    // backgroundColor: '#C0F6E3',
    // resizeMode:'contain',
    // borderRadius:10
  },
  spacialOffersDetailstext: {
    fontSize: 15,
    color: '#4C6059',
  },
});

export default FoodOutlets;
