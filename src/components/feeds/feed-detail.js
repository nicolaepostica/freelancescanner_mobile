import React from 'react';
import {View, Text, ScrollView, StyleSheet, Linking, TouchableOpacity} from 'react-native';
import {
  BACKGROUND_COLOR,
  BORDER_COLOR,
  BORDER_RADIUS,
  BORDER_WIDTH,
  CONTENT_COLOR,
  FONT_FAMILY,
  FONT_FAMILY_BOLD,
  FONT_SIZE,
  FONT_SIZE_TITLE,
} from '../theme';

const FeedDetail = ({
  route: {
    params: {title, country, type, budget_minimum, budget_maximum, sign, description, skill_list, seo_url},
  },
}) => {
  return (
    <ScrollView style={styles.scroll}>
      <View style={{flex: 1}}>
        <View style={styles.footerWrapper}>
          <Text style={styles.text_title}>{title}</Text>
        </View>
        <View style={styles.footerWrapper}>
          <Text style={styles.text_title}>
            Country:
            <Text style={styles.text}>{' ' + country}</Text>
          </Text>
        </View>
        <View style={styles.footerWrapper}>
          <Text style={styles.text_title}>
            Project type:
            <Text style={styles.text}>{' ' + type}</Text>
          </Text>
        </View>
        <View style={styles.footerWrapper}>
          <Text style={styles.text_title}>
            Budget:
            <Text style={styles.text}>
              {' ' + budget_minimum}-{budget_maximum} {sign}
            </Text>
          </Text>
        </View>
        <View style={styles.footerWrapper}>
          <Text style={styles.text_title}>
            Skills:
            {skill_list.map((skill, index_skill) =>
              skill_list.length !== index_skill + 1 ? (
                <Text key={`skill-${index_skill}`} style={styles.text}>
                  {' ' + skill.name},
                </Text>
              ) : (
                <Text key={`skill-${index_skill}`} style={styles.text}>
                  {' ' + skill.name}
                </Text>
              ),
            )}
          </Text>
        </View>
        <View style={styles.footerWrapper}>
          <Text style={styles.text_title}>
            Description:
            <Text style={styles.textDescription}>{' ' + description}</Text>
          </Text>
        </View>
        <View style={styles.linkView}>
          <TouchableOpacity
            style={[styles.buttonContainer, styles.loginButton]}
            activeOpacity={0.5}
            onPress={() => Linking.openURL(seo_url)}>
            <Text style={styles.link}>LINK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: {
    color: CONTENT_COLOR,
    fontSize: 20,
  },
  text: {
    color: CONTENT_COLOR,
    fontFamily: FONT_FAMILY,
    fontSize: FONT_SIZE,
  },
  link: {
    paddingBottom: 5,
    paddingLeft: 15,
    color: BACKGROUND_COLOR,
    fontSize: FONT_SIZE,
    fontFamily: FONT_FAMILY_BOLD,
  },
  buttonContainer: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
    backgroundColor: CONTENT_COLOR,
  },
  linkView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  textDescription: {
    color: CONTENT_COLOR,
    fontSize: FONT_SIZE,
    paddingLeft: 15,
  },
  scroll: {
    backgroundColor: BACKGROUND_COLOR,
    padding: 5,
  },
  block: {
    marginTop: 5,
    paddingBottom: 5,
    borderBottomColor: BORDER_COLOR,
    borderBottomWidth: BORDER_WIDTH,
  },
  footerWrapper: {
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  text_title: {
    color: CONTENT_COLOR,
    paddingLeft: 4,
    paddingRight: 4,
    fontSize: FONT_SIZE_TITLE,
    fontFamily: FONT_FAMILY_BOLD,
  },
});

export default FeedDetail;
