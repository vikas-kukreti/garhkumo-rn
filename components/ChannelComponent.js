import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import ChannelCard from "./layout/ChannelCard";
import { FlatList } from "react-native-gesture-handler";
import ApiHandelComponent from "./handler/ApiHandelComponent";
import Searchbtn from './layout/Searchbtn';
import Preloader from './layout/Preloader';

var fromLimit = 0; //kha se start ho

const ChannelComponent = props => {
  const [channelData, setChannelData] = useState({
    channelList: [],
    loading: true,
  })
  const toLimit = 40; //per page kitne item
  const limitOrder = "D"; //D=DESC, A=ASC

  const channelUrl =
    ApiHandelComponent.channelList.url +
    fromLimit +
    "/" +
    toLimit +
    "/" +
    limitOrder;

  useEffect(() => {
    fetch(channelUrl)
      .then(response => response.json())
      .then(responseJson => {
        setChannelData({ channelList: [...channelData.channelList, ...responseJson], loading: false })
      })
      .catch(() => {
      });
  }, []);

  const _loadMoreData = () => {
    fromLimit += 40;
    fetch(channelUrl)
      .then(response => response.json())
      .then(responseJson => {
        setChannelData({ channelList: [...channelData.channelList, ...responseJson]})
      })
      .catch(() => {
      });
  }
    return (
      <View>
        <Preloader data={channelData.loading} />
        <FlatList
          onEndReached={() => _loadMoreData()} 
          renderToHardwareTextureAndroid={true}
          removeClippedSubviews={true}
          maxToRenderPerBatch={20}
          showsVerticalScrollIndicator={false}
          updateCellsBatchingPeriod={100}
          windowSize={25}
          ena
          style={styles.songList}
          numColumns={4}
          keyExtractor={channel => channel.c_id + Math.floor(Math.random() * (20 - 0 + 1) ) + 0}
          data={channelData.channelList}
          renderItem={channel => {
            return (
              <ChannelCard data={channel} nav={props.navigation} />
            );
          }}
        />
      </View>
    );
};
ChannelComponent.navigationOptions=({ navigation }) => {
  const { navigate } = navigation;
  return {
  headerTitle: 'Our Channel',
    headerRight: () => <Searchbtn navigate={navigate} />

  }
}
export default ChannelComponent;
const styles = StyleSheet.create({
  container: {},
  cradContainer: {
    padding: 2
  },
  songList: {
    marginTop: 2
  }
});
