import React, {Component} from 'react';
import {WebView} from 'react-native-webview';
import {BASE_URL} from '../constants';

class YandexKassa extends Component {
  handleWebViewNavigationStateChange = (newNavState) => {
    if (newNavState.url === `${BASE_URL}/web/`) {
      this.props.navigation.reset();
    }
  };

  render() {
    return (
      <WebView
        source={{uri: `${BASE_URL}/payment/yandex-pay/`}}
        onNavigationStateChange={(newNavState) => this.handleWebViewNavigationStateChange(newNavState)}
      />
    );
  }
}

export default YandexKassa;
