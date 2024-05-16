import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Api from '../../services/Api';
import { hp, wp } from '../../utils/SizeResponcive';
import { TouchableOpacity } from 'react-native-gesture-handler';
import GlobleStyle from '../../utils/GlobleStyle';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
const PopularRestaurants= () => {
  const [offerData, setOfferData] = useState([]);

  useEffect(() => {
    getPopularRestaurants();
  }, []);

  const getPopularRestaurants = async () => {
    try {
      const endPoint = '/api/v1/Catalog/HomePage?StoreID=1046';
      const response = await Api.fetchEndpointData(endPoint);

      // Filter the data to only include items with sectionTitle "Special Offer"
      const getPopularRestaurantsData = response.data.filter(item => item.sectionTitle === "Popular Restaurants");

      setOfferData(getPopularRestaurantsData);
    } catch (error) {
      console.log('Error in getSpecialOffers:', error);
    }
  };

  return (
    <View>
      {offerData.map((data, index) => (
        <View key={index} style={styles.sectionContainer}>
          <Text style={[GlobleStyle.headerText]}>{data.sectionTitle}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {data.subList.map((item) => (
              <View style={styles.itemContainer}>
              <TouchableOpacity key={item.id} >

                <Image source={{ uri: item.imageUrl }} style={styles.specialOfferImage} />
               
              </TouchableOpacity>
              <Text style={GlobleStyle.NameOfRes}>{item.name}</Text>
              <Text style={[GlobleStyle.Description]}>{item.details}</Text>

               <View style={{flexDirection:"row",marginLeft:10}}>  
                       <FontAwesome name="star" size={20} color={"#1DC291"} />  
                    <Text style={[GlobleStyle.CustomFontText,{marginLeft:5}]}>{item.rating}</Text> 
               </View>   

             </View> 
             
            ))}
            </ScrollView>
        </View>
      ))}
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
  itemContainer: {
    marginRight: 20,
    
  },
  specialOfferImage: {
    height:hp(20),
    width:wp(80),
    // backgroundColor: '#C0F6E3',
    resizeMode:'cover',
    borderRadius:10
  },
  spacialOffersDetailstext: {
    fontSize: 15,
    color: '#4C6059',
  },
});

export default PopularRestaurants;
