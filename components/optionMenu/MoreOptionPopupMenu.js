import React, { Component } from 'react';
import { Text, StyleSheet, Share, ToastAndroid } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import ShareHandlerComponent from '../handler/ShareHandlerComponent';
import {withNavigation} from 'react-navigation';
class MoreOptionPopupMenu extends Component {
    shouldComponentUpdate() {
        return false;
      }
    render() {
        const viewInfoHandler = (songId,songName) => {

            this.props.navigation.navigate('songInfo', {dataSongId:songId,songName:songName});
        }
        const shareHandler = (songId) => {
            const shareUrl = ShareHandlerComponent.songShare.url + songId;
            Share.share({
                message: shareUrl
            })
        }
        const addQueueHandler = (song) => {
            this.props.screenProps(song, null, 'add');
            ToastAndroid.show('Add Queue', ToastAndroid.SHORT);
        }
        // const dwnloadHandler = () => {
        //     ToastAndroid.show('Download', ToastAndroid.SHORT);
        // } 
        const videoPlayHandler = (songId) => {
            this.props.navigation.navigate('playVideoMenu', {dataSongId:songId} );           
        }

        return (
            <Menu>
                <MenuTrigger style={styles.menuTrigger}>
                    <MaterialIcons name="more-vert" style={styles.iconMenuTrigger} />
                </MenuTrigger>
                <MenuOptions style={styles.innerContainer}>
                    <MenuOption value={0} style={styles.menuOption} onSelect={() => viewInfoHandler(this.props.dataSongId.songId, this.props.songName)}>
                        <MaterialIcons name="visibility" style={{ ...styles.icon, ...styles.visibility }} />
                        <Text style={styles.iconText}>View Info </Text>
                    </MenuOption>
                    <MenuOption value={1} style={styles.menuOption} onSelect={() => shareHandler(this.props.dataSongId.songId)}>
                        <MaterialIcons name="share" style={{ ...styles.icon, ...styles.share }} />
                        <Text style={styles.iconText}>Share </Text>
                    </MenuOption>

                    <MenuOption value={2} style={styles.menuOption} onSelect={() => addQueueHandler(this.props.dataSongId)}>
                        <MaterialIcons name="queue-music" style={{ ...styles.icon, ...styles.queue }} />
                        <Text style={styles.iconText}>Add To Queue</Text>
                    </MenuOption>
                    {/* <MenuOption value={3} style={styles.menuOption} onSelect={() => dwnloadHandler(this.props.dataSongId)}>
                        <MaterialIcons name="get-app" style={{ ...styles.icon, ...styles.download }} />
                        <Text style={styles.iconText}>Download</Text>
                    </MenuOption> */}
                    <MenuOption value={3} style={styles.menuOption} onSelect={() => videoPlayHandler(this.props.dataSongId.songId)}>
                        <MaterialIcons name="music-video" style={{ ...styles.icon, ...styles.video }} />
                        <Text style={styles.iconText}>Video</Text>
                    </MenuOption>
                    
                </MenuOptions>
            </Menu>
        );
    }
}


export default withNavigation(MoreOptionPopupMenu) ;
const styles = StyleSheet.create({
    menuTrigger: {
        flex: 1,
    },
    iconMenuTrigger: {
        fontSize: 22,
    },
    innerContainer: {
        flexDirection: 'column',
        padding: 5,
    },
    menuOption: {
        padding: 5,
        flexDirection: 'row',
    },
    icon: {
        padding: 4,
        fontSize: 12,
        paddingEnd: 5,
    },
    iconText: {
        paddingStart: 5,
    },
    visibility: {
        color: '#FF9C33'
    },
    share: {
        color: 'blue'
    }, 
    queue: {
        color: 'green'
    }, 
    download: {
        color: "#0098EE"
    },
    video:{
        color:'#0098EE'
    }

})