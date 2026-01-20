/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// Fabric + Concurrent Root 비활성화를 위해 래핑
const WrappedApp = props => {
  return <App {...props} fabric={false} concurrentRoot={false} />;
};

AppRegistry.registerComponent(appName, () => WrappedApp);
