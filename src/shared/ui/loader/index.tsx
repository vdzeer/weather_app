import React from 'react';
import { View } from 'react-native';
import LottieView from 'lottie-react-native';

import { styles } from './styles.module';

import loader from '../../../../assets/animations/Loading.json';

export const Loading = () => {
  return (
    <View style={styles.main}>
      <LottieView autoPlay loop source={loader} style={styles.lottie} />
    </View>
  );
};
