import React, {Component} from 'react';
import {View, Image, Switch, StyleSheet, TouchableOpacity, Text, StatusBar} from 'react-native';
import 'react-native-gesture-handler';
import PriceRange from './price-range';
import CustomListView from './custom-list-view';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import update from 'immutability-helper';
import {Loader} from '../spinner';
import {BASE_URL} from '../constants';
import {
  HEADER_COLOR,
  FONT_FAMILY_BOLD,
  FONT_SIZE,
  BACKGROUND_COLOR,
  CONTENT_COLOR,
  SWITCH_ON_COLOR,
  SWITCH_OFF_COLOR,
  CONTENT_INACTIVE_COLOR,
} from '../theme';

export default class EditTopic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: 'Freelance Settings',
      fixed_projects_price_color: SWITCH_OFF_COLOR,
      hourly_projects_price_color: SWITCH_OFF_COLOR,
      token: '',
      toDeleteSkill: false,
      toDeleteLanguage: false,
      trashIcon: '',
      isNavigate: true,
      filter: {
        fixed_projects: false,
        hourly_projects: false,
        fixed_price_low: null,
        fixed_price_high: null,
        hourly_price_low: null,
        hourly_price_high: null,
        skill_list: [],
        language_list: [],
      },
      loading: true,
      switchSilent: false,
      silentColor: CONTENT_INACTIVE_COLOR,
    };
  }
  componentDidMount() {
    this._initSettings();
    this.props.navigation.addListener('focus', () => {
      if (!this.state.loading) {
        this._getFilterUpdate();
      }
    });
  }

  _initSettings() {
    AsyncStorage.multiGet(['userToken', 'filter_id', 'switchSilent']).then(
      ([[[], userToken], [[], filter_id], [[], switchSilent]]) => {
        switchSilent = switchSilent === 'true';
        const silentColor = switchSilent ? CONTENT_COLOR : CONTENT_INACTIVE_COLOR;
        this.setState({token: userToken, filter_id: Number(filter_id), switchSilent, silentColor});
        this._getFilterUpdate();
      },
    );
  }

  _getFilterUpdate = () => {
    axios
      .get(`${BASE_URL}/api/v1/filter/${this.state.filter_id}/`, {
        headers: {Authorization: this.state.token},
      })
      .then(({data}) => {
        this.setState(
          {
            switchMute: data.enable_notification,
            filter: data,
            loading: false,
          },
          () => this.toDeleteChecker(),
        );
        this._setColor(data.fixed_projects, 'fixed_projects');
        this._setColor(data.hourly_projects, 'hourly_projects');
      });
  };

  _setColor = (value, target) => {
    if (target === 'fixed_projects') {
      value
        ? this.setState({fixed_projects_price_color: CONTENT_COLOR})
        : this.setState({fixed_projects_price_color: CONTENT_INACTIVE_COLOR});
    } else if (target === 'hourly_projects') {
      value
        ? this.setState({hourly_projects_price_color: CONTENT_COLOR})
        : this.setState({hourly_projects_price_color: CONTENT_INACTIVE_COLOR});
    }
  };

  onSwitchFixedProjects = (value) => {
    this._setColor(value, 'fixed_projects');
    this.setState(
      {
        filter: update(this.state.filter, {
          fixed_projects: {$set: value},
        }),
      },
      () => {
        axios.put(`${BASE_URL}/api/v1/filter/${this.state.filter_id}/`, this.state.filter, {
          headers: {Authorization: this.state.token},
        });
      },
    );
  };

  onSwitchHourlyProjects = (value) => {
    this._setColor(value, 'hourly_projects');
    this.setState(
      {
        filter: update(this.state.filter, {
          hourly_projects: {$set: value},
        }),
      },
      () => {
        axios.put(`${BASE_URL}/api/v1/filter/${this.state.filter_id}/`, this.state.filter, {
          headers: {Authorization: this.state.token},
        });
      },
    );
  };

  onChangeRange = ({value}, {type}) => {
    let update_value = null;
    if (value) {
      update_value = Number(value);
    }
    this.setState(
      {
        filter: update(this.state.filter, {
          [type]: {$set: update_value},
        }),
      },
      () => {
        axios.put(`${BASE_URL}/api/v1/filter/${this.state.filter_id}/`, this.state.filter, {
          headers: {Authorization: this.state.token},
        });
      },
    );
  };

  checkLanguage = () => {
    for (let index = 0; index < this.state.filter.language_list.length; index++) {
      if (!this.state.filter.language_list[index].selected) {
        this.setState({toDeleteLanguage: true});
        return true;
      }
    }
    return false;
  };

  checkSkill = () => {
    for (let index = 0; index < this.state.filter.skill_list.length; index++) {
      if (!this.state.filter.skill_list[index].selected) {
        this.setState({toDeleteSkill: true});
        return true;
      }
    }
    return false;
  };

  toDeleteChecker = () => {
    if (this.checkSkill() || this.checkLanguage()) {
      this.setState({trashIcon: 'trash', isNavigate: false});
    } else {
      this.setState({trashIcon: '', isNavigate: true});
    }
  };

  onClickListElement = (list, item, index, selected) => {
    this.setState(
      {
        filter: update(this.state.filter, {
          [list]: {
            [index]: {selected: {$set: selected}},
          },
        }),
      },
      () => {
        this.toDeleteChecker();
      },
    );
  };

  get_navigation = () => {
    if (this.state.isNavigate) {
      this.props.navigation.navigate('MainSettings');
    } else {
      this._getFilterUpdate();
      this.setState({isNavigate: true, trashIcon: ''});
    }
  };

  deleteSelectedSkillAndLanguage = () => {
    axios
      .post(
        `${BASE_URL}/api/v1/manage-skills/`,
        {
          list: this.state.filter.skill_list,
          filter_id: this.state.filter.id,
        },
        {headers: {Authorization: this.state.token}},
      )
      .then(() => {
        this._getFilterUpdate();
      });
    axios
      .post(
        `${BASE_URL}/api/v1/manage-languages/`,
        {
          list: this.state.filter.language_list,
          filter_id: this.state.filter.id,
        },
        {headers: {Authorization: this.state.token}},
      )
      .then(() => {
        this._getFilterUpdate();
      });
  };

  _setSwitchSilent = (state) => {
    AsyncStorage.setItem('switchSilent', state.toString());
  };

  render() {
    return (
      <View style={styles.root}>
        <StatusBar backgroundColor={HEADER_COLOR} barStyle="light-content" />
        {this.state.loading ? (
          <Loader />
        ) : (
          <View style={styles.container}>
            <View style={styles.title}>
              <RemoveItems icon={this.state.trashIcon} onDelete={this.deleteSelectedSkillAndLanguage} />
            </View>
            <View style={styles.descriptions}>
              <View>
                <Text style={styles.text}>Skill's list:</Text>
              </View>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('AddSkill')} activeOpacity={0.5}>
                <Image style={styles.icon} source={require('../../resources/icons/plus.png')} />
              </TouchableOpacity>
            </View>
            <View style={styles.view_list_skill}>
              <CustomListView
                name={'skill_list'}
                list={this.state.filter.skill_list}
                onClickListElement={this.onClickListElement}
              />
            </View>
            <View style={styles.descriptions}>
              <Text h4 style={styles.text}>
                Languages:
              </Text>
              <TouchableOpacity activeOpacity={0.5} onPress={() => this.props.navigation.navigate('AddLanguage')}>
                <Image style={styles.icon} source={require('../../resources/icons/plus.png')} />
              </TouchableOpacity>
            </View>
            <View style={[styles.view_list_lang, {zIndex: 0}]}>
              <CustomListView
                name={'language_list'}
                list={this.state.filter.language_list}
                onClickListElement={this.onClickListElement}
              />
            </View>
            <View style={styles.descriptions}>
              <View>
                <Text style={[styles.fixed_hourly_text, {color: this.state.fixed_projects_price_color}]}>
                  Fixed price
                </Text>
              </View>
              <View>
                <Switch
                  trackColor={{true: SWITCH_ON_COLOR, false: SWITCH_OFF_COLOR}}
                  thumbColor={'#FFF'}
                  onValueChange={this.onSwitchFixedProjects}
                  value={this.state.filter.fixed_projects}
                />
              </View>
            </View>
            <PriceRange
              price_low_placeholder={'250'}
              price_high_placeholder={'1500'}
              price_low={this.state.filter.fixed_price_low}
              price_high={this.state.filter.fixed_price_high}
              price_low_type={'fixed_price_low'}
              price_high_type={'fixed_price_high'}
              color={this.state.fixed_projects_price_color}
              editable={this.state.filter.fixed_projects}
              onChange={this.onChangeRange}
            />
            <View style={styles.descriptions}>
              <View>
                <Text style={[styles.fixed_hourly_text, {color: this.state.hourly_projects_price_color}]}>
                  Hourly price
                </Text>
              </View>
              <View>
                <Switch
                  trackColor={{true: SWITCH_ON_COLOR, false: SWITCH_OFF_COLOR}}
                  thumbColor={'#FFF'}
                  onValueChange={this.onSwitchHourlyProjects}
                  value={this.state.filter.hourly_projects}
                />
              </View>
            </View>
            <PriceRange
              price_low_placeholder={'15'}
              price_high_placeholder={'50'}
              price_low={this.state.filter.hourly_price_low}
              price_high={this.state.filter.hourly_price_high}
              price_low_type={'hourly_price_low'}
              price_high_type={'hourly_price_high'}
              color={this.state.hourly_projects_price_color}
              editable={this.state.filter.hourly_projects}
              onChange={this.onChangeRange}
            />
          </View>
        )}
      </View>
    );
  }
}

