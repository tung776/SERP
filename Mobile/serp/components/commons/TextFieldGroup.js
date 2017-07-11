import React, { Component } from 'react';
import classnames from 'classnames';
import { Container,Card, Content, Form, Item, Button, Text, CardItem , Spinner, Input} from 'native-base';

const TextFieldGroup = ({ field, value, label, error, type, onChangeText, placeholder }) => {
    return (
        <Card>
            
                <Input 
                    label = {label}
                    value = {value}
                    onChangeText = {onChangeText}
                    type= { type } 
                    name = { field }
                    placeholder = {placeholder}
                />
            
            <Item>
                { error && <Text style = {styles.errorStyle}>{error}</Text> }
            </Item>
        </Card>
    );
}

TextFieldGroup.defaultProps = {
    type: 'Text'
}
const styles = {
    errorStyle: {
        color: 'red'
    }
}
export default TextFieldGroup;