import { Dimensions, StyleSheet } from 'react-native';
import { BACKGROUND_COLOR } from 'shared/constants/colors';

const { width } = Dimensions.get('screen');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  dailyWrapper: {
    flex: 1,
    width: width - 30,
    alignSelf: 'center',
    borderRadius: 30,
  },
});
