import React, { Component } from 'react';
import { Container, Content, Form, Item, Button, Text, Header, Body, Footer, Right, Left, Spinner, Input} from 'native-base';
import {connect} from 'react-redux';
// import Expo from 'expo';
import { 
    emailChanged, 
    passwordChanged,
    loginUser
} from '../actions';

class LoginForm extends Component {
    
    
    onEmailChange(text) {
        this.props.emailChanged(text);
    }
    onPasswordChange(text) {
        this.props.passwordChanged(text);
    }
    onLoginPress() {
        const {email, password, loginUser} = this.props;
        loginUser({email, password});
    }
    renderMessage(){
        const {error,user} = this.props;
        if(error) {
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
        const {email, password} = this.props;
        
        return (
            <Container>                
                <Content>
                    <Item>
                    <Input 
                        label = "Email"
                        placeholder = "email@company.com"
                        onChangeText = {this.onEmailChange.bind(this)}
                        value = { email }
                    />
                </Item>
                <Item>
                    <Input 
                        label = "Password"
                        secureTextEntry
                        placeholder = "password"
                        onChangeText = {this.onPasswordChange.bind(this)}
                        value = { password }
                    />
                </Item>
                {this.renderMessage()}
                <Item>
                    {this.renderButtonLogin()}
                </Item>
                </Content>                
            </Container>
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
    const {email, password, error, user, loading} = state.auth;
    return {
    email,
    password,
    error,
    user,
    loading
}};

export default connect(mapStateToProps, {
    emailChanged,
    passwordChanged,
    loginUser
})(LoginForm);