import React from 'react';
import { View, Text, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { Bubble, GiftedChat, InputToolbar } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';


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
            isConnected: null,
            image: null,
            location: null,
        };

        const firebaseConfig = {
            apiKey: "AIzaSyDJ3KjqXzSXVGFuCV2sLV80rdmsYnZLut0",
            authDomain: "chatapp-24fc5.firebaseapp.com",
            projectId: "chatapp-24fc5",
            storageBucket: "chatapp-24fc5.appspot.com",
            messagingSenderId: "932241458370",
            appId: "1:932241458370:web:b35312b7e9111b3d13a75b"
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
                text: data.text || '',
                createdAt: data.createdAt.toDate(),
                user: {
                    _id: data.user._id,
                    name: data.user.name,
                },
                image: data.image || null,
                location: data.location || null,
            });
        });
        this.setState({
            messages,
        });
    };

    async getMessages() {
        let messages = '';
        try {
            messages = (await AsyncStorage.getItem('messages')) || [];
            this.setState({
                messages: JSON.parse(messages),
            });
        } catch (e) {
            console.log(e.message);
        }
    };

    async saveMessages() {
        try {
            await AsyncStorage.setItem(
                'messages',
                JSON.stringify(this.state.messages)
            );
        } catch (e) {
            console.log(e.message);
        }
    };

    async deleteMessages() {
        try {
            await AsyncStorage.removeItem('messages');
            this.setState({
                messages: [],
            });
        } catch (e) {
            console.log(e.messages);
        }
    };

    componentDidMount() {
        let { name } = this.props.route.params;
        this.props.navigation.setOptions({ title: name });

        // Check if user is offline
        NetInfo.fetch().then((connection) => {
            if (connection.isConnected) {
                this.setState({
                    isConnected: true,
                });

                // Reference to load messages from Firebase
                this.referenceChatMessages = firebase.firestore().collection('messages');

                // Authenticate user anonymously
                this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
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
                    this.unsubscribe = this.referenceChatMessages
                        .orderBy('createdAt', 'desc')
                        .onSnapshot(this.onCollectionUpdate);
                });
            } else {
                this.setState({
                    isConnected: false,
                });
                this.getMessages();
            }
        });
    }


    componentWillUnmount() {
        if (this.isConnected) {
            this.unsubscribe();
            this.authUnsubscribe();
        }
    }

    onSend(messages = []) {
        this.setState(
            (previousState) => ({
                messages: GiftedChat.append(previousState.messages, messages),
            }),
            () => {
                this.saveMessages();
                // Call addMessage with last message in message state
                if (this.state.isConnected === true) {
                    this.addMessages(this.state.messages[0])
                }
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
            image: message.image || null,
            location: message.location || null,
        });
    };

    renderInputToolbar(props) {
        if (this.state.isConnected == false) {
        } else {
            return (
                <InputToolbar
                    {...props}
                />
            );
        }
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

    renderCustomActions = (props) => {
        return <CustomActions {...props} />;
    };
    
    renderCustomView (props) {
        const { currentMessage } = props;
        if (currentMessage.location) {
            return(
                <MapView
                style={{
                    width: 150,
                    height: 100,
                    borderRadius: 13,
                    margin: 3}}
                  region={{
                    latitude: currentMessage.location.latitude,
                    longitude: currentMessage.location.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
                />
            );
        }
        return null;
    }

    render() {
        let { color, name } = this.props.route.params;

        return (
            <View style={[{ backgroundColor: color }, styles.container]}>
                {/* <KeyboardListener
                    onWillShow={() => { this.setState({ keyboardOpen: true }); }}
                    onWillHide={() => { this.setState({ keyboardOpen: false }); }}
                /> */}
                <GiftedChat
                    renderActions={this.renderCustomActions}
                    renderCustomView={this.renderCustomView}
                    renderBubble={this.renderBubble.bind(this)}
                    renderInputToolbar={this.renderInputToolbar.bind(this)}
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

