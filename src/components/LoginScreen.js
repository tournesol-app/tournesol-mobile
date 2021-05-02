import * as React from 'react';
import { Alert, View } from 'react-native';
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
    this.setState({errors});
    if (Object.keys(errors).length !== 0) {
      return;
    }
    this.context.signIn(this.state.username, this.state.password).then(authenticated => {
      if (authenticated) {
        this.props.navigation.navigate('Home');
      } else {
        Alert.alert("Error while authenticating", "Please check your login and password");
      }
    });
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
