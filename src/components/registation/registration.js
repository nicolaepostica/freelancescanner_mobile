import React, {Component} from 'react';
import {Text, View, TextInput, TouchableOpacity, StatusBar, StyleSheet, ScrollView, SafeAreaView} from 'react-native';
import axios from 'axios';
import {BASE_URL, REGISTRATION, RESET_PASSWORD} from '../constants';
import {
  HEADER_COLOR,
  FONT_FAMILY,
  FONT_FAMILY_BOLD,
  FONT_SIZE,
  BORDER_RADIUS,
  BORDER_WIDTH,
  BORDER_COLOR,
  BACKGROUND_COLOR,
  CONTENT_COLOR,
} from '../theme';
import {log} from '../../services/api-service';
import {Loader} from '../spinner';

export default class Registration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      re_password: '',
      done: false,
      loading: false,
      dangerUsername: false,
      dangerEmail: false,
      dangerPassword: false,
      dangerRePassword: false,
      wrongEmail: false,
      usedEmail: false,
      usedUsername: false,
      missingUsername: false,
      shortPassword: false,
      matchPassword: false,
      commonPassword: false,
      errorMessage: '',
    };
  }

  _register = () => {
    this.setState({usedUsername: false, usedEmail: false, commonPassword: false});
    if (this.submitUsername() && this.submitEmail() && this.submitPassword() && this.submitRePassword()) {
      this.setState({loading: true});
      axios
        .post(`${BASE_URL}/api/v1/accounts/register/`, {
          username: this.state.username,
          email: this.state.email,
          password: this.state.password,
          password_confirm: this.state.re_password,
        })
        .then((response) => {
          log(REGISTRATION, this.state, response, this.state.username);
          this.setState({done: true, loading: false});
        })
        .catch(({response: {data}}) => {
          if (data.username) {
            console.log('username used');
            this.setState({usedUsername: true});
          } else {
            if (data.email) {
              console.log('email used');
              this.setState({usedEmail: true});
            } else {
              console.log('password common');
              this.setState({commonPassword: true});
            }
          }
          this.setState({loading: false});
        });
    }
  };

  submitUsername = () => {
    // console.log('username');
    if (this.state.username.length > 0) {
      this.setState({missingUsername: false, dangerUsername: false});
      return true;
    } else {
      this.setState({missingUsername: true, dangerUsername: true});
      return false;
    }
  };

  submitEmail = () => {
    // console.log('email');
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(this.state.email) === false) {
      this.setState({dangerEmail: true, wrongEmail: true});
      return false;
    } else {
      this.setState({dangerEmail: false, wrongEmail: false});
      return true;
    }
  };

  submitPassword = () => {
    // console.log('pass');
    if (this.state.password.length < 7) {
      this.setState({shortPassword: true, dangerPassword: true});
      return false;
    } else {
      this.setState({shortPassword: false});
      if (!this.state.matchPassword) {
        this.setState({dangerPassword: false});
      }
      return true;
    }
  };

  submitRePassword = () => {
    // console.log('re pass');
    if (this.state.password !== this.state.re_password) {
      this.setState({dangerPassword: true, dangerRePassword: true, matchPassword: true});
      return false;
    } else {
      this.setState({matchPassword: false});
      if (!this.state.shortPassword) {
        this.setState({dangerPassword: false, dangerRePassword: false});
      }
      return true;
    }
  };

  changeEmail(email = '') {
    email = email.replace(' ', '');
    email = email.toLowerCase();
    this.setState({email: email});
  }

  render() {
    const {
      dangerUsername,
      dangerEmail,
      dangerPassword,
      dangerRePassword,
      username: username_val,
      email: email_val,
      password: password_val,
      re_password: re_password_val,
      done,
      loading,
      wrongEmail,
      usedEmail,
      usedUsername,
      missingUsername,
      shortPassword,
      matchPassword,
      commonPassword,
    } = this.state;
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <ScrollView
          contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={'handled'}>
          {done ? (
            <View style={styles.container}>
              <Text style={[styles.sendMessageMail, {margin: 15}]}>
                You have successfully registered! To activate your account please follow the link in the letter sent via
                e-mail. For reliability, please check your "Spam" folder.
              </Text>
              <TouchableOpacity
                style={[styles.buttonContainer, styles.loginButton]}
                activeOpacity={0.5}
                onPress={() => this.props.navigation.goBack()}>
                <Text style={styles.loginText}>OK</Text>
              </TouchableOpacity>
            </View>
          ) : loading ? (
            <Loader />
          ) : (
            <View style={styles.container}>
              <StatusBar backgroundColor={HEADER_COLOR} barStyle="light-content" />
              <View style={[styles.inputContainer, dangerUsername ? styles.danger : {}]}>
                <TextInput
                  // autoFocus={true}
                  style={styles.inputs}
                  placeholder="Username"
                  underlineColorAndroid="transparent"
                  value={username_val}
                  onChangeText={(username) => this.setState({username})}
                  onSubmitEditing={() => this.email.focus()}
                  blurOnSubmit={false}
                  onBlur={() => {
                    this.submitUsername();
                  }}
                />
              </View>
              <View style={[styles.inputContainer, dangerEmail ? styles.danger : {}]}>
                <TextInput
                  style={styles.inputs}
                  placeholder="Email"
                  underlineColorAndroid="transparent"
                  value={email_val}
                  onChangeText={(email) => this.changeEmail(email)}
                  ref={(input) => {
                    this.email = input;
                  }}
                  onSubmitEditing={() => {
                    this.password.focus();
                  }}
                  blurOnSubmit={false}
                  onBlur={() => {
                    this.setState({email: email_val.toLowerCase()});
                    this.submitEmail();
                  }}
                />
              </View>
              <View style={[styles.inputContainer, dangerPassword ? styles.danger : {}]}>
                <TextInput
                  style={styles.inputs}
                  placeholder="Password (min 8 digits)"
                  secureTextEntry={true}
                  underlineColorAndroid="transparent"
                  value={password_val}
                  onChangeText={(password) => {
                    this.setState({password});
                    if (this.state.matchPassword) {
                      this.submitRePassword();
                    }
                  }}
                  ref={(input) => {
                    this.password = input;
                  }}
                  onSubmitEditing={() => this.re_password.focus()}
                  blurOnSubmit={false}
                  onBlur={() => {
                    this.submitPassword();
                  }}
                />
              </View>
              <View style={[styles.inputContainer, dangerRePassword ? styles.danger : {}]}>
                <TextInput
                  style={styles.inputs}
                  placeholder="Re Password"
                  secureTextEntry={true}
                  underlineColorAndroid="transparent"
                  value={re_password_val}
                  onChangeText={(re_password) => {
                    this.setState({re_password});
                    if (this.state.matchPassword) {
                      this.submitRePassword();
                    }
                  }}
                  ref={(input) => {
                    this.re_password = input;
                  }}
                  onSubmitEditing={() => this._register()}
                  onBlur={() => {
                    this.submitRePassword();
                  }}
                />
              </View>
              <Text style={[styles.invalidText, wrongEmail ? {} : {display: 'none'}]}>Wrong e-mail address</Text>
              <Text style={[styles.invalidText, usedEmail ? {} : {display: 'none'}]}>E-mail already used</Text>
              <Text style={[styles.invalidText, usedUsername ? {} : {display: 'none'}]}>Username already used</Text>
              <Text style={[styles.invalidText, missingUsername ? {} : {display: 'none'}]}>Username is missing</Text>
              <Text style={[styles.invalidText, shortPassword ? {} : {display: 'none'}]}>Password is too short</Text>
              <Text style={[styles.invalidText, matchPassword ? {} : {display: 'none'}]}>Passwords don't match</Text>
              <Text style={[styles.invalidText, commonPassword ? {} : {display: 'none'}]}>Passwords is too common</Text>
              <TouchableOpacity
                style={[styles.buttonContainer, styles.loginButton]}
                activeOpacity={0.5}
                onPress={this._register}>
                <Text style={styles.loginText}>Register</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.haveAccountContainer]}
                activeOpacity={0.5}
                onPress={() => {
                  this.props.navigation.goBack();
                }}>
                <Text style={styles.haveAccount}>Have an account? Log In</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      displayInput: {},
      displayMessage: {display: 'none'},
      invalid: {display: 'none'},
    };
  }

  send_reset_link = () => {
    const {email} = this.state;
    this.setState({email: email.toLowerCase()});
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(email) === false) {
      console.log('Email is Not Correct');
      this.setState({invalid: {}});
      return false;
    } else {
      this.setState({invalid: {display: 'none'}});
      console.log('Email is Correct');
      axios
        .post(`${BASE_URL}/api/v1/accounts/send-reset-password-link/`, {
          email: this.state.email,
        })
        .then((response) => {
          console.log(response);
          this.setState({displayInput: {display: 'none'}});
          this.setState({displayMessage: {}});
          log(RESET_PASSWORD, this.state, response);
          setTimeout(() => this.props.navigation.goBack(), 500);
        })
        .catch((e) => console.log(e.data));
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

  render() {
    const {displayInput, displayMessage, email, invalid} = this.state;
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <ScrollView
          contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={'handled'}>
          <View style={styles.container}>
            <Text style={[styles.invalid, invalid]}>Invalid email!</Text>
            <StatusBar backgroundColor={HEADER_COLOR} barStyle="light-content" />
            <View style={[styles.inputContainer, displayInput]}>
              <TextInput
                style={styles.inputs}
                placeholder="Email"
                underlineColorAndroid="transparent"
                value={email}
                onChangeText={(mail) => this.changeEmail(mail)}
              />
            </View>
            <TouchableOpacity
              style={[styles.buttonContainer, styles.loginButton, displayInput]}
              activeOpacity={0.5}
              onPress={this.send_reset_link}>
              <Text style={styles.loginText}>Send reset link</Text>
            </TouchableOpacity>
            <View style={[styles.sendMessage, displayMessage]}>
              <Text style={styles.sendMessageText}>Reset link send to:</Text>
              <Text style={styles.sendMessageMail}>"{email}"</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export {ForgotPassword};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BACKGROUND_COLOR,
  },
  safeAreaView: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  inputContainer: {
    backgroundColor: BACKGROUND_COLOR,
    borderRadius: BORDER_RADIUS,
    borderWidth: BORDER_WIDTH,
    borderColor: BORDER_COLOR,
    width: 250,
    height: 45,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sendMessage: {
    backgroundColor: BACKGROUND_COLOR,
    width: 250,
    height: 45,
    marginBottom: 20,
    flexDirection: 'column',
    alignItems: 'center',
  },
  sendMessageText: {
    color: CONTENT_COLOR,
    fontFamily: FONT_FAMILY,
    fontSize: FONT_SIZE + 5,
  },
  sendMessageMail: {
    color: CONTENT_COLOR,
    fontFamily: FONT_FAMILY_BOLD,
    fontSize: FONT_SIZE + 10,
    textAlign: 'center',
  },
  danger: {
    borderWidth: 2,
    borderColor: 'red',
  },
  inputs: {
    color: CONTENT_COLOR,
    fontFamily: FONT_FAMILY,
    fontSize: FONT_SIZE,
    height: 45,
    paddingLeft: 16,
    borderBottomColor: '#fff',
    flex: 1,
    borderRadius: 30,
  },
  icon: {
    width: 30,
    height: 30,
  },
  buttonContainer: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
  },
  loginButton: {
    backgroundColor: CONTENT_COLOR,
  },
  loginText: {
    color: 'white',
    fontFamily: FONT_FAMILY,
    fontSize: FONT_SIZE,
  },
  invalid: {
    color: 'red',
    fontSize: FONT_SIZE,
    fontFamily: FONT_FAMILY_BOLD,
  },
  haveAccount: {
    fontSize: FONT_SIZE,
    fontFamily: FONT_FAMILY,
    color: CONTENT_COLOR,
    textDecorationLine: 'underline',
  },
  haveAccountContainer: {
    height: 35,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignSelf: 'center',
    width: 250,
  },
  invalidText: {
    color: 'red',
    fontFamily: FONT_FAMILY_BOLD,
    fontSize: FONT_SIZE,
    marginBottom: 20,
  },
});
