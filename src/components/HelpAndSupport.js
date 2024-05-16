import React from 'react';
import { View, Text, SafeAreaView ,TouchableOpacity} from 'react-native';
import { WebView } from 'react-native-webview';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
const HelpAndSupport = () => {
  const navigation=useNavigation();
  const injectJavaScript = `
    var headerElements = document.getElementsByClassName("header clearfix");
    for (var i = 0; i < headerElements.length; i++) {
      headerElements[i].style.display = "none";
    }

    var footerElements = document.getElementsByClassName("footer-upper");
    for (var j = 0; j < footerElements.length; j++) {
      footerElements[j].style.display = "none";
    }
  `;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableOpacity onPress={() => navigation.navigate('TabStackNavigator')}>
          <View style={{  backgroundColor: '#F2F5F8', padding:10, borderRadius: 15,width:50,left:10}}>
            <MaterialIcons name="arrow-back" size={30} color={"black"} />
          </View>
        </TouchableOpacity>
      <WebView
        source={{ uri: 'https://vonzuu.com/faq' }}
        style={{ flex: 1 }}
        injectedJavaScript={injectJavaScript}
        javaScriptEnabledAndroid={true}
        javaScriptEnabled={true}
      />
 
   </SafeAreaView> 
  );
}

export default HelpAndSupport;
