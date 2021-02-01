import React from 'react';
import { ImageBackground, Linking, View } from 'react-native';
import { AuthContext } from '../../AuthContext';
import { Divider, Icon, Text } from 'react-native-elements';

export default class DetailsScreen extends React.Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.state = {
      video: null
    };
  }
  componentDidMount() {
    this.fetchVideo();
  }
  async fetchVideo() {
    const response = await this.context.getClient().fetchVideo(this.props.route.params.video_id);
    if (response != null) this.setState({video: response});
  }
  render() {
    return (
      <View>
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
            </View>
          : <Text>Aucune vidéo trouvée.</Text>
        }
      </View>
    )
  }
}
