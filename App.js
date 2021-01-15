import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Header, Icon, Text } from 'react-native-elements';

import { AuthContext } from './src/AuthContext';
import { HomeScreen, LoginScreen, ProfileScreen, RateScreen, SearchScreen } from './src/components';
import { APIClient } from './src/services';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator headerMode="none">
      <HomeStack.Screen id="home" name="Home" component={HomeScreen} />
      <HomeStack.Screen id="login" name="Login" component={LoginScreen} />
    </HomeStack.Navigator>
  );
}

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

  return (
    <NavigationContainer>
      <AuthContext.Provider value={authContext}>
        <Header
          centerComponent={<Text h4>🌻 Tournesol</Text>}
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
              {name: "Home", icon: "home", component: HomeStackScreen},
              {name: "Search", icon: "search", component: SearchScreen, authRequired: true},
              {name: "Rate", icon: "functions", component: RateScreen, authRequired: true},
              {name: "Profile", icon: "person", component: ProfileScreen, authRequired: true},
            ].map(({name, icon, component, authRequired = false}) =>
            <Tab.Screen id={name} name={name} component={(authRequired && !authState.token) ? LoginScreen : component} options={{
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
