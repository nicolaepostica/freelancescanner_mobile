import React, {Component} from 'react';
import {WebView} from 'react-native-webview';
import {GET_STATE_URL, PAYMENT_URL} from '../constants';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {BACKGROUND_COLOR, CONTENT_COLOR, FONT_FAMILY, FONT_SIZE} from '../theme';
import Spinner from '../spinner';

class YandexKassa extends Component {
  constructor(props) {
    super(props);
    this.state = {
      init: true,
      token: '',
      username: '',
      url: '',
      payment_process: false,
      subscribe_expiration: '',
      account_type: '',
    };
  }

  componentDidMount() {
    AsyncStorage.multiGet(['userToken', 'username']).then(([[[], token], [[], username]]) => {
      this.setState({token, username});
      this.getState();
    });
  }

  handleWebViewNavigationStateChange = (newNavState) => {
    if (newNavState.url === 'https://freelancescanner.com/blank/') {
      this.setState({payment_process: false});
      this.getState();
    }
  };

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

  getState() {
    axios
      .get(GET_STATE_URL, {headers: {Authorization: this.state.token}})
      .then(({data: {subscribe_expiration, account_type}}) => {
        console.log(subscribe_expiration);
        console.log(account_type);
        if (subscribe_expiration < 0) {
          subscribe_expiration = 'expired';
        } else {
          if (subscribe_expiration < 2) {
            subscribe_expiration = `${subscribe_expiration} day`;
          } else {
            subscribe_expiration = `${subscribe_expiration} days`;
          }
        }
        if (account_type === 'premium') {
          subscribe_expiration = '*';
        }
        this.setState({subscribe_expiration, account_type, init: false});
      })
      .catch(() => {});
  }

  render() {
    const {payment_process, url, init} = this.state;
    return (
      <View style={styles.root}>
        {payment_process ? (
          <WebView
            source={{uri: url}}
            onNavigationStateChange={(newNavState) => this.handleWebViewNavigationStateChange(newNavState)}
          />
        ) : (
          <View style={styles.container}>
            {init ? (
              <View style={styles.spinnerView}>
                <Spinner />
              </View>
            ) : (
              <>
                <Text style={styles.text}>Current Plan: "{this.state.account_type}"</Text>
                <Text style={styles.text}>Expiration time: "{this.state.subscribe_expiration}"</Text>
              </>
            )}
            <Text style={styles.text}>Subscribe for one more month!</Text>
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
  root: {
    flex: 1,
  },
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
