import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Svg, {Circle, Rect, Path} from 'react-native-svg';

const BackgroundCurve = ({style}) => {
  return (
    <View style={style}>
      <View style={styles.viewAbove} />
      <Svg height="100%" width="100%" style={styles.svg} viewBox="0 0 1440 160">
        <Path
          fill="#FB7200"
          d="M0,96L48,90.7C96,85,192,75,288,96C384,117,480,171,576,197.3C672,224,768,224,864,218.7C960,213,1056,203,1152,192C1248,181,1344,171,1392,165.3L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
        />
      </Svg>
    </View>
  );
};

export default BackgroundCurve;

const styles = StyleSheet.create({
  viewAbove: {
    backgroundColor: '#FB7200',
    height: 80,
  },
  svg: {
    position: 'absolute',
    top: 40,
  },
});