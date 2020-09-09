import {TouchableOpacity, SafeAreaView, ScrollView, StyleSheet, Text} from 'react-native';
import React from 'react';
import {BACKGROUND_COLOR, BORDER_COLOR, BORDER_RADIUS, BORDER_WIDTH, CONTENT_COLOR} from '../theme';

const setTouchableOpacityColor = (cond) => {
  return cond ? CONTENT_COLOR : 'white';
};

const setTextColor = (cond) => {
  return cond ? 'white' : CONTENT_COLOR;
};

const CustomListView = ({list, onClickListElement, name}) => {
  return (
    <SafeAreaView style={styles.safeAreaViewStyle}>
      <ScrollView
        style={styles.footerWrapperNC}
        contentContainerStyle={[styles.footerWrapper]}
        keyboardShouldPersistTaps={'handled'}>
        {list.map((item, index) => (
          <TouchableOpacity
            activeOpacity={0.5}
            key={item.id}
            style={[styles.list_element, {backgroundColor: setTouchableOpacityColor(item.selected)}]}
            onPress={() => onClickListElement(name, item, index, !item.selected)}>
            <Text style={[styles.text_list, {color: setTextColor(item.selected)}]}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaViewStyle: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    color: CONTENT_COLOR,
  },
  footerWrapperNC: {
    flexDirection: 'column',
    borderWidth: BORDER_WIDTH,
    borderRadius: 5,
    borderColor: BORDER_COLOR,
    padding: 3,
  },
  footerWrapper: {
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  list_element: {
    margin: 3,
    borderColor: BORDER_COLOR,
    borderWidth: BORDER_WIDTH,
    borderRadius: BORDER_RADIUS,
  },
  text_list: {
    paddingLeft: 4,
    paddingRight: 4,
    fontSize: 20,
  },
});

export default CustomListView;
