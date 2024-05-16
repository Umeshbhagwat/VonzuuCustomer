import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image,SafeAreaView, Alert} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import GlobleStyle from "../utils/GlobleStyle";
import Api from "../services/Api";
import * as logger from "../utils/logger";
 
import { StripeProvider } from "@stripe/stripe-react-native";
import { PaymentSheet, useStripe } from "@stripe/stripe-react-native";
import { customerIdSlice } from "../reduxtoolkit/CustomerIdSlice";
import Toast from "react-native-toast-message";
import { Wave } from "react-native-animated-spinkit";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const Payment = () => {
  const [Loading, setLoading] = useState(false)
  const [allPaymentMethod, setAllpaymentMethod] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const customerId = useSelector((state) => state.CustomerIdSlice.customerId);

  const route = useRoute();
  useEffect(() => {
    GetPaymentMethod();
  }, []);
  
  const { selectedAddressId ,paremnter,OrderID,newGrandTotal} = route.params;
  console.log(OrderID,"this is order id")
  console.log("This is and GrandTotal",newGrandTotal);

  // console.log(paremnter)


  const navigation = useNavigation();
 
  const GetPaymentMethod = async () => {
    try {
      const endPoint = `/api/v1/Payment/PaymentMethodSystemName?StoreID=1046`;
      const response = await Api.fetchEndpointData(endPoint);
      // logger.debug(response.data);
      console.log("--------->>",response)
 
      setAllpaymentMethod(response.data);
    } catch (error) {
      logger.error("error in fetching payment method type");
    }
  };
 
  const placeOrder = async (paymentIntentId, paymentStatus, paymentStatusCode) => {
    console.log(paymentIntentId, paymentStatus, paymentStatusCode,"payment Inticiate")
    setLoading(true)
    if(paremnter === 20){
      setLoading(false)
      
const requestOptions = {

  method: "PUT",

  redirect: "follow"

};
 
fetch(`https://vonzuu.paymentapi.prelive.co.in/api/v1/Payment/ChangeOrderPaymentStatus?OrderId=${OrderID}&PaymentStatusId=${paymentStatusCode}&UserID=${customerId}`, requestOptions)

  .then((response) => response.json())

  .then((result) => console.log(result,"this IS rigsht respone"))

  .catch((error) => {
    Toast.show({
      text1:"Internal Error",
      visibilityTime:3000,
      type:"error"
    })
  });

    }
    else{
      
    try {
      const endPoint = `/api/v1/Ordering/PlaceOrder`;
      const data = {
        storeId: 1046,
        apiKey: "BDD6B8BC-6C51-49C6-8E17-9E09B86E4DBB",
        uniqueSeoCode: "1",
        customerId: customerId,
        isDelivery: true,
        isTakeAway: false,
        customerIp: "string",
        isDinning: false,
        deliveryAddressID: `${selectedAddressId}`,
        couponCode: "string",
        paymentMethodSystemName: selectedPaymentMethod,
        paymentIntent: paymentIntentId,
        paymentStatus: paymentStatus,
        paymentStatusCode: paymentStatusCode
      };
      console.log("Data for place order++++++",data);
      const response = await Api.postEndpointData(endPoint, data);
      if (response.data.statusCode === 200) {
        logger.debug("Order Placed ...", response.data.message);
       setLoading(false)
        navigation.navigate("OrderPlacedSuccessfully");
      } else {
        logger.debug(response.data.message);
        setLoading(false)
        Toast.show({
          text1:"payment failed",
          type:"error",
          visibilityTime:2000
        })
        // Handle the case when OTP verification fails
      }
    } catch (error) {
      logger.error("This is an error in the place order", error);
    }
    }
  };
 
  const handlePlaceOrder = async (paymentIntent, paymentStatus) => {
    if (selectedPaymentMethod === "Payments.Stripe") {
      initializePaymentSheet();
      // console.log("daadadadad")
    } else {
      placeOrder('', '', 0);
    }
  };
 
  // Stripe Implementation
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
 
  const initializePaymentSheet = async () => {
    setLoading(true)
    const { clientSecret, ephemeralKey, paymentIntentId } = await fetchPaymentSheetParams()
    const { error } = await initPaymentSheet({
      paymentIntentClientSecret: clientSecret,
      customerId: customerId,
      customerEphemeralKeySecret: ephemeralKey,
      merchantDisplayName: "Vonzuu",
    });
 
    if (!error) {
      const { paymentError } = await presentPaymentSheet({
        clientSecret: clientSecret,
      });
      if (paymentError) {
        // alert(Error: ${error.message});
        setLoading(false)
        Toast.show({
          text1:"payment failed",
          type:"error",
          visibilityTime:2000
        })
        logger.error("Payment Error::", JSON.stringify(paymentError));
      } else {
        logger.debug("Payment processed??");
        const paymentStatus = await verifyPaymentStatus(paymentIntentId);
        logger.debug("Payment Status::", JSON.stringify(paymentStatus));
        if (paymentStatus.paymentSucceeded) {
          // alert('Payment Successful');
          placeOrder(paymentIntentId, paymentStatus.status, paymentStatus.statusCode);
        navigation.navigate("OrderPlacedSuccessfully");
        Toast.show({
          text1:"Payment success",
          type:"info",
          visibilityTime:2000
        })
        } else {
          Toast.show({
            text1:"payment failed",
            type:"error",
            visibilityTime:2000
          })
          // alert("Payment failed");
        }
      }
    } else {
      logger.error(error);
    }
  };
 
  const verifyPaymentStatus = async (paymentIntentId) => {
    logger.debug("Method::", "fetchPaymentSheetParams");
    const endPoint = `/api/v1/payment/verify-payment-intent`;
    const data = {
      customerId: customerId,
      finalBillAmount: newGrandTotal,
      orderDetailID: 0,
      paymentIntentId: paymentIntentId,
    };
    
    const response = await Api.postEndpointData(endPoint, data);
 
    const json = response.data;
    console.log("[[[[[[[[[[[[[[[---",json)
    logger.debug("Response:jjjverify sttus:", JSON.stringify(json));
    return {
      clientSecret: json.clientSecret,
      ephemeralKey: "",
      customerId: json.customerId,
      paymentSucceeded: json.paymentSucceeded,
      gatewayResponse: json.gatewayResponse,
      status: json.status,
      statusCode: json.statusCode,
    };
  };
 
  const fetchPaymentSheetParams = async () => {
    // logger.debug("Method::", "fetchPaymentSheetParams");
    const endPoint = `/api/v1/payment/create-payment-intent/${customerId}`;
    const response = await Api.fetchEndpointData(endPoint);
 
    const json = response.data;
    logger.debug("Response::", JSON.stringify(json));
    return {
      clientSecret: json.clientSecret,
      ephemeralKey: json.ephemeralKey,
      paymentIntentId: json.paymentIntentId,
    };
  };
  // const handlePayment = async () => {
  //   logger.debug("Event::", "handlePayment");
  //   initializePaymentSheet();
  // };
  const handlePaymentMethod = (paymentMethod) => {
    setSelectedPaymentMethod(paymentMethod);
    logger.debug("Selected Payment method: ", paymentMethod);
 
    setIsOrderPlaced(true);
  };
 
  return (
    
       <SafeAreaView style={{flex:1, backgroundColor: "#FFFFFF" }}>
        <KeyboardAwareScrollView>
      <View style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
        <TouchableOpacity onPress={() => navigation.goBack('')}>
          <View
            style={{
              padding: 8,
              backgroundColor: "#F2F5F8",
              width: 45,
              borderRadius: 10,
              left: 10,
            }}
          >
            <MaterialIcons name="arrow-back" size={25} color={"black"} />
          </View>
        </TouchableOpacity>
        <View style={{ left: 20 }}>
          <Text
            style={[GlobleStyle.CustomFont, { fontSize: 19, color: "black" }]}
          >
            Payment
          </Text>
        </View>
      </View>
 
      {allPaymentMethod.map((paymentMethod, index) => (
       
        <View>
          <TouchableOpacity
            style={{}}
            onPress={() => handlePaymentMethod(paymentMethod)}
          >
            <View
              style={{
                flexDirection: "row",
                padding: 15,
                justifyContent: "space-around",
                backgroundColor:
                  selectedPaymentMethod === paymentMethod
                    ? "#33FFC2"
                    : "#E7ECEF",
                margin: 10,
                borderRadius: 20,
                alignItems: "center",
              }}
            >
              <View style={{}}>
                <Image
                  source={require("../assets/images/PaymentCard.png")}
                  style={styles.logoImage}
                />
              </View>
              <View style={{}}>
                <Text>
                  {paymentMethod === "Payments.CashOnDelivery" ? (
                    <View>
                      <Text
                        style={[
                          GlobleStyle.CustomFont,
                          { fontSize: 17, color: "black" },
                        ]}
                      >
                        COD
                      </Text>
                    </View>
                  ) : (
                    <View>
                      <Text
                        style={[
                          GlobleStyle.CustomFont,
                          { fontSize: 17, color: "black" },
                        ]}
                      >
                        Credit Card{" "}
                      </Text>
                    </View>
                  )}
                </Text>
              </View>
 
              <View style={{}}>
                <Text
                  style={[
                    GlobleStyle.CustomFontText,
                    { fontSize: 35, color: "#50616E" },
                  ]}
                >
                  {">"}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      ))}
 
      <View style={styles.horizontalLine}></View>
 
 
 
      {
        Loading ? (<View style={{ marginTop: 20, alignSelf: 'center' }}>
        <Wave size={40} color='#33FFC2' animating={Loading} /></View>):(
          <View>
            {
              paremnter === 20 ? (
               <>
  {isOrderPlaced ? (
                  <TouchableOpacity
                    style={{
                      marginBottom: 10,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onPress={() => handlePlaceOrder()}
                  >
                    <View
                      style={{
                        width: "90%",
                        height: 50,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#33FFC2",
                        borderRadius: 10,
                      }}
                    >
                      <Text
                        style={[
                          GlobleStyle.CustomFont,
                          { fontSize: 20, color: "black", left: 10 },
                        ]}
                      >
                         Pay Payment
                      </Text>
                    </View>
                  </TouchableOpacity>
                ) :null}
               </>
              ):(
                <>
                {isOrderPlaced ? (
                  <TouchableOpacity
                    style={{
                      marginBottom: 10,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onPress={() => handlePlaceOrder()}
                  >
                    <View
                      style={{
                        width: "90%",
                        height: 50,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#33FFC2",
                        borderRadius: 10,
                      }}
                    >
                      <Text
                        style={[
                          GlobleStyle.CustomFont,
                          { fontSize: 20, color: "black", left: 10 },
                        ]}
                      >
                        Place Order
                      </Text>
                    </View>
                  </TouchableOpacity>
                ) :null}
                </>
              )
            }
</View>
        )
      }
 
</KeyboardAwareScrollView>     
 </SafeAreaView>
  );
};
 
const styles = StyleSheet.create({
  headingAndLogoContainer: {
    justifyContent: "flex-start",
    flexDirection: "row",
    flex: 2,
  },
  allContentMain: {
    flexDirection: "row",
    paddingHorizontal: 5,
    paddingVertical: 8,
    justifyContent: "space-between",
    marginHorizontal: 13,
    backgroundColor: "#E7ECEF",
    borderRadius: 10,
    marginVertical: 5,
  },
  headingContainer: {
    left: 30,
    justifyContent: "center",
    alignItems: "center",
    flex: 2,
  },
  forwordArrow: {
    right: 10,
  },
  logoImage: {
    height: 40,
    width: 60,
    borderRadius: 10,
  },
  logoContainer: {
    justifyContent: "center",
    flex: 2,
  },
  horizontalLine: {
    height: 1,
    backgroundColor: "#F2F5F8",
    top: 20,
  },
  visaMainConatiner: {
    flexDirection: "row",
    paddingHorizontal: 5,
    paddingVertical: 15,
    justifyContent: "space-between",
    marginHorizontal: 10,
    borderRadius: 10,
    marginVertical: 10,
  },
});
 
export default Payment;