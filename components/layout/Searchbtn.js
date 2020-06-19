import React, { Component } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FontAwesome } from "@expo/vector-icons";
const Searchbtn = (props) => {
    return (
        <TouchableOpacity style={{ padding: 12, paddingHorizontal: 20 }} onPress={() => props.navigate('Search')}>
            <FontAwesome name="search" size={22} />
        </TouchableOpacity>
    )
}

export default Searchbtn; 