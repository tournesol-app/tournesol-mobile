import React from 'react';
import { FlatList, Linking, Pressable, View } from 'react-native';
import { AuthContext } from '../AuthContext';
import { Avatar, ListItem, Input, Text } from 'react-native-elements';

export default class SearchScreen extends React.Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.state = {
      result: null
    };
  }

  async search(q) {
    const response = await this.context.getClient().searchVideos({search: q});
    if (!response.ok) {
      console.error("Error while searching, please try again!");
      return;
    }
    response.json().then(data => this.setState({result: data}));
  }

  render() {
    return (
      <View>
        <Input
          placeholder="Search on Tournesol"
          onSubmitEditing={(e) => this.search(e.nativeEvent.text)}
          leftIcon={{ name: 'search', type: 'material' }}
        />
        { (this.state.result != null) ?
        <FlatList
          data={this.state.result.results}
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
          <Text>Veuillez saisir votre recherche.</Text>
        }
      </View>
    )
  }
}
