import * as React from 'react';
import { WebView } from 'react-native-webview';
import { ScreenOrientation } from 'expo';
import { StyleSheet, ImageBackground, BackHandler, ToastAndroid, Dimensions } from 'react-native';
import ApiHandelComponent from './handler/ApiHandelComponent';
const VideoComponent = (props) => {
    const songId = props.navigation.state.params.dataSongId;
    const [play, setplay] = useState(false);
    

    React.useEffect(() => {
        changeScreenLandscape();
    }, [])

    async function changeScreenLandscape() {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
        props.screenProps(null, null, 'hide');
        setplay(true);

    }
    async function changeScreenPortrait () {        
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);      
        props.screenProps(null, null, 'show');

    }
    

    BackHandler.addEventListener('hardwareBackPress', function() {
        if (play) {
            changeScreenPortrait();
        }        
    })
   
    return (
        <ImageBackground resizeMode={"center"} source={require('../assets/Preloader.gif')} style={styles.preloader}>
             <WebView
                style={styles.webView}
                originWhitelist={['*']}
                source={{ uri: ApiHandelComponent.video.url+songId }}
            />
        </ImageBackground>
    );
}

export default VideoComponent;
const styles = StyleSheet.create({
    preloader: {
        flex:1,
        justifyContent:'center',
        backgroundColor:'#fff'       
    },
    webView:{       
        backgroundColor: 'transparent'
    }
})

