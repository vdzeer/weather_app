import { StyleSheet } from 'react-native';
import {
  LIGHT,
  LIGHT05,
  NAV_BACKGROUND_COLOR,
  WHITE,
} from 'shared/constants/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    backgroundColor: NAV_BACKGROUND_COLOR,
    borderRadius: 25,
    padding: 20,
    marginHorizontal: 5,
  },
  icon: {
    width: 36,
    height: 36,
    color: LIGHT,
    marginBottom: 10,
    tintColor: WHITE,
  },
  valueTitle: {
    fontSize: 14,
    color: LIGHT,
  },
  unitTitle: {
    fontSize: 11,
    color: LIGHT05,
  },
  title: {
    fontSize: 14,
    color: LIGHT05,
    marginTop: 10,
    textTransform: 'capitalize',
  },
});
