import { Dimensions, StyleSheet } from 'react-native';
import {
  BACKGROUND_COLOR,
  LIGHT,
  NAV_BACKGROUND_COLOR,
} from 'shared/constants/colors';

const { width } = Dimensions.get('screen');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  searchWrapper: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: '15%',
    marginHorizontal: '4%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    backgroundColor: NAV_BACKGROUND_COLOR,
    padding: 10,
    flex: 1,
    borderRadius: 30,
    color: LIGHT,
    paddingLeft: 25,
  },
  dailyWrapper: {
    flex: 1,
    width: width - 30,
    alignSelf: 'center',
    borderRadius: 30,
  },
});
