// import { Text } from "react-native-svg";

import { Text, TextInput } from "react-native";


export const TxtResize=   Text.defaultProps = {
    ...Text.defaultProps,
    allowFontScaling: false,
  };
  export const textInput = TextInput.defaultProps = {
    ...TextInput.defaultProps,
    allowFontScaling:false
  }