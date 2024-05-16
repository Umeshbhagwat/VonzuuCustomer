import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ImageBackground, TouchableOpacity } from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";
import GlobleStyle from '../utils/GlobleStyle';

const OrderDelivered = () => {
  const [starRating, setStarRating] = useState(0);

  const handleStarClick = (rating) => {
    setStarRating(rating);
  };

  const handleSubmit = () => {
    console.log('Total star rating:', starRating);
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.backBtnContainer}>
        <FontAwesome6 name="arrow-left" size={20} color={"black"} />
      </View>
      <ImageBackground source={require('../assets/images/OrderDeliveredBackground.png')} style={styles.backgroundImage}>
        <View style={styles.imageContainer}>
          <Image source={require('../assets/images/OrderDelivered.png')} style={styles.orderDeliveredImage} />
        </View>
      </ImageBackground>

      <View style={styles.textContainer}>
        <Text style={[GlobleStyle.CustomFont, styles.headingText]}>Order Delivered!</Text>
        <Text style={[GlobleStyle.CustomFont, styles.descriptionText]}>Your Order #658339 has been delivered successfully. Please give your valuable feedback.</Text>
      </View>

      <View style={{ height: 1, borderWidth: 1, borderColor: "#E3E7EF" }}></View>

      <View style={{ alignItems: 'center', top: 30 }}>
        <Text style={[GlobleStyle.CustomFont, { fontSize: 17, color: "#091223" }]}>Rate Your delivery by </Text>
        <Text style={[GlobleStyle.CustomFont, { fontSize: 20, color: "#8D1B44" }]}> Willie Lane </Text>
      </View>

      <View style={styles.starContainer}>
        {[1, 2, 3, 4, 5].map((index) => (
          <TouchableOpacity key={index} onPress={() => handleStarClick(index)}>
            <AntDesign
              name="star"
              size={30}
              color={index <= starRating ? "#ffb347" : "gray"}
            />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Loved it!</Text>
      </TouchableOpacity>
     
      <View style={styles.BtnMain}>
          <TouchableOpacity>
            <View style={[styles.BtnContainer, {backgroundColor:"#33FFC2"}]}>
              <Text style={[styles.BtnText, GlobleStyle.CustomHeadingColor, GlobleStyle.CustomFont]}>Submit Feedback</Text>
            </View>
          </TouchableOpacity>
        </View>

    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF"
  },
  backgroundImage: {
    width: responsiveWidth(100),
    height: responsiveHeight(30),
    resizeMode: 'cover',
    top: 50
  },
  backBtnContainer: {
    padding: 8,
    backgroundColor: "#F2F5F8",
    width: 40,
    left: 10,
    borderRadius: 10,
    position: 'absolute',
    top: 10
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  orderDeliveredImage: {
    width: responsiveWidth(75),
    height: responsiveHeight(40),
    resizeMode: 'contain'
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
    padding: 20
  },
  headingText: {
    fontSize: 22,
    color: "black",
    textAlign: 'center'  // Center-align the heading text
  },
  descriptionText: {
    fontSize: 16,
    color: "#737B89",
    textAlign: 'center'  // Center-align the description text
  },
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 50,
  },
  submitButton: {
    backgroundColor: "#aaf0d1",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginTop: 20,
    alignSelf: 'center'
  },
  submitButtonText: {
    color: "black",
    fontSize: 18,
    fontWeight: 'bold'
  },
  BtnMain: {
       
    alignItems: "center",
  },
  BtnContainer: {
    height: responsiveHeight(7), width: responsiveWidth(90),
    alignItems: "center",
    justifyContent: "center", borderRadius: 10,
    top:20,
    marginVertical:10
  },
  BtnText: {
    fontSize: 20,
  },
});

export default OrderDelivered;
