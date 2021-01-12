import * as React from 'react';
import { Button, TextInput, View } from 'react-native';

import { AuthContext } from '../AuthContext';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  return (
    <AuthContext.Consumer>{ auth =>
      <View>
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <View style={{margin:7}}>
          <Button title="Sign in" onPress={() => {
            auth.signIn(username, password);
            navigation.navigate('Home');
          }} />
        </View>
      </View>
    }
    </AuthContext.Consumer>
  );
}
