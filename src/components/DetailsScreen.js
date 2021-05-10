import React from 'react';
import { ActivityIndicator, ImageBackground, Linking, ScrollView, Switch, View } from 'react-native';
import * as Progress from 'react-native-progress';
import { Button, Divider, Icon, Text } from 'react-native-elements';
import { AuthContext } from '../AuthContext';
import theme from '../theme';
import { Pressable } from 'react-native';

export default class DetailsScreen extends React.Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }
  async componentDidMount() {
    this.fetchConstants();
    this.fetchStatistics();
    this.fetchVideo();
  }
  async componentDidUpdate(prevProps) {
    if (this.props.route.params.video_id !== prevProps.route.params.video_id) {
      this.fetchVideo();
    }
  }
  async fetchConstants() {
    const response = await this.context.getClient().fetchConstants();
    response.json().then(constants => this.setState({constants}))
  }
  async fetchVideo() {
    this.setState({loading: true});
    let response = await this.context.getClient().fetchVideo(this.props.route.params.video_id);
    const data = await response.json();
    let video;
    if (data.count == 1) video = data.results[0];
    else if (data.count == 0) {
      const response2 = await this.context.getClient().createVideo(this.props.route.params.video_id);
      if (response2.ok) video = await response2.json();
    }
    if (!video) {
      console.error("Could not retrieve video!");
      this.props.navigation.navigate('Home');
      return;
    }
    this.setState({video: video, loading: false, rateLater: false});
    this.fetchRatingPrivacy();
  }
  async fetchStatistics() {
    const response = await this.context.getClient().fetchStatistics();
    response.json().then(data => this.setState({stats: data}));
  }
  async fetchRatingPrivacy() {
    const response = await this.context.getClient().getRatingPrivacy(this.state.video.video_id);
    response.json().then(data => {
      this.setState({isPublic: !data.my_ratings_are_private});
      console.log(data);
    });
  }
  async setRatingPrivacy(isPublic) {
    const response = await this.context.getClient().setRatingPrivacy(this.state.video.video_id, isPublic);
    response.json().then(data => this.setState({isPublic}));
  }
  async addToRateLater() {
    const response = await this.context.getClient().addToRateLater(this.state.video.video_id);
    response.json().then(() => {
      this.setState({rateLater: true})
      console.log("Video added to rate-later list!")
    });
  }

  percentScore(feature) {
    const minScore = this.state.stats.min_score || 0;
    return (this.state.video[feature] - minScore) / (this.state.stats.max_score - minScore);
  }

  render() {
    return (
      <ScrollView>
        {(this.state.video)
          ? <View>
              <Text h4>{this.state.video.name}</Text>
              <Divider style={{ backgroundColor: 'black', marginBottom: 10 }} />
              <View style={{alignSelf: 'center'}}>
                <ImageBackground
                  resizeMode='contain'
                  source={{uri: `https://img.youtube.com/vi/${this.state.video.video_id}/mqdefault.jpg`}}
                  style={{ width: 300, height: 200, alignItems: "center", justifyContent: "center" }}
                >
                  <Icon name='play-circle-outline' size={40}
                        onPress={() => {Linking.openURL(`https://www.youtube.com/watch?v=${this.state.video.video_id}`)}} />
                </ImageBackground>
              </View>
              <Text h4>Ratings</Text>
              <View>
                <View style={{flex: 1, flexDirection: 'row', alignSelf: 'center', padding: 20}}>
                  <Button title="Rate"
                    icon={<Icon name="functions" color={theme.colors.secondary} />}
                    onPress={() => {
                      this.props.navigation.navigate('RateVideo', {video_id: this.state.video.video_id});
                    }}
                  />
                  { this.state.rateLater ?
                  <View style={{marginLeft: 15}}>
                    <Icon name="watch-later" color="green" />
                    <Text>Added!</Text>
                  </View> :
                  <Pressable style={{marginLeft: 15}} onPress={() => this.addToRateLater()}>
                    <Icon name="watch-later" color={theme.colors.primary} />
                    <Text>Rate later</Text>
                  </Pressable>
                  }
                </View>
                <View style={{alignSelf: "center"}}>
                  <Text>This video is rated {this.state.isPublic ? "publicly" : "privately"}.</Text>
                  <Switch value={this.state.isPublic} onValueChange={this.setRatingPrivacy.bind(this)} />
                </View>
                {(this.state.constants && this.state.video && this.state.stats) ? this.state.constants.features.map((f) =>
                  <View key={`${f.feature}_${this.state.video.video_id}`} style={{padding: 10}}>
                    <Text>{f.description}</Text>
                    <Progress.Bar progress={this.percentScore(f.feature)} width={250} color={theme.colors.primary} borderColor={theme.colors.grey0} />
                  </View>
                ) : <ActivityIndicator color={theme.colors.primary}/>}
              </View>
            </View>
          : (this.state.loading && <View><ActivityIndicator color={theme.colors.primary} size='large'/></View> ||
            <View>
              <Text>No video found (id: {this.props.route.params.video_id}).</Text>
              <Button title="Home"
                onPress={() => {
                  this.props.navigation.navigate('Home');
                }}
              />
            </View>)
        }
      </ScrollView>
    )
  }
}
