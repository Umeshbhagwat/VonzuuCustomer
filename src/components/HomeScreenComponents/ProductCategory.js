import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { RFPercentage } from "react-native-responsive-fontsize";
import Api from "../../services/Api";
import { products } from "../products";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import GlobleStyle from "../../utils/GlobleStyle";
import LocalBrands from "./LocalBrands";
import SpecialOffers from "./SpecialOffers";
import FoodOutlets from "./FoodOutlets";
import { Wave } from "react-native-animated-spinkit";
import { wp } from "../../utils/SizeResponcive";
import Featured from "./Featured";
import AllGroceryStore from "./AllGroceryStore";
import TopBrandCategory from "./TopBrandCategory";
 
const ProductCategory = ({ currentLocation, cutomerId }) => {
  console.log(">>>>>", currentLocation);
 
  const navigation = useNavigation();
  const [category, setCategory] = useState([]);
 
  useEffect(() => {
    fetchCategory();
  }, []);
 
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // fetcdata(1)
    });
    // setLoading(true)
    return unsubscribe;
  }, []);
  const fetchCategory = async () => {
    try {
      const endPoint = "/api/v1/Catalog/Vendor_Type?StoreID=1046";
      const response = await Api.fetchEndpointData(endPoint);
      setCategory(response.data);
    } catch (error) {
      console.log("This is an error", error);
    }
  };
 
  const [borderWidth, setBorderWidth] = useState(1);
  console.log(borderWidth, "this is border width");
  useEffect(() => {
    fetcdata(1);
  }, [currentLocation.latitude]);

  const handleProductPress = (product) => {
    console.log("This is an productId",product.id);
    if(product.id === 6){
      navigation.navigate('PickAndDrop',currentLocation)
    }
    else{
      setBorderWidth(product.id);
      fetcdata(product.id);
    }
   
  };

  const [Loading, setLoading] = useState(true);
 
  const [VenderData, setVenderData] = useState([]);
  const [Error, setError] = useState("");
  const [Errrr, setErrrr] = useState("");
  console.log(Error, "jain");
  console.log(VenderData, "llllllllll");
  const fetcdata = (vendorId) => {
    setLoading(true);
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    const url = `https://vonzuu.catalogapi.prelive.co.in/api/v1/Catalog/HomePage?EnteredDeliveryAddress=%22%22&storeID=1046&UserID=${cutomerId}&pageSize=10&pageIndex=1&onlyfavorite=false&LongLat=${currentLocation.latitude} ${currentLocation.longitude}&VendorTypeID=${vendorId}&homeCatogeryid=0`;
     console.log(url,"body--")
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result.result, "klkl");
        if (result.result.length === 0) {
          // setErrrr("Cooming soon")
          setBorderWidth(1);
          fetcdata(1);
          Alert.alert("Cooming Soon");
        } else {
          setError(result.result[0].vendors.length === 0);
          setVenderData(result.result);
        }
        // jatin
 
        setLoading(false);
      })
      .catch((error) => {
        Toast.show({
          text1: "Internal Error",
          type: "error",
        });
        // setError("sorry, online ordering isn't available at you location yet. we'll bee there soon-hang tight!")
        setLoading(false);
      });
  };
 
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={{ alignItems: "center", marginRight: 12, padding: 8 }}
      onPress={() => handleProductPress(item)}
      key={"tc_" + item.displayOrder}
    >
      <View
        style={[
          styles.productImageContainer,
          {
            borderWidth: borderWidth == item.id ? 1 : null,
            borderColor: borderWidth == item.id ? "#33FFC2" : null,
          },
        ]}
      >
        <Image source={{ uri: item.imageURL }} style={styles.productImage} />
      </View>
      <Text style={styles.productNameText}>{item.name}</Text>
    </TouchableOpacity>
  );
 
  return (
    
    <>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={category}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        contentContainerStyle={styles.productsContainer}
      />
 
      {/* {
        Error === "sorry, online ordering isn't available at you location yet. we'll bee there soon-hang tight!"?(
<Text>{Error}</Text>
        ):(
<> */}
 
      {Loading ? (
        <View style={{ alignItems: "center", marginTop: 20 }}>
          <Wave animating={Loading} size={45} color="#33FFC2" />
        </View>
      ) : (
        <>
          {Error === true ? (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                marginTop: 20,
                borderWidth: 1,
                borderRadius: 12,
                padding: 5,
                marginHorizontal: 20,
                borderColor: "grey",
              }}
            >
              <Image
                source={require("../../assets/images/Artwork.png")}
                style={{ width: wp(25), height: wp(25) }}
              />
 
              <Text
                style={{
                  color: "black",
                  fontSize: RFPercentage(2.2),
                  textAlign: "center",
                  fontFamily: "Poppins-SemiBold",
                  // marginHorizontal:30,
                  marginTop: 30,
                  marginVertical: 4,
                }}
              >
                sorry, online ordering isn't available at you location yet.
                we'll bee there soon-hang tight!
              </Text>
            </View>
          ) : (
            <FlatList
              data={VenderData}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => {
                // console.log(item,"\\\\\\\\\\")
                return (
                  <View style={{}}>
                    <Text style={[GlobleStyle.headerText, { marginLeft: 7 }]}>
                      {item.homecategoryName}
                    </Text>
 
                    {item.templateId === 201 ? (
                      <LocalBrands
                        data={item.vendors}
                        currentLocation={currentLocation}
                        logic={borderWidth}
                      />
                    ) : null}
                    {item.templateId === 202 ? (
                      <SpecialOffers main={item.subListItems} />
                    ) : null}
                    {item.templateId === 204 ? (
                      <FoodOutlets
                        maindata={item.vendors}
                        currentLocation={currentLocation}
                      />
                    ) : null}
                    {
                      item.templateId === 205 ?(
                        <Featured
                        data={item.vendors}
                        currentLocation={currentLocation}
                        logic={borderWidth}
 
                        
                        />
                      ):null
                    }
                    {
                      item.templateId === 206 ?(
                        <AllGroceryStore
                        data={item.vendors} currentLocation={currentLocation}
                        logic={borderWidth} />
                      ):null
                    }
                    {
                      item.templateId === 207 ?(
                          <TopBrandCategory
                          data={item.vendors} currentLocation={currentLocation}
                          logic={borderWidth}
                          />
                      ):null
                    }
 
 
                  </View>
                );
              }}
            />
          )}
        </>
      )}
    </>
  );
};
 
//       </>
//   );
// };
// 18008969999
const styles = StyleSheet.create({
  productImageContainer: {
    width: responsiveWidth(24),
    height: responsiveHeight(12),
    backgroundColor: "#F2F5F8",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  productImage: {
    width: responsiveWidth(17.5),
    height: responsiveHeight(8.5),
    borderRadius: 20,
    resizeMode: "contain",
  },
  productNameText: {
    fontSize: RFPercentage(1.6),
    color: "#091223",
    fontFamily: "Poppins-Medium",
    width: 90,
    textAlign: "center",
  },
  productsContainer: {
    paddingVertical: 10,
    alignItems: "center",
  },
});
 
export default ProductCategory;
 