import React from 'react';
import { ActivityIndicator, Linking, Pressable, ScrollView, View } from 'react-native';
import { Avatar, Button, Icon, ListItem, SearchBar, Text } from 'react-native-elements';
import {Picker} from '@react-native-picker/picker';

import { AuthContext } from '../AuthContext';
import theme from '../theme';

export default class SearchScreen extends React.Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      filters: {},
    };
  }

  async componentDidMount() {
    this.search();
  }

  async search() {
    this.setState({loading: 'all'});
    const response = await this.context.getClient().searchVideos({search: this.state.query, ...this.state.filters});
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

  async setFilter(key, value) {
    this.setState(oldState => {
      return {
        filters: {
          ...oldState.filters,
          [key]: value
        }
      }
    },
    () => this.search());
  }

  render() {
    return (
      <ScrollView>
        <SearchBar
          lightTheme={true}
          clearIcon={false}
          placeholder="Search on Tournesol"
          onChangeText={(query) => this.setState({query})}
          onSubmitEditing={() => this.search()}
          value={this.state.query}
        />
        {
          (this.state.advanced) ?
          <View>
            <Picker
              selectedValue={this.state.filters.language}
              onValueChange={this.setFilter.bind(this, 'language')}>
              <Picker.Item label="Any Language" value={null} />
              <Picker.Item label="English" value="en" />
              <Picker.Item label="Français" value="fr" />
              <Picker.Item label="Deutsch" value="de" />
            </Picker>
            <Picker
              selectedValue={this.state.filters.days_ago_lte}
              onValueChange={this.setFilter.bind(this, 'days_ago_lte')}>
              <Picker.Item label="Any Date" value={null} />
              <Picker.Item label="Last month" value="30" />
              <Picker.Item label="Last year" value="365" />
            </Picker>
            <Icon name="keyboard-arrow-up" onPress={() => this.setState({advanced: false})} />
          </View>
          : <Icon name="keyboard-arrow-down" onPress={() => this.setState({advanced: true})} />
        }
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
