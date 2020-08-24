import React, {Component} from 'react';
import {WebView} from 'react-native-webview';
import {BASE_URL, PAYMENT_URL} from '../constants';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import {StyleSheet, View, Text, Button, TouchableOpacity} from 'react-native';
import {BACKGROUND_COLOR, CONTENT_COLOR, FONT_FAMILY, FONT_SIZE} from '../theme';

class YandexKassa extends Component {
  handleWebViewNavigationStateChange = (newNavState) => {
    if (newNavState.url === 'https://freelancescanner.com/blank/') {
      this.setState({payment_process: false});
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      token: '',
      username: '',
      url: '',
      payment_process: false,
    };
  }

  getPaymentUrl() {
    this.setState({payment_process: true});
    axios
      .post(PAYMENT_URL, {}, {headers: {Authorization: this.state.token}})
      .then(({data: {confirmation_url}}) => {
        this.setState({url: confirmation_url});
      })
      .catch((e) => {
        console.log(e);
      });
  }

  componentDidMount() {
    AsyncStorage.multiGet(['userToken', 'username']).then(([[[], token], [[], username]]) => {
      this.setState({token, username});
    });
  }

  render() {
    const {payment_process, url} = this.state;
    return (
      <View style={{flex: 1}}>
        {payment_process ? (
          <WebView
            source={{uri: url}}
            onNavigationStateChange={(newNavState) => this.handleWebViewNavigationStateChange(newNavState)}
          />
        ) : (
          <View style={styles.container}>
            <Text style={styles.text}>Subscribe for one month!</Text>
            <TouchableOpacity style={styles.buttonContainer} activeOpacity={0.5} onPress={() => this.getPaymentUrl()}>
              <Text style={styles.buttonText}>Pay</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BACKGROUND_COLOR,
  },
  text: {
    color: CONTENT_COLOR,
    fontFamily: FONT_FAMILY,
    fontSize: FONT_SIZE + 5,
    marginBottom: 30,
  },
  buttonText: {
    color: BACKGROUND_COLOR,
    fontFamily: FONT_FAMILY,
    fontSize: FONT_SIZE + 5,
  },
  buttonContainer: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
    backgroundColor: CONTENT_COLOR,
  },
});

export default YandexKassa;
