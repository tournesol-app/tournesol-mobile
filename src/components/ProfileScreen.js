import * as React from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { Avatar, Badge, Button, Divider, Icon, Text } from 'react-native-elements';

import { AuthContext } from '../AuthContext';
import theme from '../theme';

export default class ProfileScreen extends React.Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      profile: null,
    };
  }

  async signOut() {
    this.context.signOut();
    this.props.navigation.navigate('Home');
  }

  async loadProfile() {
    const response = await this.context.getClient().myProfile();
    if (response.ok) {
      response.json().then(data => {
        if (data.count == 1) this.setState({profile: data.results[0]});
      });
    } else if (response.status === 403) {
      this.signOut();
    } else {
      console.error("An error occurred!")
    }
  }

  componentDidMount() {
    this.loadProfile();
  }
  componentDidUpdate() {
    if (this.state.profile && this.state.profile.username != this.context.state.username) {
      this.loadProfile();
    }
  }

  render() {
    return (this.state.profile == null)
        ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Loading...</Text>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        : <View>
            <Text h4><Icon name="person" /> {this.state.profile.username}</Text>
            <Divider style={{ backgroundColor: 'black', marginBottom: 10 }} />
            <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
              {this.state.profile.avatar && <Avatar
                rounded
                size="medium"
                source={this.state.profile.avatar && { uri: this.state.profile.avatar }}
                icon={{name: 'person'}}
              />}
              <Text h4 style={{marginLeft: 25}}>{this.state.profile.first_name} {this.state.profile.last_name}</Text>
            </View>
            <View>
              {this.state.profile.title && <Text style={{fontWeight: 'bold'}}>{this.state.profile.title}</Text>}
              {this.state.profile.bio && <Text style={{marginLeft: 25, fontStyle: 'italic'}}>{this.state.profile.bio}</Text>}
              <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                {[
                  {label: "Ratings", count: this.state.profile.n_ratings},
                  {label: "Videos", count: this.state.profile.n_videos},
                  {label: "Comments", count: this.state.profile.n_comments},
                  {label: "Likes", count: this.state.profile.n_likes},
                ].map(({label, count}) => <Text key={label} style={{padding: 3}}>{label} <Badge value={count} /></Text>)}
              </View>
            </View>
            <Pressable style={{flexDirection: "row", marginTop: 20}} onPress={() => this.props.navigation.navigate('RateLater')}>
              <Icon name="watch-later" color={theme.colors.primary} />
              <Text>My rate later list</Text>
            </Pressable>
            <View style={{ alignSelf: 'center', padding: 20 }}>
              <Button title="Log Out" onPress={() => this.signOut()} />
            </View>
          </View>
  }
}
