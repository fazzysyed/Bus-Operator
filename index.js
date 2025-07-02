/**
 * @format
 */
import {AppRegistry, Alert} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';

import React from 'react';
import store from './src/store';




function HeadlessCheck({isHeadless}) {
  if (isHeadless) {
    return <Root />;
  }

  return <Root />;
}

const Root = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

AppRegistry.registerComponent(appName, () => HeadlessCheck);
