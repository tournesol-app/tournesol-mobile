import * as React from 'react';
import { ImageBackground, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Divider, Icon, Slider, Text } from 'react-native-elements';

function RatedVideo({video_id, title}) {
  return (
  <View style={{flex: 0.5, paddingHorizontal: 10}}>
    <ImageBackground
      resizeMode='contain'
      source={{uri: `https://img.youtube.com/vi/${video_id}/mqdefault.jpg`}}
      style={{ width: '100%', height: 150, justifyContent: "center" }}
    >
      <Icon name='play-circle-outline' size={40}
            onPress={() => {Linking.openURL(`https://www.youtube.com/watch?v=${video_id}`)}} />
    </ImageBackground>
    <Text>{title}</Text>
  </View>)
}

export default class RateScreen extends React.Component {
  criteria = ['reliability', 'importance', 'engaging', 'pedagogy', 'layman_friendly', 'diversity_inclusion', 'backfire_risk'];
  constructor(props) {
    super(props);
    this.state = {
      video1: {
        video_id: 'HZGCoVF3YvM',
        title: "Ceci est une vidéo."
      },
      video2: {
        video_id: 'j05xm-8_wjc',
        title: "Et ceci en est une autre..."
      },
    };
  }
  render() {
    return (
      <ScrollView>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <RatedVideo {...this.state.video1} />
          <RatedVideo {...this.state.video2} />
        </View>
        <Divider style={{ backgroundColor: 'black', margin: 10 }} />
        <View>
          <Text h4>
            Compare those videos
          </Text>
          {this.criteria.map((c) =>
          <View key={c} style={{ width: '90%', alignSelf: 'center' }}>
            <Text style={{textAlign: 'center'}}>{c}</Text>
            <Slider value={0.5} />
          </View>
          )}
          <View style={{ alignSelf: 'center', padding: 20 }}>
            <Button title="Submit rating" />
          </View>
        </View>
      </ScrollView>
    );
  }
}
