import React, { useState } from 'react';
import { ScrollView, Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import GlobleStyle from '../utils/GlobleStyle';
import Modal from "react-native-modal"; 
import { responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";
import { useNavigation } from '@react-navigation/native';

const SelectDataAndTime = () => {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  const navigation = useNavigation();

  const generateDates = () => {
    const today = new Date();
    const dates = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);

      if (date >= today) {
        dates.push(date);
      }
    }

    return dates;
  };
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setIsModalVisible(true); // Open the modal after selecting a date
  };

  const isSelectedDate = (date) => {
    return selectedDate && selectedDate.getDate() === date.getDate();
  };

  const toggleModal = () => {
    setIsModalVisible(true);
  };

  return (
    <View style={styles.mainContainer}>
           <View style={{ flexDirection: "row", alignItems: "center", left: 10, top: 20 }}>

           <TouchableOpacity onPress={() => navigation.navigate('MyCart')}>
          <View style={{ padding: 10, backgroundColor: '#F2F5F8', width: 50, borderRadius: 15, left: 5 }}>
            <Ionicons name="arrow-back" size={30} color={"black"}/>
          </View>
        </TouchableOpacity>
      <Text style={[GlobleStyle.CustomFont, { fontSize: 18, color: 'black', left: 20 }]}>Select Date and Time</Text>
    </View>

    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
      {generateDates().map((date, index) => (
        <TouchableOpacity key={index} onPress={() => handleDateSelect(date)}>
          <View style={[styles.dateContainer, isSelectedDate(date) && styles.selectedDateContainer]}>
            <Text style={[styles.dayOfWeek, isSelectedDate(date) && styles.selectedDayOfWeek]}>
              {daysOfWeek[date.getDay()]}
            </Text>
            
            <Text style={[styles.dateItem, isSelectedDate(date) && styles.selectedDateItem]}>
              {date.getDate()}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
    {
        <Modal
        isVisible={isModalVisible}
        backdropTransitionOutTiming={0}
        onBackdropPress={() => setIsModalVisible(false)}
        onSwipeComplete={() => setIsModalVisible(false)}
        swipeDirection={['down']}
        style={styles.bottomModal}
      >
        <View style={styles.modalContent}>
          <Text style={[GlobleStyle.CustomFont,{color:"black",fontSize:16}]}>Available time slots</Text>
         
          <TouchableOpacity onPress={() => setIsModalVisible(false)}> 
            <Text style={[GlobleStyle.CustomFont,{color:"black",top:20}]}>Cancel</Text>
          </TouchableOpacity>
          
          <View style={styles.BtnMain}>
          <TouchableOpacity>
            <View style={[styles.BtnContainer, {backgroundColor:"#33FFC2"}]}>
              <Text style={[styles.BtnText, GlobleStyle.CustomHeadingColor, GlobleStyle.CustomFont]}>Back To Home</Text>
            </View>
          </TouchableOpacity>
        </View>

        </View>
       
      </Modal>
      } 

      
    </View>
  );
};

const styles = StyleSheet.create({
    mainContainer:{
      flex:1,
      backgroundColor:"#FFFFFF"
    },
  container: {
    top:40,
    flexDirection: 'row',
    padding: 10,
  },
  dateContainer: {
    paddingHorizontal: 8,
    alignItems: 'center',
    marginRight: 20,
    backgroundColor: 'white',
    borderRadius: 22,
    height:80,justifyContent:"center",
    color:'black'
  },
  selectedDateContainer: {
    backgroundColor: 'black',
  },
  dayOfWeek: {
    fontSize: 14,
    marginBottom: 5,
    color:'black'
  },
  selectedDayOfWeek: {
    color: 'white',
    
  },
  dateItem: {
    fontSize: 18,
    color:'black'
  },
  selectedDateItem: {
    color: 'black',
    height:30,
    backgroundColor:"white",
    borderRadius:20,padding:5,
    justifyContent:"center",
    alignItems:"center"
  },
  
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: '#f5f5f5',
    padding: 22,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 550,  // Adjust the height as needed
  },
  modalText: {
    fontSize: 20,
    marginBottom: 20,
  },
  bottomSheet: {
    backgroundColor: 'white',
    padding: 16,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  BtnMain: {
       
    alignItems: "center",
  },
  BtnContainer: {
    height: responsiveHeight(7), width: responsiveWidth(90),
    alignItems: "center",
    justifyContent: "center", borderRadius: 10,
    top:400,
    marginVertical:10
  },
  BtnText: {
    fontSize: 18,
  },

});

export default SelectDataAndTime;
