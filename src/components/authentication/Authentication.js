import React, {createContext, useContext, useState, useReducer, useMemo, useEffect} from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {BASE_URL} from '../constants';
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
  TINT_COLOR,
  BORDER_COLOR_DANGER,
} from '../theme';
import axios from 'axios';
import Notifications, {NotificationDetail} from '../feeds';
import YandexKassa from '../payment';
import Registration, {ForgotPassword} from '../registation';
import EditTopic, {AddLanguage, AddSkill} from '../edit-topic';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Settings from '../setting';
const hamburgerMenuIcon = require('../../resources/icons/menu.png');
const arrowLeft = require('../../resources/icons/arrow-left.png');
const favoriteIcon = require('../../resources/icons/heart-solid.png');
const notificationIcon = require('../../resources/icons/bell-solid.png');
const disabledNotificationIcon = require('../../resources/icons/bell-slash-solid.png');
const envelopeIcon = require('../../resources/icons/envelope.png');
import {Loader} from '../spinner';
import Favorite from '../favorite';
import FeedBack from '../feedback';

const AuthContext = createContext();

const NavigatorSetting = createStackNavigator();
const SettingStack = ({navigation}) => {
  return (
    <NavigatorSetting.Navigator initialRouteName="EditTopic" screenOptions={{gestureEnabled: true}}>
      <NavigatorSetting.Screen
        name="MainSettings"
        component={Settings}
        options={{
          headerShown: true,
          headerTitle: 'Settings',
          headerStyle: {
            backgroundColor: HEADER_COLOR,
          },
          headerTintColor: TINT_COLOR,
          headerTitleStyle: {
            fontFamily: FONT_FAMILY_BOLD,
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Image style={styles.image} source={hamburgerMenuIcon} />
            </TouchableOpacity>
          ),
        }}
      />
      <NavigatorSetting.Screen
        name="EditTopic"
        component={EditTopic}
        options={{
          headerShown: true,
          headerTitle: 'Freelance Settings',
          headerStyle: {
            backgroundColor: HEADER_COLOR,
          },
          headerTintColor: TINT_COLOR,
          headerTitleStyle: {
            fontFamily: FONT_FAMILY_BOLD,
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image style={styles.image} source={arrowLeft} />
            </TouchableOpacity>
          ),
        }}
      />
      <NavigatorSetting.Screen
        name="AddSkill"
        component={AddSkill}
        options={{
          headerShown: true,
          headerTitle: 'Add Skills',
          headerStyle: {
            backgroundColor: HEADER_COLOR,
          },
          headerTintColor: TINT_COLOR,
          headerTitleStyle: {
            fontFamily: FONT_FAMILY_BOLD,
          },
        }}
      />
      <NavigatorSetting.Screen
        name="AddLanguage"
        component={AddLanguage}
        options={{
          headerShown: true,
          headerTitle: 'Add Languages',
          headerStyle: {
            backgroundColor: HEADER_COLOR,
          },
          headerTintColor: TINT_COLOR,
          headerTitleStyle: {
            fontFamily: FONT_FAMILY_BOLD,
          },
        }}
      />
    </NavigatorSetting.Navigator>
  );
};

