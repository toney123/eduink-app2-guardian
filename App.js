import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,AsyncStorage} from 'react-native';
import {createStackNavigator,createAppContainer,createSwitchNavigator } from 'react-navigation';
import StartPage from './js/page/start-page';
import BottomTabBar from './js/module/global/component/bottom-tab-bar';
import LoginPage from './js/page/login-page';
import ForgetPasswordPage from './js/page/forget-password-page';
import OneSignal from 'react-native-onesignal';


// StackNavigator，允许返回
const MainStack = createStackNavigator({
  Main: {
    screen: BottomTabBar,
    navigationOptions:()=>({
      header:null
    })
  },
});

// SwitchNavigator单页，忽略返回
const AppContainer = createAppContainer(createSwitchNavigator({
  Login:{
    screen:LoginPage,
  },
  Start: {
    screen:StartPage,
  },
  ForgetPassword:{
    screen:ForgetPasswordPage
  },
  Main:{
    screen:MainStack
  },
},
  {
  initialRouteName:'Start'
}));


export default class App extends Component{
  constructor(properties) {
    super(properties);
    OneSignal.init("6ec02f76-2d4f-4fb3-9ae4-866b7e2e89ad");

    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onIds);
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('ids', this.onIds);
  }

  onReceived(notification) {
    console.log("Notification received: ", notification);
  }

  onOpened(openResult) {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
  }

  onIds(device) {
    console.log('Device info: ', device);
  }

  render(){
    return(
      <AppContainer/>
    );
  }
}



