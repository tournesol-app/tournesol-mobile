import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { default as HomeScreen } from './HomeScreen';
import { default as LoginScreen } from './LoginScreen';

const HomeStack = createStackNavigator();

export default function HomeStackScreen() {
  return (
    <HomeStack.Navigator headerMode="none">
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="Login" component={LoginScreen} />
    </HomeStack.Navigator>
  );
}
