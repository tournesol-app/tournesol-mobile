import React, { useState } from 'react';
import { FlatList, Text, TextInput, View } from 'react-native';
import YouTube from 'react-native-youtube';

import { AuthContext } from '../AuthContext';

export default class SearchScreen extends React.Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.state = {
      result: null
    };
  }

  async search(q) {
    const response = await this.context.getClient().search(q);
    this.setState({result: response});
  }

  render() {
    return (
      <View>
        <TextInput
          placeholder="Search on Tournesol"
          onSubmitEditing={(e) => this.search(e.nativeEvent.text)}
        />
        { (this.state.result != null) ?
        <FlatList
          data={this.state.result.results}
          renderItem={
            ({item}) =>
            <View
              style={{
                flexDirection: "row",
                height: 100,
                padding: 20
              }}
            >
              <YouTube
                videoId={item.video_id}
                apiKey="AIzaSyBYLuyZhqUXsAwdmaBBSHhfV6t9AuM2fgY"
                play={false} // control playback of video with true/false
                fullscreen={false} // control whether the video should play in fullscreen or inline
                loop={false} // control whether the video should loop when ended
                style={{ flex: 0.4 }}
              />
              <Text style={{flex: 0.6}}>
                <Text style={{flexWrap: 'wrap'}}>{item.name}{"\n"}</Text>
                <Text>Score : {item.score.toFixed(0)}</Text>
              </Text>
            </View>
          }
          keyExtractor={item => item.id.toString()}
        />
        :
          <Text>Veuillez saisir votre recherche.</Text>
        }
      </View>
    )
  }
}
