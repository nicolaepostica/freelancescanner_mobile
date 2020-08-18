import {StyleSheet, View, TextInput, Text} from 'react-native';
import React from 'react';
import {CONTENT_COLOR, CONTENT_INACTIVE_COLOR, FONT_FAMILY, FONT_SIZE} from '../theme';

const PriceRange = ({
  color,
  price_low_placeholder,
  editable,
  price_low,
  price_high_placeholder,
  price_low_type,
  price_high_type,
  price_high,
  onChange,
}) => {
  return (
    <View style={styles.from_to}>
      <View style={styles.from_to_text_view}>
        <Text style={[styles.text, {color: color}]}>From</Text>
      </View>
      <View style={styles.from_to_input_view}>
        <TextInput
          keyboardType={'number-pad'}
          style={[styles.from_to_input, {color: color, borderColor: color}]}
          inputStyle={styles.textColor}
          placeholder={price_low_placeholder}
          placeholderTextColor={CONTENT_INACTIVE_COLOR}
          editable={editable}
          value={price_low ? price_low.toString() : ''}
          onChangeText={(text) => onChange({value: text}, {type: price_low_type})}
        />
      </View>
      <View style={styles.from_to_text_view}>
        <Text style={[styles.text, {color: color}]}>to</Text>
      </View>
      <View style={styles.from_to_input_view}>
        <TextInput
          keyboardType={'number-pad'}
          style={[styles.from_to_input, {color: color, borderColor: color}]}
          inputStyle={styles.textColor}
          placeholder={price_high_placeholder}
          placeholderTextColor={CONTENT_INACTIVE_COLOR}
          editable={editable}
          value={price_high ? price_high.toString() : ''}
          onChangeText={(text) => onChange({value: text}, {type: price_high_type})}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  from_to: {
    marginTop: -15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  from_to_input: {
    marginLeft: 15,
    marginRight: 15,
    height: 40,
    borderBottomWidth: 1,
  },
  from_to_input_view: {
    color: CONTENT_COLOR,
    flex: 1,
  },
  from_to_text_view: {
    paddingLeft: 5,
    justifyContent: 'center',
  },
  text: {
    fontFamily: FONT_FAMILY,
    fontSize: FONT_SIZE,
    borderBottomColor: 'black',
  },
  textColor: {
    fontFamily: FONT_FAMILY,
    fontSize: FONT_SIZE,
    color: CONTENT_COLOR,
  },
});

export default PriceRange;
