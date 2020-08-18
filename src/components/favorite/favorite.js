import {ActivityIndicator, SafeAreaView, FlatList, StatusBar, StyleSheet, Text, View} from 'react-native';
import React, {Component} from 'react';
import {FAVORITE, GET_FAVORITES} from '../constants';
import AsyncStorage from '@react-native-community/async-storage';
import {FeedItem} from '../feeds';
import axios from 'axios';
import Spinner from '../spinner';
import {BACKGROUND_COLOR, CONTENT_COLOR, FONT_FAMILY, FONT_SIZE, HEADER_COLOR} from '../theme';
import {log} from '../../services/api-service';

const getScrollPosition = ({layoutMeasurement, contentOffset, contentSize}) => {
  if (contentOffset.y === 0) {
    return 0;
  } else {
    return (layoutMeasurement.height + contentOffset.y) / contentSize.height;
  }
};

export default class Favorite extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: 'Favorite',
      token: '',
      username: '',
      filter_id: null,
      chanel_id: null,
      user_id: null,
      user: {},
      favorites: [],
      init: true,
      loading: false,
      next_favorites_url: null,
      isBot: false,
    };
  }

  componentDidMount() {
    this.initSettings();
  }

  initSettings = () => {
    AsyncStorage.multiGet(['userToken', 'filter_id', 'chanel_id', 'user_id', 'username']).then(
      ([[[], token], [[], filter_id], [[], chanel_id], [[], user_id], [[], username]]) => {
        filter_id = Number(filter_id);
        user_id = Number(user_id);
        chanel_id = Number(chanel_id);
        this.setState({token, filter_id, chanel_id, user_id, username});
        this.getFavorites(GET_FAVORITES);
      },
    );
  };

  getFavorites(url) {
    axios
      .get(url, {headers: {Authorization: this.state.token}})
      .then(({data}) => {
        if (data.next) {
          this.setState({
            favorites: data.results,
            next_favorites_url: data.next,
            init: false,
          });
        } else {
          this.setState({
            favorites: data.results,
            next_favorites_url: null,
            init: false,
          });
        }
        log(FAVORITE, this.state, data, this.state.username);
      })
      .catch(() => {});
  }

  getNextFavorites() {
    const {next_favorite_url} = this.state;
    if (next_favorite_url) {
      this.setState({loading: true});
      axios
        .get(next_favorite_url, {headers: {Authorization: this.state.token}})
        .then(({data}) => {
          const {results, next} = data;
          if (next) {
            this.setState(({feeds}) => {
              return {
                feeds: [...feeds, ...results],
                next_favorite_url: next,
                loading: false,
                isBot: false,
              };
            });
          } else {
            this.setState({
              feeds: results,
              loading: false,
            });
          }
          log(FAVORITE, this.state, data, this.state.username);
        })
        .catch((error) => {
          log(FAVORITE, this.state, error, this.state.username);
          console.log(error);
        });
    } else {
      console.log("Don't have new");
    }
  }

  onScrollFlatList({nativeEvent}) {
    if (getScrollPosition(nativeEvent) === 1) {
      if (!this.state.isBot) {
        this.setState({isBot: true});
        this.getNextFavorites();
      }
    }
  }

  onFavoriteClick = ({index, item_id}) => {
    axios
      .delete(`${GET_FAVORITES}${item_id}/`, {headers: {Authorization: this.state.token}})
      .then((data) => {
        this.setState(
          ({favorites}) => {
            favorites.splice(index, 1);
            return {favorites};
          },
          () => log(FAVORITE, this.state, data, this.state.username),
        );
      })
      .catch((error) => {
        log(FAVORITE, this.state, error, this.state.username);
        console.log(error);
      });
  };

  render() {
    const {init, loading, favorites, user_id} = this.state;
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
              {favorites.length > 0 ? (
                <View>
                  <FlatList
                    onScroll={(e) => this.onScrollFlatList(e)}
                    scrollEventThrottle={400}
                    onMomentumScrollEnd={(e) => this.onScrollFlatList(e)}
                    data={favorites}
                    renderItem={({item, index}) => (
                      <FeedItem
                        name="favorite"
                        readAll={this.readAll}
                        readCurrent={this.readCurrent}
                        navigation={this.props.navigation}
                        key={`favorite-${item.id}`}
                        item={item}
                        index={index}
                        user_id={user_id}
                        onFavoriteClick={this.onFavoriteClick}
                      />
                    )}
                    keyExtractor={(item) => `${item.id}`}
                  />
                </View>
              ) : (
                <View style={styles.row}>
                  <Text style={styles.text}>Don't have updates!</Text>
                </View>
              )}
              {loading ? (
                <View style={styles.loader}>
                  <ActivityIndicator size="large" color={CONTENT_COLOR} />
                </View>
              ) : (
                <></>
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
    top: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
