import { NAV_BACKGROUND_COLOR } from 'shared/constants/colors';

export const chartConfig = {
  backgroundColor: NAV_BACKGROUND_COLOR,
  backgroundGradientFrom: NAV_BACKGROUND_COLOR,
  backgroundGradientTo: NAV_BACKGROUND_COLOR,
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(230, 230, 230, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(230, 230, 230, ${opacity})`,
  style: {
    borderRadius: 25,
  },
  propsForDots: {
    r: '4',
    strokeWidth: '2',
    stroke: NAV_BACKGROUND_COLOR,
  },
};
