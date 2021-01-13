import * as React from 'react';
import { Button, Linking, Text, View } from 'react-native';
import YouTube from 'react-native-youtube';
import Config from "react-native-config";

import { AuthContext } from '../AuthContext';

export default function HomeScreen({ navigation }) {
  return (
    <AuthContext.Consumer>
      {auth =>
      <View>
        <YouTube
          videoId="1J7h3F-nKus"
          apiKey={Config.YOUTUBE_API_KEY}
          play={false} // control playback of video with true/false
          fullscreen={false} // control whether the video should play in fullscreen or inline
          loop={false} // control whether the video should loop when ended
          style={{ marginTop: 10, alignSelf: "center", height: 300, width: "90%" }}
          resumePlayAndroid={false}
        />
        <Text>
          Tournesol elicits and exploits contributors' inputs to identify top quality contents.
          Learn more with our <Text style={{color: 'red'}} onPress={() => {Linking.openURL('https://bit.ly/tournesol-app')}}>White Paper</Text> 
          or <Text style={{color: 'red'}} onPress={() => {Linking.openURL('mailto:le-nguyen.hoang@science4all.org')}}>contact us</Text>.
        </Text>
        {
          (auth.state.token != null)
            ? <Button title="Contribute" onPress={() => navigation.navigate('Rate')} />  
            : <Button title="Log In / Sign Up" onPress={() => navigation.navigate('Login')} />
        }
        <Text>Pouet: {auth.state.token}</Text>
      </View>
      }
    </AuthContext.Consumer>
  );
}
