/**
 * @format
 */

import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './src/components/app';
import {name as appName} from './app.json';
import React from 'react';

const Root = () => <App />;
AppRegistry.registerComponent(appName, () => Root);
