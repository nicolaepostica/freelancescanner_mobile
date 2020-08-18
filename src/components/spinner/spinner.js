import React from 'react';
import {View, ActivityIndicator, StyleSheet, StatusBar} from 'react-native';
import {BACKGROUND_COLOR, CONTENT_COLOR} from '../theme';

const Spinner = () => {
  return (
    <View style={styles.row}>
      <ActivityIndicator size="large" color={CONTENT_COLOR} />
    </View>
  );
};

const Loader = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={CONTENT_COLOR} />
      <StatusBar barStyle="default" />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    backgroundColor: BACKGROUND_COLOR,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BACKGROUND_COLOR,
  },
});

export default Spinner;
export {Loader};
