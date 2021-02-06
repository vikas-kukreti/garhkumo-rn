import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

const allClickHandler = props => {
  props.props.navigation.navigate(props.menuName);
};
const HomeIcon = props => {
  return (
    <View style={styles.iconContainer} renderToHardwareTextureAndroid={true}>
      <TouchableOpacity
        onPress={() => allClickHandler(props)}
        style={styles.iconOption}
      >
        <FontAwesome name={props.name} size={22} style={styles.icon} />
      </TouchableOpacity>
      <Text style={styles.iconText}>{props.Title}</Text>
    </View>
  );
};
export default HomeIcon;

const styles = StyleSheet.create({
  iconContainer: {
    paddingLeft:2,
  },

  iconOption: {
    flex: 1,
    width: 45,
    height: 45,
    justifyContent: "space-around",
    borderRadius: 100,
    backgroundColor:'#17A7F1', //"rgba(70,50,147,1)",
    alignItems: "center"
  },
  icon: {
    color: "#f0f0f0"
  },
  iconText: {
    fontFamily: "sans-serif-thin",
    fontWeight: "700",
    color: "rgba(0,0,40,0.6)",
    fontSize: 11,
    textAlign: "center"
  }
});
