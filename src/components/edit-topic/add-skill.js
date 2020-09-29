import React, {Component} from 'react';
import {View, StyleSheet, Image, TextInput} from 'react-native';
import 'react-native-gesture-handler';
import AddSkillLanguageView from './add-skill-language-view';
import update from 'immutability-helper';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import {BASE_URL} from '../constants';
import {
  BACKGROUND_COLOR,
  BORDER_COLOR,
  BORDER_RADIUS,
  BORDER_WIDTH,
  CONTENT_COLOR,
  FONT_FAMILY,
  FONT_SIZE,
} from '../theme';
import {ApiService} from '../../services/api-service';
import {Loader} from '../spinner';

export default class AddSkill extends Component {
  constructor(props) {
    super(props);
    this.state = {
      init: true,
      token: '',
      filter_id: null,
      title: 'Add skills',
      search: '',
      showLoading: false,
      slice: 50,
      skillAll: [],
      skillList: [],
    };
    this.api = null;
  }

  componentDidMount() {
    this._initSettings();
  }

  _initSettings() {
    AsyncStorage.multiGet(['userToken', 'filter_id']).then(async ([[[], userToken], [[], filter_id]]) => {
      this.setState({token: userToken, filter_id: Number(filter_id)});
      this.api = new ApiService(userToken);
      const skills = await this.api.getSkills();
      this.setState({skillList: skills, skillAll: skills, init: false});
    });
  }

  AddSkillClick = (index, selected, id) => {
    this.setState(
      {
        skillList: update(this.state.skillList, {
          [index]: {selected: {$set: selected}},
        }),
        skillAll: update(this.state.skillAll, {
          [id - 1]: {selected: {$set: selected}},
        }),
      },
      () => {
        axios.post(
          `${BASE_URL}/api/v1/manage-skills/`,
          {
            list: [this.state.skillList[index]],
            filter_id: this.state.filter_id,
          },
          {headers: {Authorization: this.state.token}},
        );
      },
    );
  };

  search(nameKey, myArray) {
    const results = [];
    for (let i = 0; i < myArray.length; i++) {
      if (myArray[i].name.toUpperCase().indexOf(nameKey.toUpperCase()) > -1) {
        results.push(myArray[i]);
      }
    }
    return results;
  }

  onChangeSearch = (text) => {
    this.setState({search: text, slice: 50});
    const results = this.search(text, this.state.skillAll);
    this.setState({skillList: results});
  };

  onScroll = () => {
    this.setState(({slice}) => ({slice: slice + 50}));
  };

  render() {
    const {search, skillList, slice, init} = this.state;
    return (
      <View style={styles.container}>
        {init ? (
          <Loader />
        ) : (
          <>
            <View style={styles.searchView}>
              <View style={styles.searchArrow}>
                <Image style={styles.icon} source={require('../../resources/icons/search.png')} />
              </View>
              <View style={styles.searchBarView}>
                <TextInput
                  autoFocus={false}
                  returnKeyType="done"
                  style={styles.inputs}
                  placeholder="Enter skill ..."
                  underlineColorAndroid="transparent"
                  value={search}
                  onChangeText={this.onChangeSearch}
                />
              </View>
            </View>
            <View style={styles.view_list_skill}>
              <AddSkillLanguageView
                list={skillList}
                onValueChange={this.AddSkillClick}
                slice={slice}
                onScroll={this.onScroll}
              />
            </View>
          </>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 0,
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    color: CONTENT_COLOR,
  },
  searchView: {
    borderRadius: BORDER_RADIUS,
    borderWidth: BORDER_WIDTH,
    borderColor: BORDER_COLOR,
    backgroundColor: BACKGROUND_COLOR,
    flexDirection: 'row',
    height: 45,
    marginTop: 5,
    marginBottom: 5,
  },
  inputs: {
    color: CONTENT_COLOR,
    fontFamily: FONT_FAMILY,
    fontSize: FONT_SIZE,
    height: 45,
    borderBottomColor: '#fff',
    flex: 1,
  },
  searchBarView: {
    flex: 1,
  },
  searchArrow: {
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginLeft: 10,
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: CONTENT_COLOR,
  },
  view_list_skill: {
    flex: 1,
  },
});
