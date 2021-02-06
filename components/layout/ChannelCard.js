import React from "react";
import { Text, View, Image, StyleSheet, Share } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import ShareHandlerComponent from "../handler/ShareHandlerComponent";

const ChannelCard = props => {
  const channel = props.data;

  const channelClickHandler = (channelId,channelName) => {
   props.nav.navigate("ChannelMenu", { channelId: channelId,channelName:channelName});
  };
  const shareChannelBtnHandler = channelId => {
    const shareUrl = ShareHandlerComponent.channelShare.url + channelId;
    Share.share({
      message: shareUrl
    });
  };
  return (
    <TouchableOpacity renderToHardwareTextureAndroid={true}
      onPress={() => channelClickHandler(channel.item.c_name_id,channel.item.c_name)}
      style={styles.cradContainer}
      onLongPress={() =>
        shareChannelBtnHandler(channel.item.c_name_id)
      }
    >
      <View style={styles.card}>
        <View style={{ borderRadius: 300, backgroundColor: "#eaeaef" }}>
          <Image
          fadeDuration={0}
            resizeMode="contain"
            source={{ uri: channel.item.c_img }}
            style={styles.cardImage}
          />
        </View>

        <Text style={styles.cardText} numberOfLines={2}>
          {channel.item.c_name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
export default ChannelCard;
const styles = StyleSheet.create({
  card: {
    padding: 5
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 300
  },
  cardText: {
    textAlign: "center",
    fontSize: 10,
    width: 75,
    flexGrow: 1,
    flex: 1
  }
});
