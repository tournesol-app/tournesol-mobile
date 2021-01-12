import * as React from 'react';
import { ActivityIndicator, Button, Image, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { AuthContext } from '../AuthContext';

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
    if (response.count == 1) {
      this.setState({profile: response.results[0]});
    }
  }

  componentDidMount() {
    this.loadProfile();
  }
  componentDidUpdate() {
    if (this.state.profile.username != this.context.state.username) {
      this.loadProfile();
    }
  }

  render() {
    return (this.state.profile == null)
        ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Loading...</Text>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        : <View>
            <View style={{
              borderBottomColor: 'black',
              borderBottomWidth: 1,
            }}>
              {
                (this.state.profile == null)
                  ? <Text>Loading...</Text>
                  : <Text><Icon name="person"></Icon> {this.state.profile.username}</Text>
              }
            </View>
            <View>
              {
                this.state.profile.avatar != null && <Image source={{uri: this.state.profile.avatar}} style={{resizeMode: "contain", width: 100, height: 100}}></Image>
              }
              <Text>{this.state.profile.first_name} {this.state.profile.last_name}</Text>
            </View>
            <View style={{ alignSelf: 'center', padding: 12 }}>
              <Button title="Log Out" onPress={() => this.signOut()} />
            </View>
          </View>
  }
}
