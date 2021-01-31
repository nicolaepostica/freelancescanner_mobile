import React, {Component} from 'react';
import {View, StyleSheet, Image, TextInput, TouchableOpacity, Text} from 'react-native';
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

export default class AddLanguage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      filter_id: null,
      title: 'Add languages',
      search: '',
      showLoading: false,
      slice: 50,
      languageAll: [],
      languageList: [],
      toEditLanguages: [],
    };
    this.api = null;
  }

  componentDidMount() {
    this._initSettings();
  }

  _initSettings = () => {
    AsyncStorage.multiGet(['userToken', 'filter_id']).then(async ([[[], userToken], [[], filter_id]]) => {
      this.setState({token: userToken, filter_id: Number(filter_id)});
      this.api = new ApiService(userToken);
      const languages = await this.api.getLanguages();
      this.setState({languageList: languages, languageAll: languages});
    });
  };

  AddLanguageClick = (index, selected, id) => {
    this.setState(
      {
        languageList: update(this.state.languageList, {
          [index]: {selected: {$set: selected}},
        }),
        languageAll: update(this.state.languageAll, {
          [id - 1]: {selected: {$set: selected}},
        }),
      },
      () => {
        const language = this.state.languageList[index];
        const languageInEdit = this.state.toEditLanguages.find((n) => n.id === language.id);
        if (languageInEdit) {
          const languageIndex = this.state.toEditLanguages.map((m) => m.id).indexOf(language.id);
          this.setState(({toEditLanguages}) => {
            toEditLanguages.splice(languageIndex, 1);
            return {toEditLanguages: toEditLanguages};
          });
        } else {
          this.setState(({toEditLanguages}) => {
            return {toEditLanguages: [...toEditLanguages, language]};
          });
        }
      },
    );
  };

  saveEditedLanguages = () => {
    axios
      .post(
        `${BASE_URL}/api/v1/manage-languages/`,
        {
          list: this.state.toEditLanguages,
          filter_id: this.state.filter_id,
        },
        {headers: {Authorization: this.state.token}},
      )
      .then(() => this.setState({toEditLanguages: []}));
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
    this.setState({search: text});
    const results = this.search(text, this.state.languageAll);
    this.setState({languageList: results});
  };

  render() {
    const {search, languageList, slice, toEditLanguages} = this.state;
    return (
      <View style={styles.container}>
        <View style={{flexDirection: 'row'}}>
          <View style={styles.searchView}>
            <View style={styles.searchArrow}>
              <Image style={styles.icon} source={require('../../resources/icons/search.png')} />
            </View>
            <View style={styles.searchBarView}>
              <TextInput
                autoFocus={false}
                returnKeyType="done"
                style={styles.inputs}
                placeholder="Enter language ..."
                underlineColorAndroid="transparent"
                value={search}
                onChangeText={this.onChangeSearch}
              />
            </View>
            {toEditLanguages.length > 0 ? (
              <TouchableOpacity style={styles.saveButton} onPress={this.saveEditedLanguages}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            ) : (
              <></>
            )}
          </View>
        </View>
        <View style={styles.view_list_language}>
          <AddSkillLanguageView list={languageList} onValueChange={this.AddLanguageClick} slice={slice} />
        </View>
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
    flex: 1,
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
  view_list_language: {
    flex: 1,
  },
  saveButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS,
    borderWidth: BORDER_WIDTH,
    borderColor: BORDER_COLOR,
    backgroundColor: CONTENT_COLOR,
    flexDirection: 'row',
    height: 30,
    width: 50,
    marginTop: 12,
    marginBottom: 5,
    marginLeft: 5,
  },
  saveButtonText: {
    color: BACKGROUND_COLOR,
    fontFamily: FONT_FAMILY,
    fontSize: FONT_SIZE,
    borderBottomColor: '#fff',
  },
});
