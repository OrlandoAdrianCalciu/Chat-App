import React from 'react';
import { View, Text, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';
import KeyboardListener from 'react-native-keyboard-listener';


const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends React.Component {
    constructor() {
        super();
        this.state = {
            messages: [],
            uid: 0,
            user: {
                _id: '',
                name: '',
            },
        };

        const firebaseConfig = {
            apiKey: "AIzaSyADHXGc0xUWpnL2uO4ajQQo8a6ISn6bz8A",
            authDomain: "chatapp-1b0e6.firebaseapp.com",
            projectId: "chatapp-1b0e6",
            storageBucket: "chatapp-1b0e6.appspot.com",
            messagingSenderId: "170287749770",
            appId: "1:170287749770:web:b8e1a1fba6b386dab26b73"
        };

        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }

        //Reference to Firestore collection
        this.referenceChatMessages = firebase.firestore().collection('messages');
    }

    onCollectionUpdate = (querySnapshot) => {
        const messages = [];
        // Go through each document
        querySnapshot.forEach((doc) => {
            // Get the QueryDocumentsSnapshot's data
            let data = doc.data();
            messages.push({
                _id: data._id,
                text: data.text,
                createdAt: data.createdAt.toDate(),
                user: {
                    _id: data.user._id,
                    name: data.user.name,
                },
            });
        });
        this.setState({
            messages,
        });
    };

    componentDidMount() {
        let { name } = this.props.route.params;
        this.props.navigation.setOptions({ title: name });

        // Reference to load messages from Firebase
        this.referenceChatMessages = firebase.firestore().collection('messages');

        // Authenticate user anonymously
        this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
            if (!user) {
                firebase.auth().signInAnonymously();
            }
            this.setState({
                uid: user.uid,
                messages: [],
                user: {
                    _id: user.uid,
                    name: name,
                },
            });
            // listen for collection changes for current user 
            this.unsubscribe = this.referenceChatMessages
                .orderBy('createdAt', 'desc')
                .onSnapshot(this.onCollectionUpdate);
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    onSend(messages = []) {
        this.setState(
            (previousState) => ({
                messages: GiftedChat.append(previousState.messages, messages),
            }),
            () => {
                // Call addMessage with last message in message state
                this.addMessages(this.state.messages[0]);
            }
        );
    }

    addMessages = (message) => {
        //add a new list to the collection
        this.referenceChatMessages.add({
            uid: this.state.uid,
            _id: message._id,
            text: message.text,
            createdAt: message.createdAt,
            user: message.user,
        });
    };

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
        let { color, name } = this.props.route.params;

        return (
            <View style={[{ backgroundColor: color }, styles.container]}>
                <KeyboardListener
                    onWillShow={() => { this.setState({ keyboardOpen: true }); }}
                    onWillHide={() => { this.setState({ keyboardOpen: false }); }}
                />
                <GiftedChat
                    renderBubble={this.renderBubble.bind(this)}
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    user={{
                        _id: this.state.user._id, name: name
                    }} />
                {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
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
