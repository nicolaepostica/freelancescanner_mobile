import {TouchableOpacity, StyleSheet, Text, Alert, View, Image} from 'react-native';
import React from 'react';
import {
  BACKGROUND_COLOR,
  BACKGROUND_LINE_COLOR,
  BORDER_RADIUS,
  BORDER_WIDTH,
  CONTENT_COLOR,
  FONT_FAMILY,
  FONT_FAMILY_BOLD,
  FONT_SIZE,
  FONT_SIZE_TITLE,
} from '../theme';

const favoriteIcon = require('../../resources/icons/heart-solid.png');
const unFavoriteIcon = require('../../resources/icons/heart-regular.png');

const NavigateToDetail = (name, item, index, navigation, readCurrent) => {
  if (item.is_new) {
    readCurrent({name: name, item: item, index: index});
  }
  navigation.navigate('NotificationDetail', {...item.project_data});
};

const onLongPress = (name, item, index, readCurrent, readAll) => {
  if (item.is_new) {
    Alert.alert(
      'Are You sure to',
      'Mark as read?',
      [
        {text: 'all', onPress: () => readAll()},
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel'),
          style: 'destructive',
        },
        {
          text: 'current',
          onPress: () => readCurrent({name: name, item: item, index: index}),
        },
      ],
      {cancelable: false},
    );
  }
};

const datetimeFormater = (time) => {
  return `${time}`.length === 2 ? `${time}` : `0${time}`;
};
const datetimeTemplate = (local_time) => {
  const hour = datetimeFormater(local_time.getHours());
  const minute = datetimeFormater(local_time.getMinutes());
  const date = datetimeFormater(local_time.getDate());
  const month = datetimeFormater(local_time.getMonth());
  const fullYear = local_time.getFullYear();
  return `${hour}:${minute} ${date}-${month}-${fullYear}`;
};

const FeedItem = ({name, item, index, readCurrent, readAll, navigation, itemStyle, user_id, onFavoriteClick}) => {
  const {id: project_id, title, budget_minimum, budget_maximum, sign, skill_list, time, favorite} = item.project_data;
  const local_time = new Date(time);
  const str_time = datetimeTemplate(local_time);
  return (
    <TouchableOpacity
      onPress={() => NavigateToDetail(name, item, index, navigation, readCurrent)}
      onLongPress={() => onLongPress(name, item, index, readCurrent, readAll)}
      activeOpacity={1}
      style={[styles.list_element, itemStyle]}>
      {item.is_new ? (
        <View style={styles.isNewContainer}>
          <View style={{flex: 1}}>
            <Text style={styles.text_title}>{title}</Text>
          </View>
          <View
            style={{
              backgroundColor: 'red',
              borderRadius: BORDER_RADIUS,
              top: 3,
              right: 3,
              width: 10,
              height: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
        </View>
      ) : (
        <Text style={styles.text_title}>{title}</Text>
      )}
      <View style={styles.isNewContainer}>
        <View style={styles.footerWrapper}>
          <Text style={styles.text_title}>Budget:</Text>
          <Text style={styles.text}>
            {budget_minimum} - {budget_maximum} {sign}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => onFavoriteClick({name, index, project_id, user_id, item_id: item.id, favorite: !favorite})}>
          <Image style={styles.favoriteImage} source={favorite ? favoriteIcon : unFavoriteIcon} />
        </TouchableOpacity>
      </View>
      <View style={styles.footerWrapper}>
        <Text style={styles.text_title}>Skills:</Text>
        {skill_list.map((skill, index_skill) =>
          skill_list.length !== index_skill + 1 ? (
            <Text key={`skill_index-${index_skill}`} style={styles.text}>
              {skill.name},
            </Text>
          ) : (
            <Text key={`skill_index-${index_skill}`} style={styles.text}>
              {skill.name}
            </Text>
          ),
        )}
      </View>
      <View style={styles.timeStamp}>
        <Text style={styles.text}>{str_time}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  isNewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  timeStamp: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  list_element: {
    margin: 3,
    borderColor: BACKGROUND_LINE_COLOR,
    borderWidth: BORDER_WIDTH,
    borderRadius: 10,
  },
  text: {
    color: CONTENT_COLOR,
    paddingLeft: 4,
    paddingRight: 4,
    fontSize: FONT_SIZE,
    fontFamily: FONT_FAMILY,
  },
  text_title: {
    color: CONTENT_COLOR,
    paddingLeft: 4,
    paddingRight: 4,
    fontSize: FONT_SIZE_TITLE,
    fontFamily: FONT_FAMILY_BOLD,
  },
  row: {
    height: 300,
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
  favoriteImage: {
    right: 10,
    width: 24,
    height: 24,
    tintColor: CONTENT_COLOR,
  },
});

export {FeedItem};
