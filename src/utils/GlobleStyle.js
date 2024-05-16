import { StyleSheet } from "react-native";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { RFPercentage } from "react-native-responsive-fontsize";
export default StyleSheet.create({
  CustomFont: {
    fontFamily: "Poppins-SemiBold",
    fontSize: responsiveFontSize(2),
  },
  CustomFontText: {
    fontFamily: "Poppins-Regular",
    fontSize: responsiveFontSize(2),
    color: "#6D7E8B",
  },
  CustomHeadingColor: {
    color: "#0D1D28",
  },
  PrimaryColor: {
    backgroundColor: "#00DB99",
  },

  secondoryColor: {
    backgroundColor: "#9B56FF",
  },
  defaultTextColor: {
    color: "#50616E",
  },
  headerText: {
    color: "black",
    fontSize: RFPercentage(2.2),
    fontFamily: "Poppins-SemiBold",
    marginVertical: 4,
    marginRight:4
  },
  NameOfRes: {
    fontSize: RFPercentage(2.4),
    marginLeft: 10,
    color: "black",
    width: 300,
    fontFamily: "Poppins-SemiBold",
    marginTop: 5,
  },
  Description: {
    fontSize: RFPercentage(2),
    marginLeft: 10,
    fontFamily: "Poppins-Regular",
    width: 300,
    color: "black",
  },
});
