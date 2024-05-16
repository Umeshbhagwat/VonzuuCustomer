import { Dimensions, Platform } from 'react-native';
const { width, height } = Dimensions.get('window');
// Standard guideline for iPhone X (375x812) - Portrait
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

// Define guidelines for tablets or other large screens
const tabletWidth = 768;
const tabletHeight = 1024;

// Check if the device is a tablet
const isTablet = () => {
const dim = Dimensions.get('window');
return dim.width >= tabletWidth || dim.height >= tabletHeight;
};

// Handle different scale factors for tablets
const getScaleFactor = () => {
return isTablet() ? 1.5 : 1;
};

const horizontalScale = (size) => (width / guidelineBaseWidth) * size;
const verticalScale = (size) => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) => {
const scaleFactor = getScaleFactor();

// Conditionally adjust for platform
const adjustment = Platform.OS === 'ios' ? 1.2 : 1;

return size + (horizontalScale(size) - size) * factor * scaleFactor * adjustment;
};

export { horizontalScale, verticalScale, moderateScale };