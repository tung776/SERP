import React from 'react';
// import classnames from 'classnames';
// import { Container,Card, Content, Form, Item, Button, Text, CardItem , Spinner, Input} from 'native-base';
import { Text, TextInput } from 'react-native';
import { Card } from './card';
// import {CardSection} from './cardSection';

export const TextFieldGroup = ({ 
    field, value, label, error, type, 
    onChangeText, placeholder, secureTextEntry 
}) => (
        <Card>
                <Text style={styles.label} >{label}</Text>
                <TextInput 
                    style={styles.textInput}
                    secureTextEntry={secureTextEntry}
                    value={value}
                    onChangeText={onChangeText}
                    type={type} 
                    name={field}
                    placeholder={placeholder}
                />
            
                <Text>
                    { error && <Text style={styles.errorStyle}>{error}</Text> }
                </Text>
                
        </Card>
    );

TextFieldGroup.defaultProps = {
    type: 'Text'
};
const styles = {
    errorStyle: {
        color: 'red'
    },
    container: {
        flex: 1,
        flexDirection: 'row'
    },
    label: {
        width: 300
    },
    textInput: {
        width: 300,
    }
};
// export TextFieldGroup;
