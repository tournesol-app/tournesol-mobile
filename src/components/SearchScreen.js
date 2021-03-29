import React from 'react';
import { ActivityIndicator, Linking, Pressable, ScrollView } from 'react-native';
import { AuthContext } from '../AuthContext';
import { Avatar, Button, ListItem, SearchBar, Text } from 'react-native-elements';
import theme from '../theme';
import { View } from 'react-native';

export default class SearchScreen extends React.Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.state = {
      loading: null,
      query: "",
      next: null,
    };
  }

  async componentDidMount() {
    this.search();
  }

  async search() {
    this.setState({loading: 'all'});
    const response = await this.context.getClient().searchVideos({search: this.state.query});
    if (!response.ok) {
      console.error("Error while searching, please try again!");
      this.setState({loading: null});
      return;
    }
    const result = await response.json();
    this.setState({results: result.results, next: result.next, loading: null});
  }

  async loadMore() {
    this.setState({loading: 'partial'});
    const response = await this.context.getClient().searchVideos(null, this.state.next);
    if (!response.ok) {
      console.error("Error while loading, please try again!");
      this.setState({loading: null});
      return;
    }
    const result = await response.json();
    this.setState({results: this.state.results.concat(result.results), next: result.next, loading: null});
  }

  render() {
    return (
      <ScrollView>
        <SearchBar
          lightTheme={true}
          clearIcon={false}
          placeholder="Search on Tournesol"
          onChangeText={(q) => this.setState({q})}
          onSubmitEditing={() => this.search()}
          value={this.state.query}
        />
        { this.state.loading == 'all' ? <ActivityIndicator color={theme.colors.primary} size='large'/>
        : this.state.results ? <View>
        {this.state.results.map((item) =>
          <ListItem key={item.id.toString()} bottomDivider>
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
          )}
          {this.state.next && <Button title={(this.state.loading == 'partial') ? "Loading..." : "Load more..."} onPress={() => this.loadMore()} disabled={this.state.loading == 'partial'} />}
        </View>
        : <Text>Veuillez saisir votre recherche.</Text>
        }
      </ScrollView>
    )
  }
}
