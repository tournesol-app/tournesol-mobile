import * as React from 'react';
import { Linking, View } from 'react-native';
import Config from "react-native-config";
import { Button, Text, Tile } from 'react-native-elements';

import { AuthContext } from '../AuthContext';

export default function HomeScreen({ navigation }) {
  return (
    <AuthContext.Consumer>
      {auth =>
      <View>
        <View style={{justifyContent: 'center', flexDirection: 'row'}}>
          <Tile
            imageSrc={{uri: `https://img.youtube.com/vi/${Config.TOURNESOL_YOUTUBE_VIDEO_ID}/mqdefault.jpg`}}
            imageProps={{resizeMode: 'contain'}}
            icon={{ name: 'play-circle-filled', type: 'material', size: 45 }}
            onPress={() => {Linking.openURL(`https://www.youtube.com/watch?v=${Config.TOURNESOL_YOUTUBE_VIDEO_ID}`)}}
          />
        </View>
        <Text>
          Tournesol elicits and exploits contributors' inputs to identify top quality contents.
          Learn more with our <Text style={{color: 'red'}} onPress={() => {Linking.openURL('https://bit.ly/tournesol-app')}}>White Paper</Text> or
          &nbsp;<Text style={{color: 'red'}} onPress={() => {Linking.openURL('mailto:le-nguyen.hoang@science4all.org')}}>contact us</Text>.
        </Text>
        <View style={{ alignSelf: 'center', padding: 12 }}>
        {
          (auth.state.token != null)
            ? <Button title="Contribute" onPress={() => navigation.navigate('Rate')} />  
            : <Button title="Log In" onPress={() => navigation.navigate('Login')} />
        }
        </View>
        <Text>Bla bla...</Text>
      </View>
      }
    </AuthContext.Consumer>
  );
}
