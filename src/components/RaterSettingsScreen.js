import React from 'react';
import { Linking, View } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { CheckBox, Icon, Slider, Text } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { AuthContext } from '../AuthContext';

export default class RaterSettingsScreen extends React.Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }

  async componentDidMount() {
    this.loadConstants();
    this.loadPreferences();
  }
  async loadConstants() {
    this.setState({loading: true});
    const response = await this.context.getClient().fetchConstants();
    response.json().then(constants => this.setState({ constants, loading: false }));
  }
  async loadPreferences() {
    this.setState({loading: true});
    const response = await this.context.getClient().userPreferences();
    response.json().then(preferences => this.setState({ preferences, loading: false }));
  }
  togglePreference(feature) {
    const preferences = this.state.preferences;
    preferences[`${feature}_enabled`] = !preferences[`${feature}_enabled`];
    this.setState({preferences, loading: true});
    this.save();
  }
  updateCriteria(feature, value) {
    const preferences = this.state.preferences;
    preferences[feature] = value * 100;
    this.setState({preferences, loading: true});
    this.save();
  }
  async save() {
    this.setState({loading: true});
    const response = await this.context.getClient().userPreferencesUpdate(this.state.preferences);
    response.json().then(preferences => this.setState({ preferences, loading: false }));
  }

  render() {
    return (
      <ScrollView>
        <Text h4 style={{alignSelf: "center"}}>
          Your quality criteria
          <Icon name='help-outline' onPress={() => Linking.openURL('https://wiki.tournesol.app/index.php/Quality_criteria')} />
        </Text>
        { (this.state.constants && this.state.preferences) && 
          <View>
          { this.state.constants.features.map((f) =>
            <View style={{ width: '90%', alignSelf: 'center', margin: 10 }}>
              <CheckBox
                title={f.description}
                checked={this.state.preferences[`${f.feature}_enabled`]}
                onPress={() => this.togglePreference(f.feature)}
                disabled={this.state.loading}
              />
              <Slider key={f.feature} onValueChange={(value) => this.updateCriteria(f.feature, value)} disabled={this.state.loading} value={this.state.preferences[f.feature] / 100} />
            </View>
          )}
          </View>
        }
        {this.state.loading && <ActivityIndicator/>}
      </ScrollView>
    )
  }
}
