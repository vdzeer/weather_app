import React from 'react';
import { Dimensions, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

import { chartConfig } from 'shared/config';
import { styles } from './styles.module';

type DailyDataProps = {
  dayData: string[];
  tempData: [];
};

const { width } = Dimensions.get('window');

export const DailyData = ({ dayData, tempData }: DailyDataProps) => {
  return (
    <View style={styles.main}>
      <LineChart
        data={{
          labels: dayData,
          datasets: [
            {
              data: tempData,
            },
          ],
        }}
        width={width - 40}
        height={115}
        withInnerLines={false}
        yAxisInterval={1}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
      />
    </View>
  );
};
