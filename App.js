import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { AuthContext } from './src/AuthContext';
import { HomeScreen, ProfileScreen, RateScreen, SearchScreen } from './src/components';
import { APIClient } from './src/services';

const Tab = createBottomTabNavigator();

export default function App() {
  const [authState, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'SIGN_IN':
          return {
            ...prevState,
            token: action.token,
            username: action.username,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            token: null,
            username: null,
          };
        }
      },
      {
        token: null,
        username: null,
      }
  );
  
  const authContext = {
    state: authState,
    getClient: function() {
      return new APIClient(this.state.token, this.state.username);
    },
    signIn: async function (username, password) {
      // In a production app, we need to send some data (usually username, password) to server and get a token
      // We will also need to handle errors if sign in failed
      // After getting token, we need to persist the token using `AsyncStorage`
      // In the example, we'll use a dummy token
      const token = await this.getClient().authenticate(username, password);
      dispatch({ type: 'SIGN_IN', token: token, username: username, });
    },
    signOut: () => dispatch({ type: 'SIGN_OUT' }),
    signUp: async data => {
      // In a production app, we need to send user data to server and get a token
      // We will also need to handle errors if sign up failed
      // After getting token, we need to persist the token using `AsyncStorage`
      // In the example, we'll use a dummy token

      dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
    },
  }

  return (
    <NavigationContainer>
      <AuthContext.Provider value={authContext}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              return <Icon.Button
                name={{Home: "home", Profile: "person", Rate: "functions", Search: "search"}[route.name]}
                backgroundColor="transparent" color={color} size={size}
              />
            }
          })}
          tabBarOptions={{
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray',
            style: { backgroundColor: 'yellow'}
          }}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Search" component={SearchScreen} />
          <Tab.Screen name="Rate" component={RateScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
      </AuthContext.Provider>
    </NavigationContainer>
  );
}
