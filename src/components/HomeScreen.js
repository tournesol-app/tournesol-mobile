import * as React from 'react';
import { Button, Linking, Text, View } from 'react-native';

import YouTube from 'react-native-youtube';

export function HomeScreen({ navigation }) {
  return (
    <View>
      <Text style={{fontWeight: "bold", fontSize: 18, textAlign: "center", marginTop: 0, width: "100%", backgroundColor: "yellow"}}>🌻 Tournesol</Text>
      <YouTube
        videoId="1J7h3F-nKus"
        apiKey="AIzaSyBYLuyZhqUXsAwdmaBBSHhfV6t9AuM2fgY"
        play={false} // control playback of video with true/false
        fullscreen={false} // control whether the video should play in fullscreen or inline
        loop={false} // control whether the video should loop when ended
        style={{ marginTop: 10, alignSelf: "center", height: 300, width: "90%" }}
      />
      <Text>
        Tournesol elicits and exploits contributors' inputs to identify top quality contents.
        Learn more with our <Text style={{color: 'red'}} onPress={() => {Linking.openURL('https://bit.ly/tournesol-app')}}>White Paper</Text> 
        or <Text style={{color: 'red'}} onPress={() => {Linking.openURL('mailto:le-nguyen.hoang@science4all.org')}}>contact us</Text>.
      </Text>
      <Button title="Contribute" onPress={() => navigation.navigate('Rate')} />
      <Text>Our journey so far...</Text>
    </View>
  );
}
