import { Dimensions, StyleSheet } from 'react-native';
import { BACKGROUND_COLOR, LIGHT, LIGHT05 } from 'shared/constants/colors';

const { width } = Dimensions.get('screen');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  date: {
    marginTop: '15%',
    marginLeft: '7%',
  },
  dateText: {
    color: LIGHT05,
    fontSize: 12,
  },
  location: {
    marginTop: 3,
    marginLeft: '6%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    color: LIGHT,
    fontSize: 25,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  weatherIconView: {
    display: 'flex',
    alignItems: 'center',
    marginVertical: 30,
  },
  tempText: {
    color: LIGHT,
    fontSize: 60,
    alignSelf: 'center',
  },
  tempModeText: {
    color: LIGHT05,
  },
  weatherState: {
    color: LIGHT05,
    fontSize: 16,
    alignSelf: 'center',
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: 2,
  },
  otherData: {
    flex: 0.8,
    flexDirection: 'row',
    width: width - 30,
    alignSelf: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
    borderRadius: 30,
  },
});
