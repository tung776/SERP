### 1. Gõ lệnh ###
```
react-native init ten_ung_dung
```
### 2. Xóa file .lock ###
### 3. Sửa file package.json ###
```
"scripts": {
		"start": "node node_modules/react-native/local-cli/cli.js start",
		"dev": "react-native-scripts start",
		"test": "jest"
	},
 "main": "./node_modules/react-native-scripts/build/bin/crna-entry.js",
"dependencies": {
		"react": "16.0.0-alpha.6",
		"react-native": "0.44.0",
		"expo": "^17.0.0"
	},
"devDependencies": {
		...
		"react-test-renderer": "16.0.0-alpha.6",
		"react-native-scripts": "0.0.31"
        ....
	},
```
### 4. Sửa file App.json ####
```
{
  "name": "auth",
  "displayName": "auth",
   "expo": {
    "sdkVersion": "17.0.0",
    "packagerOpts": {
      "assetExts": ["ttf"]
    }
  }
}
```
### 5. thêm file App.js ###
```
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

export default class auth extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.android.js
        </Text>
        <Text style={styles.instructions}>
          Double tap R on your keyboard to reload,{'\n'}
          Shake or press menu button for dev menu
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('auth', () => auth);

```
### 6. chay lệnh sau : ###
```
npm i
npm run dev
```

Debug react native như sau;
tải công cụ : react native debugger

chạy lệnh 
adb reverse tcp:19000 tcp:19000
adb reverse tcp:19001 tcp:19001

mở công cụ debug react native
bật chức năng remote js debugger trên nút menu điện thoại android