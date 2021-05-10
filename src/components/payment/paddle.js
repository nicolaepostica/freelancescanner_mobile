import React, {Component} from 'react';
import {WebView} from 'react-native-webview';
import {GET_STATE_URL, BASE_URL, PADDLE_URL} from '../constants';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {BACKGROUND_COLOR, CONTENT_COLOR, FONT_FAMILY, FONT_SIZE} from '../theme';
import Spinner from '../spinner';

class Paddle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            init: true,
            token: '',
            username: '',
            subscribe_expiration: '',
            account_type: '',
        };
    }

    componentDidMount() {
        AsyncStorage.multiGet(['userToken', 'username']).then(([[[], token], [[], username]]) => {
            this.setState({token, username});
            this.getState();
        });
    }

    getState() {
        axios
            .get(GET_STATE_URL, {headers: {Authorization: this.state.token}})
            .then(({data: {subscribe_expiration, account_type}}) => {
                if (subscribe_expiration < 0) {
                    subscribe_expiration = 'expired';
                } else {
                    if (subscribe_expiration < 2) {
                        subscribe_expiration = `${subscribe_expiration} day`;
                    } else {
                        subscribe_expiration = `${subscribe_expiration} days`;
                    }
                }
                if (account_type === 'premium') {
                    subscribe_expiration = '*';
                }
                this.setState({subscribe_expiration, account_type, init: false});
            })
            .catch(() => {});
    }

    render() {
        const {init} = this.state;
        return (
            <View style={styles.root}>
                <View style={styles.container}>
                    {init ? (
                        <View style={styles.spinnerView}>
                            <Spinner />
                        </View>
                    ) : (
                        <>
                            <Text style={styles.text}>Current Plan: "{this.state.account_type}"</Text>
                            <Text style={styles.text}>Expiration time: "{this.state.subscribe_expiration}"</Text>
                        </>
                    )}
                    <Text style={styles.text}>Subscribe for one more month!</Text>
                    <TouchableOpacity style={styles.buttonContainer} activeOpacity={0.5} onPress={() => {
                        this.props.navigation.navigate('PaymentProcess')
                    }}>
                        <Text style={styles.buttonText}>Pay</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

class PaddleProcess extends Component {
    constructor(props) {
        super(props);
        this.state = {
            init: true,
            token: '',
            url: ''
        };
    }

    componentDidMount() {
        AsyncStorage.multiGet(['userToken', ]).then(([[[], token]]) => {
            this.setState({token, init: false});
        }).then(() => {
            this.getPaymentForm();
        });
    }

    getPaymentForm() {
        this.setState({payment_process: true});
        axios
            .post(PADDLE_URL, {}, {headers: {Authorization: this.state.token}})
            .then(({data}) => {
                this.setState({url: `${BASE_URL}${data.payment_url}`});
            })
            .catch((e) => {
                console.log(e);
            });
    }

    render() {
        const {init, url} = this.state;
        return (
            <View style={styles.root}>
                {init ? (
                    <View style={styles.container}>
                        <View style={styles.spinnerView}>
                            <Spinner />
                        </View>
                    </View>
                ) : (
                    <WebView
                        source={{uri: url}}
                    />
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: BACKGROUND_COLOR,
    },
    text: {
        color: CONTENT_COLOR,
        fontFamily: FONT_FAMILY,
        fontSize: FONT_SIZE + 5,
        marginBottom: 30,
    },
    buttonText: {
        color: BACKGROUND_COLOR,
        fontFamily: FONT_FAMILY,
        fontSize: FONT_SIZE + 5,
    },
    buttonContainer: {
        height: 45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        width: 250,
        borderRadius: 30,
        backgroundColor: CONTENT_COLOR,
    },
});

export default Paddle;
export {PaddleProcess};
