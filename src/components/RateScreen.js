import * as React from 'react';
import { ImageBackground, Linking, ScrollView, View } from 'react-native';
import { Button, Divider, Icon, Overlay, Slider, Text } from 'react-native-elements';

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

class CriteriaSlider extends React.Component {
  tips = {
    similar: <Text>Videos are similar</Text>,
    better: (side) => <Text>{side} video is better</Text>,
    much_better: (side) => <Text>{side} video is a lot better</Text>,
  }
  constructor(props) {
    super(props);
    this.state = {
      score: 0.5
    };
  }
  getHelpText(score) {
    for (const video of [
      {
        side: "Left",
        score: score,
      },
      {
        side: "Right",
        score: 1 - score
      }
    ]) {
      if (video.score < 0.25)
        return this.tips.much_better(video.side);
      else if (video.score < 0.4)
        return this.tips.better(video.side);
    }
    return this.tips.similar;
  }
  render() {
    return (
      <View style={{ width: '90%', alignSelf: 'center' }}>
        <Text style={{textAlign: 'center'}}>
          <Text style={{ fontWeight: 'bold' }}>{this.props.criteria}: </Text>
          {this.getHelpText(this.state.score)}
        </Text>
        <Slider value={this.state.score} onValueChange={(v) => this.setState({score: v})} />
      </View>
    )
  }
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
      showHelp: false
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
            <Overlay isVisible={this.state.showHelp} onBackdropPress={() => this.setState({showHelp: false})}>
              <Text>For each criteria, move the cursor on the left or the right side of the screen if you think that the corresponding video is doing better.</Text>
            </Overlay>
            <Icon name='help-outline' onPress={() => this.setState({showHelp: !this.state.showHelp})} />
          </Text>
          {this.criteria.map((c) => <CriteriaSlider key={c} criteria={c}/>)}
          <View style={{ alignSelf: 'center', padding: 20 }}>
            <Button title="Submit rating" />
          </View>
        </View>
      </ScrollView>
    );
  }
}
