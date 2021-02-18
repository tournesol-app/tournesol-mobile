import React from 'react';
import { ImageBackground, Linking, ScrollView, View } from 'react-native';
import * as Progress from 'react-native-progress';
import { Button, Divider, Icon, Text } from 'react-native-elements';
import { AuthContext } from '../AuthContext';
import theme from '../theme';

export default class DetailsScreen extends React.Component {
  criteria = ['reliability', 'importance', 'engaging', 'pedagogy', 'layman_friendly', 'diversity_inclusion', 'backfire_risk'];
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.state = {
      video: null,
      stats: null,
    };
  }
  componentDidMount() {
    this.fetchVideo();
    this.fetchStatistics();
  }
  async fetchVideo() {
    let response = await this.context.getClient().fetchVideo(this.props.route.params.video_id);
    if (response == null) response = await this.context.getClient().createVideo(this.props.route.params.video_id);
    this.setState({video: response});
  }
  async fetchStatistics() {
    const response = await this.context.getClient().fetchStatistics();
    if (response != null) this.setState({stats: response});
  }

  percentScore(criteria) {
    const minScore = this.state.stats.min_score || 0;
    return (this.state.video[criteria] - minScore) / (this.state.stats.max_score - minScore);
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
                <View style={{ alignSelf: 'center', padding: 20 }}>
                  <Button title="Rate"
                    icon={<Icon name="functions" color={theme.colors.secondary} />}
                    onPress={() => {
                      this.props.navigation.navigate('RateVideo', {video_id: this.state.video.video_id});
                    }}
                  />
                </View>
                {this.criteria.map((c) =>
                  <View key={c} style={{padding: 10}}>
                    <Text>{c}</Text>
                    { (this.state.stats != null)
                      ? <Progress.Bar progress={this.percentScore(c)} width={200} color={theme.colors.primary} borderColor={theme.colors.grey0} />
                      : <Text>{this.state.video[c]}</Text>
                    }
                  </View>
                )}
              </View>
              <Text h4>Comments</Text>
            </View>
          : <View>
              <Text>No video found (id: {this.props.route.params.video_id}).</Text>
              <Button title="Home"
                onPress={() => {
                  this.props.navigation.navigate('Home');
                }}
              />
            </View>
        }
      </ScrollView>
    )
  }
}
