import React from 'react';
import { Text, View, StyleSheet, Image, ToastAndroid } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';

const NotificationPlayerComponent = () => {
    const backWordBtnHandler = () => {
        ToastAndroid.show('Back Word Btn', ToastAndroid.SHORT);
    }
    const playBtnHandler = () => {
        ToastAndroid.show('Play Btn', ToastAndroid.SHORT);
    }
    const forWordBtnHandler = () => {
        ToastAndroid.show('For Word Btn', ToastAndroid.SHORT);
    }
    return (
        <View  renderToHardwareTextureAndroid={true} style={styles.container}>
            <View style={styles.innerContainer}>
                <View style={styles.textContainer}>
                    <Text numberOfLines={1} style={styles.songText}> song Name</Text>
                    <Text numberOfLines={1} style={styles.artistText}> Artist Name</Text>
                </View>
                <View style={styles.btnContainer}>
                    <View style={styles.btnInnerContainer}>
                        <TouchableOpacity onPress={() => backWordBtnHandler()}>
                            <FontAwesome name="backward" style={styles.backWardBtn} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.btnInnerContainer}>
                        <View style={{ paddingHorizontal: 28, }}>
                            <TouchableOpacity style={styles.playcontainer} onPress={() => playBtnHandler()}>
                                <FontAwesome name="play" style={styles.playBtn} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.btnInnerContainer}>
                        <TouchableOpacity onPress={() => forWordBtnHandler()} >
                            <FontAwesome name="forward" style={styles.forWardBtn} />
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
            <View style={styles.thumbnailContainer}>
                <Image style={styles.thumbnail} resizeMode='cover' source={require('../../assets/listing-music.jpg')}></Image>
            </View>
        </View>
    )
}

export default NotificationPlayerComponent;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        padding: 2,
        maxHeight: 80,
        backgroundColor: '#eaefea',
        bottom:0,
        position:"absolute",
    },
    innerContainer: {
        borderBottomLeftRadius: 5,
        borderTopLeftRadius: 5,
        flexDirection: "column",
        backgroundColor: '#fff',
        flex: 3,
    },
    textContainer: {
        paddingHorizontal: 5,
        flexDirection: 'column',
    },
    songText: {
        padding: 2,
        fontSize: 12,
        fontWeight: "bold",
    },
    artistText: {
        padding: 2,
        fontSize: 10,
    },
    btnContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
    },
    btnInnerContainer: {
        flex: 1,
        justifyContent: "center",
    },
    backWardBtn: {
        textAlign: "right",
        fontSize: 15,
    },
    playcontainer: {
        backgroundColor: '#eaeaef',
        borderRadius: 50,
        padding: 3,
        height: 30,
        width: 30,
        justifyContent: "space-around",
    },
    playBtn: {
        textAlign: "center",
        fontSize: 18,
        paddingLeft: 5,
    },
    forWardBtn: {
        textAlign: "left",
        fontSize: 15,
    },
    thumbnailContainer: {
        flex: 1,
    },
    thumbnail: {
        width: null,
        height: 76,
        borderBottomRightRadius: 5,
        borderTopRightRadius: 5,
    }


})