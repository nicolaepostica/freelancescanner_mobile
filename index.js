/**
 * @format
 */

import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './src/components/app';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
import store from './src/store';
import {ServiceProvider} from './src/components/service-context';
import React from 'react';
import {ApiService} from './src/services/api-service';

const apiService = new ApiService();

const Root = () => (
  <Provider store={store}>
    <ServiceProvider value={apiService}>
      <App />
    </ServiceProvider>
  </Provider>
);
AppRegistry.registerComponent(appName, () => Root);
