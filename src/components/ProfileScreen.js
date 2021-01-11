import * as React from 'react';
import { Button, Text, View } from 'react-native';

import { AuthContext } from '../AuthContext';

export default function ProfileScreen() {
  return (
    <AuthContext.Consumer>
    {auth =>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Profile!</Text>
        <Button title="Log Out" onPress={() => auth.signOut()} />
      </View>
    }
    </AuthContext.Consumer>
  );
}
