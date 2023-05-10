import { Dimensions, StyleSheet } from 'react-native';
import { BACKGROUND_COLOR } from 'shared/constants/colors';

const { width } = Dimensions.get('screen');

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: BACKGROUND_COLOR,
  },
  dailyWrapper: {
    width: width - 30,
    alignSelf: 'center',
    borderRadius: 30,
    marginTop: 20,
  },
});
