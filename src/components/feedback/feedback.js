import React, {Component} from 'react';
import {SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {
  BACKGROUND_COLOR,
  BORDER_COLOR,
  BORDER_RADIUS,
  BORDER_WIDTH,
  CONTENT_COLOR,
  FONT_FAMILY,
  FONT_FAMILY_BOLD,
  FONT_SIZE,
  HEADER_COLOR,
} from '../theme';
import axios from 'axios';
import {FEEDBACK_URL} from '../constants';
import {Loader} from '../spinner';

export default class FeedBack extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: 'Feed New',
      email: '',
      message: '',
      dangerMessage: false,
      dangerEmail: false,
      loading: false,
      done: false,
    };
  }

  sendFeedBack = () => {
    const {dangerEmail, message, email} = this.state;
    if (message.length === 0) {
      this.setState({dangerMessage: true});
    }
    if (email.length === 0) {
      this.setState({dangerEmail: true});
    }
    if (!dangerEmail && !(email.length === 0) && !(message.length === 0)) {
      console.log('send feedback');
      this.setState({loading: true});
      const data = {email: this.state.email, message: this.state.message};
      axios
        .post(FEEDBACK_URL, data)
        .then((response) => {
          console.log(response);
          this.setState({done: true});
        })
        .catch((error) => {
          this.setState({loading: false, danger: true});
          console.log(error);
        });
    }
  };

  changeEmail(email = '') {
    email = email.replace(' ', '');
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(email) === false) {
      this.setState({dangerEmail: true});
    } else {
      this.setState({dangerEmail: false});
    }
    this.setState({email: email});
  }

  changeMessage(msg) {
    if (msg.length === 0) {
      this.setState({dangerMessage: true});
    } else {
      this.setState({dangerMessage: false});
    }
    this.setState({message: msg});
  }

  render() {
    const {email, message, dangerMessage, dangerEmail, loading, done} = this.state;
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <ScrollView
          contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={'handled'}>
          {done ? (
            <View style={styles.containerDone}>
              <Text style={[styles.sendMessageMail, {margin: 15}]}>Successfully send!</Text>
              <Text style={[styles.sendMessageMail, {margin: 15}]}>Thank you for feedback!</Text>
              <TouchableOpacity
                style={[styles.buttonContainer, styles.feedBackButton]}
                activeOpacity={0.5}
                onPress={() => this.props.navigation.goBack()}>
                <Text style={styles.feedBackText}>OK</Text>
              </TouchableOpacity>
            </View>
          ) : loading ? (
            <Loader />
          ) : (
            <View style={styles.container}>
              <StatusBar backgroundColor={HEADER_COLOR} barStyle="light-content" />
              <View style={[styles.inputContainer, dangerEmail ? styles.danger : {}]}>
                <TextInput
                  autoFocus={true}
                  style={styles.emailText}
                  placeholder="Email"
                  underlineColorAndroid="transparent"
                  value={email}
                  onChangeText={(text) => this.changeEmail(text)}
                  onSubmitEditing={() => this.message.focus()}
                  blurOnSubmit={false}
                  onBlur={() => this.setState({email: email.toLowerCase()})}
                />
              </View>
              <View style={[styles.inputContainerMessage, dangerMessage ? styles.danger : {}]}>
                <TextInput
                  style={styles.messageText}
                  placeholder="Message"
                  multiline={true}
                  underlineColorAndroid="transparent"
                  value={message}
                  onChangeText={(text) => this.changeMessage(text)}
                  ref={(input) => {
                    this.message = input;
                  }}
                />
              </View>
              <TouchableOpacity style={[styles.buttonContainer]} activeOpacity={0.5} onPress={this.sendFeedBack}>
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: BACKGROUND_COLOR,
  },
  containerDone: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BACKGROUND_COLOR,
  },
  feedBackText: {
    color: 'white',
    fontFamily: FONT_FAMILY,
    fontSize: FONT_SIZE,
  },
  feedBackButton: {
    backgroundColor: CONTENT_COLOR,
  },
  sendMessageMail: {
    color: CONTENT_COLOR,
    fontFamily: FONT_FAMILY_BOLD,
    fontSize: FONT_SIZE + 10,
  },
  inputContainer: {
    backgroundColor: BACKGROUND_COLOR,
    borderRadius: BORDER_RADIUS,
    borderWidth: BORDER_WIDTH,
    borderColor: BORDER_COLOR,
    height: 45,
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  emailText: {
    height: 45,
    paddingLeft: 16,
    fontFamily: FONT_FAMILY,
    fontSize: FONT_SIZE,
    borderBottomColor: '#FFFFFF',
    color: CONTENT_COLOR,
    flex: 1,
  },
  inputContainerMessage: {
    backgroundColor: BACKGROUND_COLOR,
    borderRadius: BORDER_RADIUS,
    borderWidth: BORDER_WIDTH,
    borderColor: BORDER_COLOR,
    margin: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  messageText: {
    paddingLeft: 16,
    fontFamily: FONT_FAMILY,
    fontSize: FONT_SIZE,
    borderBottomColor: '#FFFFFF',
    color: CONTENT_COLOR,
    flex: 1,
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
  sendButtonText: {
    fontSize: FONT_SIZE,
    fontFamily: FONT_FAMILY,
    color: BACKGROUND_COLOR,
  },
  safeAreaView: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  danger: {
    borderWidth: 2,
    borderColor: 'red',
  },
});
