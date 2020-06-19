import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import ChannelCard from "../layout/ChannelCard";
import Preloader from "../layout/Preloader";
import ApiHandelComponent from "../handler/ApiHandelComponent";

const ChannelView = props => {
  const fromLimit = 0; //kha se start ho
  const toLimit = 10; //per page kitne item

  const titleName = props.Title;

  const [channelList, setChannelList] = useState();
  const [loading, setLoading] = useState(true);
  const URL = ApiHandelComponent.channelRand.url + fromLimit + "/" + toLimit;

  useEffect(() => {
    fetch(URL)
      .then(response => response.json())
      .then(responseJson => {
        setChannelList(responseJson.channelResult);
        setLoading(false);
      })
      .catch(() => {
      });
  }, []);

  const allClickHandler = () => {
    const { navigate } = props.props.navigation;
    navigate("allChannel");
  };
  return (
    <View>
      <Preloader data={loading} />

      <View style={styles.OptionList}>
        <Text style={styles.OptionListView}>{titleName}</Text>
        <TouchableOpacity onPress={() => allClickHandler()}>
          <Text style={styles.OptionListAll}>All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        style={{ padding: 3 }}
        showsHorizontalScrollIndicator={false}
        renderToHardwareTextureAndroid={true}
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        showsVerticalScrollIndicator={false}
        updateCellsBatchingPeriod={100}
        windowSize={5}
        horizontal={true}
        keyExtractor={channel => channel.c_id}
        data={channelList}
        renderItem={channel => {
          return (
            <ChannelCard data={channel} nav={props.props.navigation} />
          );
        }}
      />
    </View>
  );
};
export default ChannelView;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row"
  },
  OptionList: {
    flexDirection: "row",
    marginTop: 5,
    padding: 7,
    backgroundColor: "#fff"
  },
  OptionListView: {
    fontWeight: "bold",
    padding: 5,
    flex: 6
  },
  OptionListAll: {
    fontWeight: "bold",
    padding: 5,
    flex: 1,
    textAlign: "right"
  }
});
