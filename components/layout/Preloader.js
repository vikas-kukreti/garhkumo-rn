import React from 'react'
import { View, Image, StyleSheet, Dimensions, Text } from 'react-native'

const Preloader = (props) => {
    const show = props.data;
    return (
        <View style={(show) ? styles.visible : styles.unVisibsle}>
            <Image source={require('../../assets/Preloader.gif')}
                style={styles.preloadImg} />
        </View>
    )
}

export default Preloader;

const styles = StyleSheet.create({
    visible: {
        flex: 1,
        position: 'absolute',
        backgroundColor: '#fff',
        height: Dimensions.get('screen').height,
        width: Dimensions.get('window').width,
    },
    unVisibsle: {
        display: 'none',
        width: 0,
        height: 0
    },
    preloadImg: {
        marginTop: Dimensions.get('screen').height / 3,
        marginHorizontal: Dimensions.get('window').width / 3
    }
})
