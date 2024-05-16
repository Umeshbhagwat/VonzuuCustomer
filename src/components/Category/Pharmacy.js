import React from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView ,TouchableOpacity} from 'react-native';
import { horizontalScale, verticalScale, moderateScale } from '../../utils/Responsive';
import GlobleStyle from '../../utils/GlobleStyle';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
const Pharmacy = () => {
  const navigation=useNavigation();
  return (
   <SafeAreaView style={{flex:1,backgroundColor:'#FFFFFF'}}>
    <KeyboardAwareScrollView contentContainerStyle={{flexGrow:1,paddingHorizontal:20}}>
    
    <TouchableOpacity onPress={() => navigation.navigate('TabStackNavigator')}>
        <View style={{  backgroundColor: '#F2F5F8', padding:10, borderRadius: 15,width:50}}>
            <MaterialIcons name="arrow-back" size={30} color={"black"} />
          </View>
        </TouchableOpacity>

    <View style={styles.mainContainer}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/images/CommingSoon.png')}
          style={styles.images}
          resizeMode="contain"
        />
      </View>
      <View style={{ justifyContent: 'center', alignItems: 'center', padding: moderateScale(20) }}>
        <Text style={[GlobleStyle.CustomFont, styles.headingText]}>Coming Soon</Text>
        <Text style={[GlobleStyle.CustomFontText, styles.contentText]}>
          we’re working on it right now. We’ll let you know as soon as we are
        </Text>
      </View>
    </View>
    </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    height: verticalScale(200),
    width: horizontalScale(200),
    overflow: 'hidden', // Ensure the image is contained within the container
  },
  images: {
    flex: 1,
    width: undefined,
    height: undefined,
  },
  headingText: {
    fontSize: moderateScale(22),
    color: 'black',
    textAlign: 'center',
  },
  contentText: {
    top: verticalScale(10),
    fontSize: moderateScale(17),
    color: '#50616E',
    textAlign: 'center',
  },
});

export default Pharmacy;
