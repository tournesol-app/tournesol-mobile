import React from 'react';
import { ActivityIndicator, Linking, Pressable, ScrollView } from 'react-native';
import { AuthContext } from '../AuthContext';
import { Avatar, ListItem, SearchBar, Text } from 'react-native-elements';
import theme from '../theme';

export default class SearchScreen extends React.Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      q: "",
    };
  }

  async componentDidMount() {
    this.search();
  }

  async search() {
    this.setState({loading: true});
    const response = await this.context.getClient().searchVideos({search: this.state.q});
    if (!response.ok) {
      console.error("Error while searching, please try again!");
      this.setState({loading: false});
      return;
    }
    const result = await response.json();
    this.setState({result, loading: false});
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
          value={this.state.q}
        />
        { this.state.loading ? <ActivityIndicator color={theme.colors.primary} size='large'/>
        : this.state.result ? this.state.result.results.map((item) =>
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
        )
        : <Text>Veuillez saisir votre recherche.</Text>
        }
      </ScrollView>
    )
  }
}
