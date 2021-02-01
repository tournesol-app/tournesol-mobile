import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { default as DetailsScreen } from './DetailsScreen';
import { default as SearchScreen } from './SearchScreen';

const VideoStack = createStackNavigator();

export default function VideoStackScreen() {
  return (
    <VideoStack.Navigator headerMode="screen" initialRouteName="Search">
      <VideoStack.Screen name="Search" component={SearchScreen} options={{headerShown: false}} />
      <VideoStack.Screen name="Details" component={DetailsScreen} options={{headerTitle: "Détails"}} />
    </VideoStack.Navigator>
  );
}
