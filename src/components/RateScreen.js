import * as React from 'react';
import { ActivityIndicator, Alert, ImageBackground, Linking, ScrollView, View } from 'react-native';
import { Button, Divider, Icon, Overlay, Slider, Text } from 'react-native-elements';

import { AuthContext } from '../AuthContext';

function RatedVideo({video_id, name}) {
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
    <Text>{name}</Text>
  </View>)
}

class FeatureSlider extends React.Component {
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
      <View style={{ width: '90%', alignSelf: 'center', margin: 10 }}>
        <Text style={{textAlign: 'center'}}>
          <Text style={{ fontWeight: 'bold' }}>{this.props.description}: </Text>
          {this.getHelpText(this.state.score)}
        </Text>
        <Slider value={this.state.score} onValueChange={(v) => {
          this.props.onChange(v);
          this.setState({score: v});
        }} />
      </View>
    )
  }
}

export default class RateScreen extends React.Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.state = {
      showHelp: false
    }
  }

  async componentDidMount() {
    const constants = await this.context.getClient().fetchConstants();
    this.setState({
      constants: constants
    });
    this.reload();
    this.unsubscribe = this.props.navigation.addListener("focus", this.reload.bind(this));
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  async reload() {
    const video_id = this.props.route.params ? this.props.route.params.video_id : null;
    const video1 = await (video_id ? this.context.getClient().fetchVideo(video_id) : this.context.getClient().sampleVideo());
    const video2 = await this.context.getClient().sampleVideoWithOther(video1.video_id);
    this.setState({
      video1: video1,
      video2: video2,
      ratings: {},
      showHelp: false
    });
    console.log(`Comparing videos ${video1.video_id} and ${video2.video_id}`);
  }
  updateRatings(feature, score) {
    this.setState(prevState => {
      prevState.ratings[feature] = 100 * score;
      return prevState;
    });
  }
  async submitRatings() {
    const response = await this.context.getClient().rateVideos(this.state.video1, this.state.video2, this.state.ratings);
    console.log("Submitted rating", response);
    Alert.alert(
      "Rating submitted",
      "You will be redirected",
      [
        { text: "OK", onPress: () => this.props.navigation.navigate('Home', {screen: 'Home'}) }
      ],
      { cancelable: false }
    );
  }
  render() {
    return (
      <ScrollView>
        <View style={{flex: 1, flexDirection: 'row'}}>
          {(this.state.video1 == null) ? <ActivityIndicator /> : <RatedVideo {...this.state.video1} />}
          {(this.state.video2 == null) ? <ActivityIndicator /> : <RatedVideo {...this.state.video2} />}
        </View>
        <Divider style={{ backgroundColor: 'black', margin: 10 }} />
        <View>
          <Text h4>
            Compare those videos
            <Overlay isVisible={this.state.showHelp} onBackdropPress={() => this.setState({showHelp: false})}>
              <Text>For each feature, move the cursor on the left or the right side of the screen if you think that the corresponding video is doing better.</Text>
            </Overlay>
            <Icon name='help-outline' onPress={() => this.setState({showHelp: !this.state.showHelp})} />
          </Text>
          {this.state.video1 && this.state.video2 && this.state.constants && this.state.constants.features.map((f) =>
            <FeatureSlider key={`${f.feature}_${this.state.video1.video_id}_${this.state.video2.video_id}`} description={f.description} onChange={this.updateRatings.bind(this, f.feature)}/>)}
          <View style={{ alignSelf: 'center', padding: 20 }}>
            <Button title="Submit rating" onPress={this.submitRatings.bind(this)} />
          </View>
        </View>
      </ScrollView>
    );
  }
}
