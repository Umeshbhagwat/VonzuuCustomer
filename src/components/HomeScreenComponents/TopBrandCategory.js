import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { wp } from "../../utils/SizeResponcive";
import { RFPercentage } from "react-native-responsive-fontsize";
 
const TopBrandCategory = ({
  currentLocation,
  onLocationSelect,
  data,
  logic,
  maxLength = 35,
}) => {
  const navigation = useNavigation();
  const latitude = currentLocation.latitude;
  const longitude = currentLocation.longitude;
  return (
    <View>
      <FlatList
        data={data}
        horizontal={true}
        style={{ backgroundColor: "#F3F6F9", width: "100%" }}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              style={{
                marginHorizontal: 20,
                paddingVertical: 30,
                alignItems: "center",
              }}
              onPress={() => {
                navigation.navigate("ProductDetail", {
                  productId: item.id,
                  latitude: latitude,
                  longitude: longitude,
                  productName: item.name,
                  openTime: item.opentime,
                  ratingAvg: item.ratingAvg,
                  logic,
                });
              }}
            >
              <Image
                source={{ uri: item.pictureUrl }}
                style={{
                  width: wp(20),
                  borderColor: "#737B8914",
                  borderWidth: 1,
                  height: wp(20),
                }}
                borderRadius={75}
              />
              <Text
                style={{
                  marginTop: 10,
                  fontFamily: "Poppins-Regular",
                  color: "black",
                  fontSize: RFPercentage(2),
                }}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};
 
export default TopBrandCategory;
 
const styles = StyleSheet.create({});
 