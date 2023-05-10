import React from 'react';
import { Dimensions, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

import { chartConfig } from 'shared/config';
import { styles } from './styles.module';

type DailyDataProps = {
  daysData: string[];
  tempData: number[];
};

const { width } = Dimensions.get('window');

export const DailyData = ({ daysData, tempData }: DailyDataProps) => {
  return (
    <View style={styles.main}>
      <LineChart
        data={{
          labels: daysData,
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
