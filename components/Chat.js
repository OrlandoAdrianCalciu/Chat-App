import React from 'react';
import { View, Text, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';
import KeyboardListener from 'react-native-keyboard-listener';


export default class Chat extends React.Component {
    constructor() {
        super();
        this.state = {
            messages: [],
        }
    }

    componentDidMount() {
        let { name } = this.props.route.params;
        this.props.navigation.setOptions({ title: name });
        this.setState({
            messages: [
                // Chat message
                {
                    _id: 1,
                    text: 'Hello Developer',
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: 'React Native',
                        avatar: 'https://placeimg.com/140/140/any',
                    },
                },
                // System message
                {
                    _id: 2,
                    text: 'This is a system message',
                    createdAt: new Date(),
                    system: true,
                },
            ]
        })
    }

    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }))
    }

    renderBubble(props) {
        return (
            <Bubble
            {...props}
            wrapperStyle={{
                right: {
                    backgroundColor: '#023e8a'
                }
            }}
            />
        )
    }

    render() {
        let { color } = this.props.route.params;

        return (
            <View style={[{ backgroundColor: color }, styles.container]}>
                <KeyboardListener
                onWillShow={() => { this.setState({ keyboardOpen: true}); }}
                onWillHide={() => { this.setState({ keyboardOpen: false}); }}
                />
            <GiftedChat
            renderBubble={this.renderBubble.bind(this)}
                messages={this.state.messages}
                onSend={messages => this.onSend(messages)}
                user={{
                    _id: 1,
                }} />
                { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
            {/* <View style={[{ backgroundColor: color }, styles.container]}>
                <Text style={styles.text}>Hello Chat Screen!</Text> */}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
    },
})
