import React, { Component } from 'react';
// import { Container, Content, Form, Item, Button, Text, Header, Body, Footer, Right, Left, Spinner, Input} from 'native-base';
import {connect} from 'react-redux';
import {Text, View } from 'react-native';
import {Button, TextFieldGroup, Card, CardSection, Spinner} from './commons';
// import Expo from 'expo';
import { 
    emailChanged, 
    passwordChanged,
    loginUser,
    LoginFormChanged
} from '../actions';

import { Actions } from 'react-native-router-flux';
import {AsyncStorage} from 'react-native';
import {URL} from '../../env';

class LoginForm extends Component {
    
    
    onIdentifierChange(text) {
        this.props.LoginFormChanged({prop: "identifier", value: text});
    }
    onPasswordChange(text) {
        this.props.LoginFormChanged({prop: "password", value: text});
    }
    onLoginPress(e) {
        e.preventDefault();
        const {identifier, password, loginUser} = this.props;
        // console.log(identifier, password);

        loginUser(`${URL}/api/users/login`, {identifier, password}, (token)=> {
            AsyncStorage.setItem('jwtToken', token)
            Actions.drawer();
        });
    }
    renderMessage(){
        const {error,user} = this.props;
        if(error) {
            console.log("err = ", error);
            console.log("err.length = ", error.length);
            let listError = [];
            if(error.identifier) {
                return null;
            }
            if(error.password) {
                return null;
            }
            return (
                <Text style = {styles.erroMessage}>{error}</Text>
            );
        }
        if(user) {
            return (
                <Text style = {styles.successMessage}>Login successful</Text>               
            );
        }
    }
    renderButtonLogin() {
        if(this.props.loading) {
            return (
                <Spinner size = 'small'/>
            );
        }
        return (
            <Button
                onPress = {this.onLoginPress.bind(this)}
            >
                <Text>Login</Text>
            </Button>
        );
    }
    render() {
        const {identifier, password, error} = this.props;
        
        return (
            <View>                
                <Card>
                   
                        <TextFieldGroup 
                            label = "Email/Tên đăng nhập"
                            placeholder = "email hoặc tên đăng nhập"
                            onChangeText = {this.onIdentifierChange.bind(this)}
                            value = { identifier }
                            error = { error.identifier }
                        />
                        
                        <TextFieldGroup 
                                label = "Mật khẩu"
                                secureTextEntry
                                placeholder = "Điền mật khẩu"
                                onChangeText = {this.onPasswordChange.bind(this)}
                                value = { password }
                                error = { error.password }
                            />
                        
                        {this.renderMessage()}
                    <CardSection>
                        {this.renderButtonLogin()}
                    </CardSection>
                </Card>                
            </View>
        );
    }
}

const styles = {
    erroMessage: {
        color: 'red',
        fontSize: 18
    },
    successMessage: {
        color: 'green',
        fontSize: 18
    }
}

const mapStateToProps = (state, ownProps) => {
    const {identifier, password, error, user, loading} = state.loginForm;
    return {
    identifier,
    password,
    error,
    user,
    loading
}};

export default connect(mapStateToProps, {
    emailChanged,
    passwordChanged,
    loginUser,
    LoginFormChanged
})(LoginForm);