const RemoveItems = ({icon, onDelete}) => {
  let trash_icon = null;
  if (icon === 'trash') {
    trash_icon = require('../../resources/icons/trash.png');
  }
  if (trash_icon) {
    return (
      <TouchableOpacity onPress={() => onDelete()}>
        <Image style={styles.image} source={trash_icon} />
      </TouchableOpacity>
    );
  }
  return null;
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingBottom: 10,
    paddingTop: 10,
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    color: CONTENT_COLOR,
  },
  title: {
    margin: 20,
    alignItems: 'center',
    position: 'absolute',
    justifyContent: 'center',
    width: '100%',
  },
  image: {
    width: 24,
    height: 24,
    tintColor: 'red',
  },
  title_text: {
    fontSize: 20,
    color: CONTENT_COLOR,
  },
  text: {
    fontFamily: FONT_FAMILY_BOLD,
    fontSize: FONT_SIZE,
    color: CONTENT_COLOR,
  },
  fixed_hourly_text: {
    fontFamily: FONT_FAMILY_BOLD,
    fontSize: FONT_SIZE,
  },
  view_list_lang: {
    flex: 1,
  },
  view_list_skill: {
    flex: 1,
  },
  topic: {
    flexDirection: 'row',
    borderRadius: 5,
    backgroundColor: BACKGROUND_COLOR,
    justifyContent: 'space-between',
  },
  descriptions: {
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: CONTENT_COLOR,
  },
});
