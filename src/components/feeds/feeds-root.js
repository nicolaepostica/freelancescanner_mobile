import {
  ActivityIndicator,
  SafeAreaView,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  View,
  AppState,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {Component} from 'react';
import {FAVORITE, GET_FEED_ALL_URL, MANAGE_FAVORITES, READ_ALL_URL, READ_CURRENT_URL, WSS_URL} from '../constants';
import AsyncStorage from '@react-native-community/async-storage';
import PushNotification from 'react-native-push-notification';
import axios from 'axios';
import Spinner from '../spinner';
import {FeedItem} from './feeds-item';
import update from 'immutability-helper';
import {BACKGROUND_COLOR, CONTENT_COLOR, CONTENT_INACTIVE_COLOR, FONT_FAMILY, FONT_SIZE, HEADER_COLOR} from '../theme';
import {log} from '../../services/api-service';

const getScrollPosition = ({layoutMeasurement, contentOffset, contentSize}) => {
  if (contentOffset.y === 0) {
    return 0;
  } else {
    return (layoutMeasurement.height + contentOffset.y) / contentSize.height;
  }
};

export default class FeedsRoot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: 'Feed New',
      token: '',
      username: '',
      filter_id: null,
      chanel_id: null,
      user_id: null,
      user: {},
      feeds: [],
      feeds_new: [],
      init: true,
      loading: false,
      next_feeds_url: null,
      is_new: true,
      isBot: false,
      scroll_style: {},
      flatListScrollEnabled: true,
      scrollContainerHeight: 600,
      wss: null,
      appState: AppState.currentState,
      switchSilent: false,
      silentColor: CONTENT_INACTIVE_COLOR,
      badge: false,
    };
  }

  componentDidMount() {
    this.initSettings();
    AppState.addEventListener('change', this._handleAppStateChange);
    this.props.navigation.addListener('focus', () => {
      if (!this.state.init) {
        this.setState({feeds_new: []});
        this.getFeeds(GET_FEED_ALL_URL);
      }
    });
  }

  componentWillUnmount() {
    AppState.addEventListener('change', this._handleAppStateChange);
    try {
      this.state.wss.onclose = (e) => {
        console.log(e.code, e.reason);
      };
    } catch (e) {
      console.log(e);
    }
  }

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App is active');
    } else {
      console.log('App is inactive');
    }
    this.setState({appState: nextAppState});
  };

  initSettings = () => {
    AsyncStorage.multiGet(['userToken', 'filter_id', 'chanel_id', 'user_id', 'username']).then(
      ([[[], token], [[], filter_id], [[], chanel_id], [[], user_id], [[], username]]) => {
        filter_id = Number(filter_id);
        user_id = Number(user_id);
        chanel_id = Number(chanel_id);
        this.setState({token, filter_id, chanel_id, user_id, username});
        this.getFeeds(GET_FEED_ALL_URL);
        // eslint-disable-next-line no-undef
        const wss = new WebSocket(`${WSS_URL}${chanel_id}/`);
        this.setState({wss});
        this.state.wss.onmessage = async (e) => {
          if (this.state.appState === 'active') {
            // 'App is active'
          } else {
            // 'App is inactive'
            const silentMode = await AsyncStorage.getItem('switchSilent');
            if (silentMode === 'true') {
              this.setNotification();
            }
          }
          this.setState(({feeds_new}) => {
            return {feeds_new: [...JSON.parse(e.data).message.projects, ...feeds_new], badge: true};
          });
        };
        this.state.wss.onerror = (e) => {
          console.log(e.message);
        };
      },
    );
  };

  setNotification = () => {
    PushNotification.localNotification({
      id: 12345,
      title: 'Info',
      message: 'Your have a new projects.',
      playSound: true,
      soundName: 'default',
      alert: false,
      badge: false,
      vibrate: false,
    });
    // PushNotification.cancelLocalNotifications({id: 12345});
  };

  getFeeds(url) {
    axios
      .get(url, {headers: {Authorization: this.state.token}})
      .then(({data}) => {
        if (data.next) {
          this.setState({
            feeds: data.results,
            next_feeds_url: data.next,
            init: false,
          });
        } else {
          this.setState({
            feeds: data.results,
            next_feeds_url: null,
            init: false,
          });
        }
      })
      .catch(() => {});
  }

  getNextFeeds() {
    const {next_feeds_url} = this.state;
    if (next_feeds_url !== null) {
      this.setState({loading: true});
      axios
        .get(next_feeds_url, {headers: {Authorization: this.state.token}})
        .then(({data: {results, next}}) => {
          this.setState(({feeds}) => {
            return {
              feeds: [...feeds, ...results],
              next_feeds_url: next,
              loading: false,
            };
          });
        })
        .catch((error) => {
          console.log(error);
          this.setState({
            loading: false,
          });
        });
    } else {
      console.log("Don't have new");
    }
  }

  setStateReadAll() {
    this.state.feeds.map((item, index) => {
      if (item.is_new) {
        this.setState({
          feeds: update(this.state.feeds, {
            [index]: {is_new: {$set: false}},
          }),
        });
      }
    });
  }

  setStateReadAllNew() {
    this.state.feeds_new.map((item, index) => {
      if (item.is_new) {
        this.setState({
          feeds_new: update(this.state.feeds_new, {
            [index]: {is_new: {$set: false}},
          }),
        });
      }
    });
  }

  readAll = () => {
    console.log('Read All!');
    this.setStateReadAll();
    axios
      .post(READ_ALL_URL, {param: 'clean'}, {headers: {Authorization: this.state.token}})
      .then((response) => {
        // log('read_all', this.state, response, this.state.username);
        this.setStateReadAll();
        this.setStateReadAllNew();
      })
      .catch((e) => {
        log('read_all', this.state, e, this.state.username);
        console.log(e);
      });
  };

  readCurrent = ({name, item, index}) => {
    axios
      .put(`${READ_CURRENT_URL}${item.id}/`, {is_new: false}, {headers: {Authorization: this.state.token}})
      .then((response) => {
        if (name === 'feeds') {
          this.setState({
            feeds: update(this.state.feeds, {
              [index]: {is_new: {$set: false}},
            }),
          });
          log('read_current', this.state, response, this.state.username);
        } else if (name === 'feeds_new') {
          this.setState({
            feeds_new: update(this.state.feeds_new, {
              [index]: {is_new: {$set: false}},
            }),
          });
        }
      })
      .then(() => {
        if (this.state.feeds.length < 20) {
          this.getNextFeeds();
        }
      });
  };

  onScrollFlatList({nativeEvent}, getUpdate) {
    if (getScrollPosition(nativeEvent) === 1) {
      if (getUpdate) {
        if (!this.state.isBot) {
          this.setState({isBot: true, loading: true});
          this.getNextFeeds();
        }
      }
    }
  }

  onFavoriteClick = ({name, index, project_id, user_id, item_id, favorite}) => {
    const data = {project_id, user_id, action: favorite ? 'create' : 'delete'};
    axios
      .post(MANAGE_FAVORITES, data, {headers: {Authorization: this.state.token}})
      .then((response) => {
        this.setState(
          {
            feeds: update(this.state.feeds, {
              [index]: {project_data: {favorite: {$set: favorite}}},
            }),
          },
          () => log(FAVORITE, this.state.feeds[index], response, this.state.username),
        );
      })
      .catch((e) => {
        log(FAVORITE, this.state.feeds[index], e, this.state.username);
        console.log(e);
      });
  };

  displayNews() {
    this.setState(({feeds, feeds_new}) => {
      return {feeds: feeds_new.concat(feeds), feeds_new: [], badge: false};
    });
    this.flatListRef.scrollToOffset({offset: 0, animated: true});
  }

  render() {
    const {init, loading, feeds, flatListScrollEnabled, user_id, badge} = this.state;
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={HEADER_COLOR} barStyle="light-content" />
        <View style={styles.feeds}>
          {init ? (
            <View style={styles.spinnerView}>
              <Spinner />
            </View>
          ) : (
            <SafeAreaView style={styles.safeAreaViewStyle}>
              {badge ? (
                <View style={styles.badgeContainer}>
                  <TouchableOpacity style={styles.badge} activeOpacity={0.5} onPress={() => this.displayNews()}>
                    <Text style={styles.badgeText}>You have new projects</Text>
                    <Image
                      style={styles.badgeIcon}
                      source={require('../../resources/icons/hand-point-left-solid.png')}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <></>
              )}
              {feeds.length > 0 ? (
                <View>
                  <FlatList
                    scrollEnabled={flatListScrollEnabled}
                    showsVerticalScrollIndicator={false}
                    ref={(ref) => (this.flatListRef = ref)}
                    onScroll={(e) => this.onScrollFlatList(e, false)}
                    scrollEventThrottle={400}
                    onMomentumScrollEnd={(e) => this.onScrollFlatList(e, true)}
                    data={feeds}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={({item, index}) => (
                      <FeedItem
                        name="feeds"
                        readAll={this.readAll}
                        readCurrent={this.readCurrent}
                        navigation={this.props.navigation}
                        key={`feed-${item.id}`}
                        item={item}
                        index={index}
                        user_id={user_id}
                        onFavoriteClick={this.onFavoriteClick}
                      />
                    )}
                  />
                  {loading ? (
                    <View style={styles.loader}>
                      <ActivityIndicator size="large" color={CONTENT_COLOR} />
                    </View>
                  ) : (
                    <></>
                  )}
                </View>
              ) : (
                <View style={styles.row}>
                  <Text style={styles.text}>Don't have updates!</Text>
                </View>
              )}
            </SafeAreaView>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    color: CONTENT_COLOR,
  },
  topic: {
    flexDirection: 'row',
    margin: 5,
    padding: 5,
    borderRadius: 5,
    backgroundColor: BACKGROUND_COLOR,
    justifyContent: 'space-between',
  },
  descriptions: {
    margin: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  icon: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    tintColor: CONTENT_COLOR,
  },
  feeds: {
    flex: 1,
  },
  spinnerView: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  safeAreaViewStyle: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    color: CONTENT_COLOR,
  },
  footerWrapperNC: {
    flexDirection: 'row',
  },
  footerWrapper: {
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  list_element: {
    margin: 3,
    borderColor: CONTENT_COLOR,
    borderBottomWidth: 1,
  },
  text: {
    color: CONTENT_COLOR,
    paddingLeft: 4,
    paddingRight: 4,
    fontSize: FONT_SIZE,
    fontFamily: FONT_FAMILY,
  },
  row: {
    height: 50,
    backgroundColor: BACKGROUND_COLOR,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  inverted: {
    transform: [{scaleY: -1}],
  },
  badgeContainer: {
    marginTop: 3,
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: 'transparent',
    zIndex: 5,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    borderRadius: 25,
    backgroundColor: CONTENT_COLOR,
  },
  badgeText: {
    color: BACKGROUND_COLOR,
    padding: 5,
    fontSize: FONT_SIZE,
    fontFamily: FONT_FAMILY,
  },
  badgeIcon: {
    width: FONT_SIZE,
    height: FONT_SIZE,
    margin: 8,
    marginLeft: 0,
    tintColor: BACKGROUND_COLOR,
  },
});
