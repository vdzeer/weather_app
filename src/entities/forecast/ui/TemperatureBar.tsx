import React, { useId } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Rect,
  Stop,
} from 'react-native-svg';

import { colors } from '@shared/theme/colors';
import { temperatureColor } from '@shared/theme/temperatureColor';

type Props = {
  min: number;
  max: number;
  // The range of the whole forecast, so bars line up across days.
  rangeMin: number;
  rangeMax: number;
  current?: number;
};

const HEIGHT = 12;
const BAR = 5;

const pct = (value: number) => `${Math.min(100, Math.max(0, value * 100))}%`;

export const TemperatureBar = ({
  min,
  max,
  rangeMin,
  rangeMax,
  current,
}: Props) => {
  const id = `t${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const span = Math.max(1, rangeMax - rangeMin);
  const start = (min - rangeMin) / span;
  const width = Math.max(0.04, (max - min) / span);
  const y = (HEIGHT - BAR) / 2;

  return (
    <View
      style={styles.container}
      importantForAccessibility="no-hide-descendants">
      <Svg width="100%" height={HEIGHT}>
        <Defs>
          <LinearGradient id={id} x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor={temperatureColor(min)} />
            <Stop offset="1" stopColor={temperatureColor(max)} />
          </LinearGradient>
        </Defs>
        <Rect
          x="0"
          y={y}
          width="100%"
          height={BAR}
          rx={BAR / 2}
          fill={colors.control}
        />
        <Rect
          x={pct(start)}
          y={y}
          width={pct(width)}
          height={BAR}
          rx={BAR / 2}
          fill={`url(#${id})`}
        />
        {current !== undefined ? (
          <Circle
            cx={pct((current - rangeMin) / span)}
            cy={HEIGHT / 2}
            r={4}
            fill={colors.text}
            stroke="rgba(0,0,0,0.25)"
            strokeWidth={1.5}
          />
        ) : null}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', marginHorizontal: 10 },
});
