import * as React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { IntroScreen, ProfileScreen, RateScreen, SearchScreen } from '.';
import { Icon } from 'react-native-elements';
import { AuthContext } from '../AuthContext';
import theme from '../theme';

const Tab = createBottomTabNavigator();

export default function HomeTabs() {
  return (
    <AuthContext.Consumer>
    { auth =>
      <Tab.Navigator
        tabBarOptions={{
          activeTintColor: theme.colors.secondary,
          inactiveTintColor: theme.colors.grey1,
          style: { backgroundColor: theme.colors.primary},
        }}
        initialRouteName="Home"
      >
      {
      [
        {name: "Home", icon: "home", component: IntroScreen},
        {name: "Videos", icon: "search", component: SearchScreen, authRequired: true},
        {name: "Rate", icon: "functions", component: RateScreen, authRequired: true},
        {name: "Profile", icon: "person", component: ProfileScreen, authRequired: true},
      ].filter(({authRequired}) => auth.state.token || !authRequired)
      .map(({name, icon, component}) =>
        <Tab.Screen key={name} name={name} component={component} options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name={icon} color={color} size={size} />
          ),
        }} />
      )
      }
      </Tab.Navigator>
    }
    </AuthContext.Consumer>
  );
}
