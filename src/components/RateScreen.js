import * as React from 'react';
import { ActivityIndicator, ImageBackground, Linking, ScrollView, View } from 'react-native';
import { Button, Divider, Icon, Slider, Text } from 'react-native-elements';
import { AuthContext } from '../AuthContext';
import theme from '../theme';
import { navigate } from '../RootNavigation';

function RatedVideo({video_id, name, reload}) {
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
    <View style={{flexDirection: 'row'}}>
      <Icon name='refresh' size={30} onPress={() => reload()} />
      <Icon name='info' size={30} onPress={() => navigate('Details', { video_id })} />
    </View>
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
        }} {...this.props} />
      </View>
    )
  }
}

export default class RateScreen extends React.Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.state = {}
  }

  async componentDidMount() {
    this.loadConstants();
    this.loadPreferences();
    this.loadVideos();
  }
  async componentDidUpdate(prevProps) {
    const videoId = this.props.route.params ? this.props.route.params.video_id : null;
    const prevVideoId = prevProps.route.params ? prevProps.route.params.video_id : null;
    if (videoId !== prevVideoId) {
      this.loadVideos();
    }
  }
  async loadConstants() {
    const response = await this.context.getClient().fetchConstants();
    response.json().then(constants => this.setState({ constants }));
  }
  async loadPreferences() {
    const response = await this.context.getClient().userPreferences();
    response.json().then(preferences => this.setState({ preferences }));
  }
  async loadVideos() {
    const video_id = this.props.route.params ? this.props.route.params.video_id : null;
    // Fetch left video
    let video1;
    if (video_id) {
      const data = await this.context.getClient().fetchVideo(video_id).then(res => res.json());
      video1 = data.results[0];
    } else {
      video1 = await this.context.getClient().sampleVideo().then(res => res.json());
    }
    // Video to be rated against
    const response2 = await this.context.getClient().sampleVideoWithOther(video1.video_id);
    const video2 = await response2.json();
    this.setState({
      video1: video1,
      video2: video2,
      ratings: {},
      submitted: false
    });
    console.log(`Comparing videos ${video1.video_id} and ${video2.video_id}`);
  }
  async reloadLeft() {
    await this.context.getClient()
            .sampleVideoWithOther(this.state.video2.video_id)
            .then(res => res.json())
            .then(video1 => this.setState({video1, submitted: false}));
  }
  async reloadRight() {
    await this.context.getClient()
            .sampleVideoWithOther(this.state.video1.video_id)
            .then(res => res.json())
            .then(video2 => this.setState({video2, submitted: false}));
  }

  updateRatings(feature, score) {
    this.setState(prevState => {
      prevState.ratings[feature] = 100 * score;
      return prevState;
    });
  }
  async submitRatings() {
    const response = await this.context.getClient().rateVideos(this.state.video1, this.state.video2, this.state.ratings);
    console.log("Submitted rating");
    this.setState({submitted: true});
  }
  render() {
    return (
      <ScrollView>
        <View style={{flex: 1, flexDirection: 'row'}}>
          {(this.state.video1 == null) ? <ActivityIndicator color={theme.colors.primary} /> : <RatedVideo {...this.state.video1} reload={() => this.reloadLeft()} />}
          {(this.state.video2 == null) ? <ActivityIndicator color={theme.colors.primary} /> : <RatedVideo {...this.state.video2} reload={() => this.reloadRight()} />}
        </View>
        <Divider style={{ backgroundColor: 'black', margin: 10 }} />
        <View>
          {this.state.submitted ?
            <Text h4 style={{color: "green", alignSelf: "center"}}>Rating submitted!</Text>
              :
            <Text h4 style={{alignSelf: "center"}}>
              Compare those videos
              <Icon name='help-outline' onPress={() => Linking.openURL('https://wiki.tournesol.app/index.php/Quality_criteria')} />
            </Text>
          }
          {this.state.video1 && this.state.video2 && this.state.constants && this.state.preferences && this.state.constants.features && this.state.constants.features.filter((f) => this.state.preferences[`${f.feature}_enabled`]).map((f) =>
            <FeatureSlider key={`${f.feature}_${this.state.video1.video_id}_${this.state.video2.video_id}`} description={f.description} onChange={this.updateRatings.bind(this, f.feature)} disabled={this.state.submitted} />)}
          <View style={{ alignSelf: 'center', padding: 20 }}>
            <Button title="Submit rating" onPress={this.submitRatings.bind(this)} disabled={this.state.submitted} />
          </View>
        </View>
      </ScrollView>
    );
  }
}
