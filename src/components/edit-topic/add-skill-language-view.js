import {TouchableOpacity, SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import {Text} from 'react-native-elements';
import React from 'react';
import {BACKGROUND_COLOR, BORDER_COLOR, BORDER_RADIUS, BORDER_WIDTH, CONTENT_COLOR, FONT_FAMILY} from '../theme';

const getScrollPosition = ({layoutMeasurement, contentOffset, contentSize}) => {
  if (contentOffset.y === 0) {
    return 0;
  } else {
    return (layoutMeasurement.height + contentOffset.y + 200) / contentSize.height;
  }
};

const setTouchableOpacityColor = (cond) => {
  return cond ? CONTENT_COLOR : 'white';
};

const setTextColor = (cond) => {
  return cond ? 'white' : CONTENT_COLOR;
};

const RenderItem = ({item, index, onValueChange}) => (
  <TouchableOpacity
    activeOpacity={0.8}
    index={index}
    style={[styles.list_element, {backgroundColor: setTouchableOpacityColor(item.selected)}]}
    onPress={() => onValueChange(index, !item.selected, item.id)}>
    <Text style={[styles.text_list, {color: setTextColor(item.selected)}]}>{item.name}</Text>
  </TouchableOpacity>
);

const AddSkillLanguageView = ({list, onValueChange, slice, onScroll}) => {
  const onScrollScrollView = ({nativeEvent}) => {
    if (getScrollPosition(nativeEvent) > 1) {
      onScroll();
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaViewStyle}>
      <ScrollView
        scrollEventThrottle={200}
        style={styles.listStyle}
        contentContainerStyle={[styles.footerWrapper]}
        onMomentumScrollEnd={(e) => onScrollScrollView(e)}
        keyboardShouldPersistTaps={'handled'}>
        {list.slice(0, slice).map((item, index) => (
          <RenderItem key={item.id} item={item} index={index} onValueChange={onValueChange} />
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
  listStyle: {
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
    borderRadius: BORDER_RADIUS,
    borderColor: BORDER_COLOR,
    borderWidth: 1,
  },
  text_list: {
    paddingLeft: 4,
    paddingRight: 4,
    fontSize: 20,
    fontFamily: FONT_FAMILY,
  },
});

export default AddSkillLanguageView;
