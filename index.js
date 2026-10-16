/**
 * @format
 */

import { AppRegistry } from 'react-native';
import BackgroundFetch from 'react-native-background-fetch';

import { App } from './src/app/App';
import { headlessTask } from './src/app/background';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
BackgroundFetch.registerHeadlessTask(headlessTask);
