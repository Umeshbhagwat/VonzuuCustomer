import {Dimensions} from 'react-native';

const {height, width} = Dimensions.get('window');

export const hp = value => (height / 100) * value;

export const wp = value => (width / 100) * value;