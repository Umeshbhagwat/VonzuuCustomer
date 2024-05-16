import React, { useEffect, useState } from 'react';
import { View, Text, Modal, StyleSheet, Animated, TouchableOpacity, Image } from 'react-native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
const NotificationModal = ({ title, body, image, visible, onClose }) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [fadeAnim, visible]);

  const closeModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => closeModal()}
    >
      <View style={styles.modalContainer}>
        <Animated.View
          style={[
            styles.modalContent,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          {image && (
           <TouchableOpacity onPress={()=>console.log('Welcome to Notification')}>
            <Image source={{ uri: image }} style={styles.image} resizeMode="contain" />
            </TouchableOpacity>
          )}
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.body}>{body}</Text>
          <TouchableOpacity onPress={() => closeModal()} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: responsiveWidth(95),
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    top: 10,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  image: {
    width: responsiveWidth(90),
    height: responsiveHeight(15),
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color:"black"
  },
  body: {
    fontSize: 14,
    color:"black"
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#33FFC2',
  },
  closeButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
});

export default NotificationModal;