const NavigatorNotification = createStackNavigator();
const NotificationsStack = ({navigation}) => {
  const [silent, setSilent] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('switchSilent').then((value) => {
      setSilent(value === 'true');
    });
  }, []);

  const switchSilent = () => {
    console.log(silent);
    AsyncStorage.setItem('switchSilent', String(!silent));
    setSilent(!silent);
  };

  return (
    <NavigatorNotification.Navigator initialRouteName="Feeds" screenOptions={{gestureEnabled: true}}>
      <NavigatorNotification.Screen
        name="Feeds"
        component={Notifications}
        options={{
          headerShown: true,
          headerTitle: 'Projects',
          headerStyle: {
            backgroundColor: HEADER_COLOR,
          },
          headerTintColor: TINT_COLOR,
          headerTitleStyle: {
            fontFamily: FONT_FAMILY_BOLD,
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Image style={styles.image} source={hamburgerMenuIcon} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={styles.headerRight}>
              <TouchableOpacity activeOpacity={0.8} onPress={() => switchSilent()}>
                <Image style={styles.image} source={silent ? notificationIcon : disabledNotificationIcon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Favorite')}>
                <Image style={styles.image} source={favoriteIcon} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <NavigatorNotification.Screen
        name="NotificationDetail"
        component={NotificationDetail}
        options={{
          headerShown: true,
          headerTitle: 'Project Detail',
          headerStyle: {
            backgroundColor: HEADER_COLOR,
          },
          headerTintColor: TINT_COLOR,
          headerTitleStyle: {
            fontFamily: FONT_FAMILY_BOLD,
          },
        }}
      />
      <NavigatorNotification.Screen
        name="Favorite"
        component={Favorite}
        options={{
          headerShown: true,
          headerTitle: 'Favorite',
          headerStyle: {
            backgroundColor: HEADER_COLOR,
          },
          headerTintColor: TINT_COLOR,
          headerTitleStyle: {
            fontFamily: FONT_FAMILY_BOLD,
          },
        }}
      />
    </NavigatorNotification.Navigator>
  );
};

const SignOut = ({navigation}) => {
  const {signOut} = useContext(AuthContext);
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={HEADER_COLOR} barStyle="light-content" />
      <TouchableOpacity style={[styles.buttonContainer, styles.loginButton]} activeOpacity={0.5} onPress={signOut}>
        <Text style={styles.loginText}>SingOut</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.buttonContainer, styles.loginButton]}
        activeOpacity={0.5}
        onPress={() => {
          navigation.navigate('Notifications');
        }}>
        <Text style={styles.loginText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

const Drawer = createDrawerNavigator();
const HomeScreen = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Notifications"
      drawerStyle={{
        backgroundColor: BACKGROUND_COLOR,
        width: 240,
      }}
      drawerContentOptions={{
        activeTintColor: CONTENT_COLOR,
        inactiveTintColor: CONTENT_COLOR,
      }}>
      <Drawer.Screen
        name="Notifications"
        component={NotificationsStack}
        options={{
          drawerIcon: ({color}) => (
            <Image
              source={require('../../resources/icons/notification.png')}
              style={[styles.icon, {tintColor: color}]}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingStack}
        options={{
          drawerIcon: ({color}) => (
            <Image source={require('../../resources/icons/settings.png')} style={[styles.icon, {tintColor: color}]} />
          ),
        }}
      />
      <Drawer.Screen
        name="Payment"
        component={YandexKassa}
        options={{
          drawerIcon: ({color}) => (
            <Image source={require('../../resources/icons/card.png')} style={[styles.icon, {tintColor: color}]} />
          ),
        }}
      />
      <Drawer.Screen
        name="FeedBack"
        component={FeedBack}
        options={{
          drawerIcon: ({color}) => (
            <Image source={require('../../resources/icons/envelope.png')} style={[styles.icon, {tintColor: color}]} />
          ),
        }}
      />
      <Drawer.Screen
        name="SignOut"
        component={SignOut}
        options={{
          drawerIcon: ({color}) => (
            <Image source={require('../../resources/icons/signout.png')} style={[styles.icon, {tintColor: color}]} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

const SignInScreen = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [danger, setDanger] = useState(false);
  const [loading, setLoading] = useState(false);

  const {signIn} = useContext(AuthContext);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'handled'}>
        {loading ? (
          <Loader />
        ) : (
          <View style={styles.container}>
            <StatusBar backgroundColor={HEADER_COLOR} barStyle="light-content" />
            <View style={[styles.inputContainer, danger ? styles.danger : {}]}>
              <TextInput
                // autoFocus={true}
                style={styles.inputs}
                placeholder="Username"
                underlineColorAndroid="transparent"
                value={username}
                onChangeText={setUsername}
                onSubmitEditing={() => this.pass.focus()}
                blurOnSubmit={false}
              />
            </View>
            <View style={[styles.inputContainer, danger ? styles.danger : {}]}>
              <TextInput
                style={styles.inputs}
                placeholder="Password"
                secureTextEntry={true}
                underlineColorAndroid="transparent"
                value={password}
                onChangeText={setPassword}
                ref={(input) => {
                  this.pass = input;
                }}
                onSubmitEditing={() => signIn({username, password, setDanger, setLoading})}
              />
            </View>
            <Text style={[styles.invalidText, danger ? {} : {display: 'none'}]}>Invalid Login or password</Text>
            <TouchableOpacity
              style={[styles.forgotPasswordContainer]}
              activeOpacity={0.5}
              onPress={() => {
                navigation.navigate('ForgotPassword');
              }}>
              <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.buttonContainer, styles.loginButton]}
              activeOpacity={0.5}
              onPress={() => signIn({username, password, setDanger, setLoading})}>
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.buttonContainer, styles.loginButton]}
              activeOpacity={0.5}
              onPress={() => {
                navigation.navigate('Registration');
              }}>
              <Text style={styles.loginText}>Registration</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const Stack = createStackNavigator();
const Authentication = () => {
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    },
  );

  useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {}
      dispatch({type: 'RESTORE_TOKEN', token: userToken});
    };

    bootstrapAsync();
  }, []);

  const initUserProfile = async (token) => {
    axios
      .get(`${BASE_URL}/api/v1/get-user/`, {
        headers: {Authorization: token},
      })
      .then(({data: {id: user_id, username, email}}) => {
        axios
          .get(`${BASE_URL}/api/v1/user/${user_id}/`, {
            headers: {Authorization: token},
          })
          .then(({data: {chanel_list}}) => {
            const [chanel] = chanel_list;
            const [filter] = chanel.filter_list;
            AsyncStorage.multiSet([
              ['user_id', `${user_id}`],
              ['username', `${username}`],
              ['chanel_id', `${chanel.id}`],
              ['filter_id', `${filter.id}`],
            ]).then(() => {
              dispatch({type: 'SIGN_IN', token});
            });
          });
      });
  };

  const authContext = useMemo(
    () => ({
      signIn: async ({username, password, setDanger, setLoading}) => {
        setLoading(true);
        await axios
          .post(`${BASE_URL}/api/v1/token-auth/`, {username, password})
          .then(({data: {token}}) => {
            token = `Token ${token}`;
            AsyncStorage.setItem('userToken', token);
            setDanger(false);
            initUserProfile(token);
          })
          .catch((e) => {
            console.log(e);
            setDanger(true);
            setLoading(false);
          });
      },
      signOut: () => {
        AsyncStorage.removeItem('userToken');
        dispatch({type: 'SIGN_OUT'});
      },
    }),
    [],
  );

  if (state.isLoading) {
    return <Loader />;
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {state.userToken == null ? (
          <Stack.Navigator>
            <Stack.Screen
              name="Login"
              component={SignInScreen}
              options={{
                headerShown: true,
                title: 'Login',
                animationTypeForReplace: state.isSignout ? 'pop' : 'push',
                headerStyle: {
                  backgroundColor: HEADER_COLOR,
                },
                headerTintColor: TINT_COLOR,
                headerTitleStyle: {
                  fontFamily: FONT_FAMILY_BOLD,
                },
              }}
            />
            <Stack.Screen
              name="Registration"
              component={Registration}
              options={({navigation}) => ({
                headerShown: true,
                title: 'Registration',
                headerStyle: {
                  backgroundColor: HEADER_COLOR,
                },
                headerTintColor: TINT_COLOR,
                headerTitleStyle: {
                  fontFamily: FONT_FAMILY_BOLD,
                },
                headerRight: () => (
                  <TouchableOpacity onPress={() => navigation.navigate('FeedBack')}>
                    <Image style={styles.image} source={envelopeIcon} />
                  </TouchableOpacity>
                ),
              })}
            />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPassword}
              options={{
                headerShown: true,
                title: 'Forgot Password',
                headerStyle: {
                  backgroundColor: HEADER_COLOR,
                },
                headerTintColor: TINT_COLOR,
                headerTitleStyle: {
                  fontFamily: FONT_FAMILY_BOLD,
                },
              }}
            />
            <Stack.Screen
              name="FeedBack"
              component={FeedBack}
              options={{
                headerShown: true,
                title: 'Feedback',
                headerStyle: {
                  backgroundColor: HEADER_COLOR,
                },
                headerTintColor: TINT_COLOR,
                headerTitleStyle: {
                  fontFamily: FONT_FAMILY_BOLD,
                },
              }}
            />
          </Stack.Navigator>
        ) : (
          <HomeScreen />
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BACKGROUND_COLOR,
  },
  inputContainer: {
    backgroundColor: BACKGROUND_COLOR,
    borderRadius: BORDER_RADIUS,
    borderWidth: BORDER_WIDTH,
    borderColor: BORDER_COLOR,
    width: 250,
    height: 45,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  danger: {
    borderWidth: 2,
    borderColor: BORDER_COLOR_DANGER,
  },
  inputs: {
    height: 45,
    paddingLeft: 16,
    fontFamily: FONT_FAMILY,
    fontSize: FONT_SIZE,
    borderBottomColor: '#FFFFFF',
    flex: 1,
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
  forgotPasswordContainer: {
    height: 35,
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    marginTop: 10,
    width: 250,
  },
  forgotPassword: {
    fontSize: FONT_SIZE,
    fontFamily: FONT_FAMILY,
    color: CONTENT_COLOR,
    textDecorationLine: 'underline',
  },
  loginButton: {
    backgroundColor: CONTENT_COLOR,
  },
  loginText: {
    color: '#fff',
    fontFamily: FONT_FAMILY_BOLD,
    fontSize: FONT_SIZE,
  },
  image: {
    marginLeft: 20,
    marginRight: 20,
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
  safeAreaView: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  headerRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  invalidText: {
    color: 'red',
    fontFamily: FONT_FAMILY_BOLD,
    fontSize: FONT_SIZE,
    marginTop: 10,
  },
});

export default Authentication;

export {HomeScreen, SignInScreen};
