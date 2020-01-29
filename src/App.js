import React from 'react';

import {
  SafeAreaView,
  StatusBar,
  StyleSheet
} from 'react-native';

import { Provider } from 'react-redux';
import store from './store';

import Locations from './components/locations';

export default App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Provider store={store}>
        <SafeAreaView style={styles.container}>
          <Locations />
        </SafeAreaView>
      </Provider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    top: StatusBar.currentHeight || 50
  }
});