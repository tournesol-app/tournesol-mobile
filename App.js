import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { AuthContext } from './src/AuthContext';
import { HomeScreen, LoginScreen, ProfileScreen, RateScreen, SearchScreen } from './src/components';
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
          <Tab.Screen name="Login" component={LoginScreen} />
        </Tab.Navigator>
      </AuthContext.Provider>
    </NavigationContainer>
  );
}
