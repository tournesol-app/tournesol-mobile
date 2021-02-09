import * as React from 'react';
import { NativeEventEmitter, NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { Header, Icon, Text, ThemeProvider } from 'react-native-elements';
import { createStackNavigator } from '@react-navigation/stack';

import { AuthContext } from './src/AuthContext';
import { APIClient } from './src/services';
import { DetailsScreen, LoginScreen } from './src/components';
import HomeTabs from './src/components/HomeTabs';
import theme from './src/theme';
import { navigationRef, isReadyRef, navigate } from './src/RootNavigation';

const RootStack = createStackNavigator();

export default function App(props) {
  React.useEffect(() => {
    return () => {
      isReadyRef.current = false
    };
  }, []);

  // Handle auth
  const [authState, authDispatch] = React.useReducer(
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
        authDispatch({ type: 'RESTORE_TOKEN', ...JSON.parse(userData) });
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
      authDispatch({ type: 'SIGN_IN', token: token, username: username, });
    },
    signOut: async () => {
      await AsyncStorage.removeItem('userData');
      authDispatch({ type: 'SIGN_OUT' });
    },
  }

  function extractVideoId(url) {
    const match = /https\:\/\/youtu\.be\/(.+)/g.exec(url);
    if (match) {
      console.log("Extracted video id", match[1]);
      return match[1];
    }
  }

  // Handle incoming YT share
  React.useEffect(
    () => {
      const eventEmitter = new NativeEventEmitter(NativeModules.ToastExample);
      eventListener = eventEmitter.addListener('importUrl', (event) => {
        const videoId = extractVideoId(event);
        if (videoId) {
          navigate('Details', {video_id: videoId});
        }
      });
      return function cleanup() {
        eventListener.remove();
      }
    },
    []
  );

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        isReadyRef.current = true;
      }}
      theme={theme}
      linking={{
        prefixes: ['tournesol://'],
        config: {
          screens: {
            Details: 'video/:video_id',
          },
        },
        getInitialURL() {
          if (props.importUrl) {
            const videoId = extractVideoId(props.importUrl)
            if (videoId) {
              return `tournesol://video/${videoId}`;
            }
          }
        },
      }}
    >
      <AuthContext.Provider value={authContext}>
        <ThemeProvider theme={theme}>
          <Header
            centerComponent={<Text h4>🌻 Tournesol</Text>}
            rightComponent={<Icon name='menu' onPress={() => authContext.signOut()} />}
            backgroundColor={theme.colors.primary}
            statusBarProps={{hidden: true}}
          />
          <RootStack.Navigator>
            <RootStack.Screen name="Home" component={HomeTabs} options={{headerShown: false}} />
            <RootStack.Screen name="Details" component={DetailsScreen} options={{headerTitle: "Details"}} />
            <RootStack.Screen name="Login" component={LoginScreen} options={{headerTitle: "Login"}} />
          </RootStack.Navigator>
        </ThemeProvider>
      </AuthContext.Provider>
    </NavigationContainer>
  );
}
