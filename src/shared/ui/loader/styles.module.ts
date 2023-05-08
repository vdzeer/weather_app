import { StyleSheet } from 'react-native';
import { BACKGROUND_COLOR } from 'shared/constants/colors';

export const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BACKGROUND_COLOR,
  },
  lottie: { height: 220, width: 220 },
});
