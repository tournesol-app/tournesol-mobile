import React from 'react';
import { FlatList, Linking, Pressable, View } from 'react-native';
import { AuthContext } from '../AuthContext';
import { Avatar, ListItem } from 'react-native-elements';
import { ActivityIndicator } from 'react-native';

export default class RateLaterScreen extends React.Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.state = {
      result: null
    };
  }

  async componentDidMount() {
    this.load();
    this.unsubscribe = this.props.navigation.addListener("focus", this.load.bind(this));
  }
  componentWillUnmount() {
    this.unsubscribe();
  }

  async load() {
    const response = await this.context.getClient().fetchRateLater();
    if (!response.ok) {
      console.error("Error while loading rate later, please try again!");
      return;
    }
    response.json().then(data => this.setState({result: data}));
  }

  render() {
    return (
      <View>
        { (this.state.result != null) ?
        <FlatList
          data={this.state.result.results.map((rl) => rl.video_info)}
          renderItem={
            ({item}) =>
            <ListItem bottomDivider>
              <Avatar
                source={{uri: `https://img.youtube.com/vi/${item.video_id}/default.jpg`}}
                size='medium' icon={{name: 'play-circle-filled'}}
                onPress={() => {Linking.openURL(`https://www.youtube.com/watch?v=${item.video_id}`)}}
              />
              <ListItem.Content>
                <Pressable onPress={() => this.props.navigation.navigate('Details', {video_id: item.video_id})}>
                  <ListItem.Title>{item.name}</ListItem.Title>
                  <ListItem.Subtitle>Score : {item.score.toFixed(0)}</ListItem.Subtitle>
                </Pressable>
              </ListItem.Content>
            </ListItem>
          }
          keyExtractor={item => item.id.toString()}
        />
        :
          <ActivityIndicator/>
        }
      </View>
    )
  }
}
