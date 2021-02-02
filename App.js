import * as React from 'react';
import { Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Header, Icon, Text } from 'react-native-elements';

import { AuthContext } from './src/AuthContext';
import { HomeStack, LoginScreen, ProfileScreen, RateScreen, VideoStack } from './src/components';
import { APIClient } from './src/services';

const Tab = createBottomTabNavigator();

export default function App() {
  const [authState, dispatch] = React.useReducer(
    (prevState, action) => {
      console.log(action);
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
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            token: action.token,
            username: action.username,
          };
        }
      },
      {
        token: null,
        username: null,
      }
  );

  React.useEffect(() => {
    const bootstrapAsync = async () => {
      let userData;

      try {
        userData = await AsyncStorage.getItem('userData');
      } catch (e) {
        console.error("Error while fetching token from local data");
      }
      if (userData != null) {
        dispatch({ type: 'RESTORE_TOKEN', ...JSON.parse(userData) });
      }
    };

    bootstrapAsync();
  }, []);

  React.useEffect(() => {
    Linking.addEventListener('url', event => {
      console.warn('URL', event.url)
    })

    Linking.getInitialURL().then(url => {
        console.warn('INITIAL', url)
    })
  })

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
      await AsyncStorage.setItem('userData', JSON.stringify({token, username}));
      dispatch({ type: 'SIGN_IN', token: token, username: username, });
    },
    signOut: async () => {
      await AsyncStorage.removeItem('userData');
      dispatch({ type: 'SIGN_OUT' });
    },
  }

  const linking = {
    prefixes: ['tournesol://'],
    config: {
      screens: {
        Videos: {
          screens: {
            Details: 'video/:video_id',
          },
        },
      }
    }
  };

  return (
    <NavigationContainer linking={linking}>
      <AuthContext.Provider value={authContext}>
        <Header
          centerComponent={<Text h4>🌻 Tournesol</Text>}
          rightComponent={<Icon name='menu' onPress={() => authContext.signOut()} />}
          backgroundColor='yellow'
          statusBarProps={{hidden: true}}
        />
        <Tab.Navigator
          tabBarOptions={{
            activeTintColor: 'tomato',
            inactiveTintColor: '#666666',
            style: { backgroundColor: 'yellow'}
          }}
        >
          {
            [
              {name: "Default", icon: "home", component: HomeStack},
              {name: "Videos", icon: "search", component: VideoStack, authRequired: true},
              {name: "Rate", icon: "functions", component: RateScreen, authRequired: true},
              {name: "Profile", icon: "person", component: ProfileScreen, authRequired: true},
            ].map(({name, icon, component, authRequired = false}) =>
            <Tab.Screen key={name} name={name} component={(authRequired && !authState.token) ? LoginScreen : component} options={{
              tabBarIcon: ({ color, size }) => (
                <Icon name={icon} color={color} size={size} />
              ),
            }} />
          )}
        </Tab.Navigator>
      </AuthContext.Provider>
    </NavigationContainer>
  );
}
