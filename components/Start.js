import React from 'react';
import { View, Text, TextInput, StyleSheet, ImageBackground, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Button } from 'react-native-web';


const image = { uri: "https://user-images.githubusercontent.com/105219302/193833223-9aafd141-68fc-4878-b5ef-74ac811db3d3.png" };
const icon = { uri: "https://user-images.githubusercontent.com/105219302/194041738-9b53a6ff-9d10-4c29-a173-4504be7e9cfa.png" };

export default class Start extends React.Component {
    constructor(props) {
        super(props);
        this.state = { name: "", color: "" };
    }

    render() {
        return (
            <View style={styles.container}>
                <ImageBackground source={image} resizeMode="cover" style={styles.image}>
                    <Text style={styles.title}>Chat App</Text>
                    <View style={styles.box}>
                        <View style={styles.sectionStyle}>
                        <Image source={icon} style={styles.icon} />
                        <TextInput
                            style={styles.text}
                            onChangeText={(name) => this.setState({ name })}
                            value={this.state.name}
                            placeholder="Your Name" />
                            </View>
                        <View>
                            <Text style={[styles.colortext, styles.text]}>Choose Background Color:</Text>
                        <View style={styles.colors}>
                            <TouchableOpacity style={[styles.color, styles.black]} onPress={() => this.setState({ color: '#090C08' })} />
                            <TouchableOpacity style={[styles.color, styles.purple]} onPress={() => this.setState({ color: '#474056' })} />
                            <TouchableOpacity style={[styles.color, styles.grey]} onPress={() => this.setState({ color: '#8A95A5' })} />
                            <TouchableOpacity style={[styles.color, styles.green]} onPress={() => this.setState({ color: '#B9C6AE' })} />
                        </View>
                        </View>
                        <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('Chat', { name: this.state.name, color: this.state.color })}>
                            <Text style={styles.buttonText}>Start Chatting</Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontSize: 45,
        fontWeight: "600",
        color: "#FFF",
        textAlign: "center",
        marginBottom: "65%",
    },
    image: {
        flex: 1,
        justifyContent: "center",
    },
    text: {
        fontSize: 16,
        fontWeight: "300",
        color: "#757083",
        opacity: 50,
        marginLeft: "5%",
    },
    box: {
        backgroundColor: "#fff",
        width: "88%",
        height: "44%",
        justifyContent: "space-between",
        marginLeft: "6%",
    },
    colortext: {
        marginTop: -30,
        opacity: "100%",
    },
    colors: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 25,
        marginTop: 10,
    },
    color: {
        borderRadius: 20,
        width: 40,
        height: 40,
        marginRight: 10,
    },
    black: {
        backgroundColor: '#090C08',
    },
    purple: {
        backgroundColor: '#474056',
    },
    grey: {
        backgroundColor: '#8A95A5',
    },
    green: {
        backgroundColor: '#B9C6AE',
    },
    button: {
        fontSize: 16,
        fontWeight: "600",
        backgroundColor: "#757083",
        width: '88%',
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 20,
        marginBottom: 20,
        height: 50,
    },
    buttonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "600",
    },
    icon: {
        padding: 10,
        marginLeft: 15,
        height: 20,
        width: 20,
        resizeMode: 'stretch',
        alignItems: 'center',
    },
    sectionStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#757083',
        height: 50,
        margin: 15,
    },
})

