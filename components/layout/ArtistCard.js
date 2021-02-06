import React from "react";
import { Text, View, Image, StyleSheet, Share } from "react-native";
import ApiHandelComponent from "../handler/ApiHandelComponent";
import { TouchableOpacity } from "react-native-gesture-handler";
import ShareHandlerComponent from "../handler/ShareHandlerComponent";

const ArtistCard = props => {
    const artist = props.data;  

  const artistClickHandler = (artistId,artistName) => {
   props.nav.navigate("ArtistMenu", { artistID: artistId,artistName:artistName });    
  };
  const shareBtnHandler = (artistID, name) => {
    const shareUrl = ShareHandlerComponent.artistShare.url + artistID + "/" + name;
    Share.share({
      message: shareUrl
    });
  };
  
  return (
    <TouchableOpacity  renderToHardwareTextureAndroid={true}
      key={artist.ar_id}
      onPress={() => artistClickHandler(artist.ar_id,artist.ar_name)}
      onLongPress={() => shareBtnHandler(artist.ar_id, artist.ar_name)}
      style={styles.cradContainer}
    >
      <View style={styles.card}>
        <View
          style={{ borderRadius: 10000, backgroundColor: "#eaeaef" }}
          key="aImg"
        >
          <Image
            fadeDuration={0}
            resizeMode="contain"
            source={{
              uri: ApiHandelComponent.artistImage.url + artist.ar_img
            }}
            style={styles.cardImage}
          />
        </View>
        <Text style={styles.cardText} numberOfLines={2}>
          {artist.ar_name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
export default ArtistCard;

const styles = StyleSheet.create({
  cradContainer: {
    padding: 1
  },
  card: {
    padding: 2
  },
  cardImage: {
    width: 84,
    height: 84,
    borderRadius: 300
  },
  cardText: {
    textAlign: "center",
    width: 84,
    flexGrow: 1,
    fontSize: 10,
    flex: 1
  }
});
