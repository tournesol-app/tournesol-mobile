import * as React from 'react';
import { View } from 'react-native';
import { Button, Input } from 'react-native-elements';

import { AuthContext } from '../AuthContext';

export default class LoginScreen extends React.Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      errors: {}
    };
  }

  signIn() {
    const errors = {};
    if (this.state.username.trim() === '') errors.username = "Please enter your username!";
    if (this.state.password.trim() === '') errors.password = "Please enter your password!";
    if (Object.keys(errors).length !== 0) {
      this.setState({errors});
      return;
    }
    this.context.signIn(this.state.username, this.state.password);
    this.props.navigation.navigate('Home');
  }

  render() {
    return (
      <View>
        <Input
          placeholder="Username"
          value={this.state.username}
          onChangeText={(username) => this.setState({username})}
          leftIcon={{ name: 'person' }}
          errorMessage={this.state.errors.username}
        />
        <Input
          placeholder="Password"
          value={this.state.password}
          onChangeText={(password) => this.setState({password})}
          leftIcon={{ name: 'lock' }}
          errorMessage={this.state.errors.password}
          secureTextEntry
        />
        <View style={{margin:7}}>
          <Button title="Sign in" onPress={this.signIn.bind(this)} />
        </View>
      </View>
    );
  }
}
