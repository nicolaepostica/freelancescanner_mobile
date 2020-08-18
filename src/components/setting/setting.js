import React, {Component} from 'react';
import {View, Image, Switch, TouchableOpacity, StyleSheet, StatusBar} from 'react-native';
import {Text} from 'react-native-elements';
import 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import update from 'immutability-helper';
import {BASE_URL} from '../constants';
import {Loader} from '../spinner';
import {CONTENT_COLOR, HEADER_COLOR} from '../theme';

export default class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter_id: null,
      switchMute: false,
      switchSilent: false,
      muteColor: 'gray',
      silentColor: 'gray',
      token: '',
      filter: {},
      loading: true,
    };
  }
  componentDidMount() {
    this._initSettings();
  }

  _setSwitchSilent = (state) => {
    AsyncStorage.setItem('switchSilent', state.toString());
  };

  _initSettings = () => {
    AsyncStorage.multiGet(['userToken', 'filter_id', 'switchSilent']).then(
      ([[[], token], [[], filter_id], [[], switchSilent]]) => {
        const silentColor = switchSilent === 'true' ? CONTENT_COLOR : 'gray';
        switchSilent = switchSilent === 'true';
        console.log(switchSilent);
        this.setState({
          token,
          filter_id: Number(filter_id),
          silentColor,
          switchSilent,
        });
        this._getFilterUpdate();
      },
    );
  };

  _getFilterUpdate = () => {
    axios
      .get(`${BASE_URL}/api/v1/filter/${this.state.filter_id}/`, {
        headers: {Authorization: this.state.token},
      })
      .then(({data: filter}) => {
        const {enable_notification: switchMute} = filter;
        let muteColor = 'grey';
        if (switchMute) {
          muteColor = CONTENT_COLOR;
        }
        this.setState({switchMute, filter, muteColor, loading: false});
      });
  };

  onClickTopicSettings() {
    this.props.navigation.navigate('EditTopic');
  }

  onSwitchMute = (switchMute) => {
    let muteColor = 'grey';
    if (switchMute) {
      muteColor = 'dodgerblue';
    }
    this.setState(
      {
        switchMute,
        muteColor,
        filter: update(this.state.filter, {
          enable_notification: {$set: switchMute},
        }),
      },
      () => {
        axios.put(`${BASE_URL}/api/v1/filter/${this.state.filter_id}/`, this.state.filter, {
          headers: {Authorization: this.state.token},
        });
      },
    );
  };

  onSwitchSilent = (switchSilent) => {
    let silentColor = 'grey';
    if (switchSilent) {
      silentColor = CONTENT_COLOR;
    }
    this.setState({switchSilent, silentColor});
    this._setSwitchSilent(switchSilent);
  };

  render() {
    const {muteColor, switchMute, loading, silentColor, switchSilent} = this.state;
    return (
      <View style={styles.root}>
        <StatusBar backgroundColor={HEADER_COLOR} barStyle="light-content" />
        {loading ? (
          <Loader />
        ) : (
          <View style={styles.content}>
            <View style={styles.container}>
              <TouchableOpacity style={styles.touchable} onPress={() => this.onClickTopicSettings()}>
                <View style={styles.topic}>
                  <Image style={styles.image} source={require('../../resources/icons/freelancer.jpg')} />
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.notificationsView}>
              <View style={styles.descriptions}>
                <View>
                  <Text h4 style={{color: muteColor}}>
                    Notification
                  </Text>
                </View>
                <View>
                  <Switch
                    trackColor={{true: 'dodgerblue', false: 'grey'}}
                    thumbColor={'dodgerblue'}
                    onValueChange={this.onSwitchMute}
                    value={switchMute}
                  />
                </View>
              </View>
              <View style={styles.descriptions}>
                <View>
                  <Text h4 style={{color: silentColor}}>
                    Silent mode
                  </Text>
                </View>
                <View>
                  <Switch
                    trackColor={{true: 'dodgerblue', false: 'grey'}}
                    thumbColor={'dodgerblue'}
                    onValueChange={this.onSwitchSilent}
                    value={switchSilent}
                  />
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    color: 'dodgerblue',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  notificationsView: {
    backgroundColor: '#F5F5F5',
  },
  topic: {
    flexDirection: 'row',
    borderRadius: 5,
    backgroundColor: '#e1e1e1',
    justifyContent: 'space-between',
  },
  touchable: {
    margin: 5,
    borderRadius: 5,
    backgroundColor: '#e1e1e1',
  },
  descriptions: {
    margin: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  icon: {
    width: 30,
    height: 30,
  },
  image: {
    width: 90,
    height: 90,
  },
});
