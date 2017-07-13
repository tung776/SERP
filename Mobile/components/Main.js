import React, { Component } from 'react';
// import { Container,Icon, Button,Content, Title, FooterTab, Text, Header, Body, Footer, Right, Left} from 'native-base';
import { View, Text } from 'react-native';
import { Card, CardSection, Button } from './commons';
import { Actions } from 'react-native-router-flux';

class Home extends Component {
    state = {}
    render() {
        return (
            <Card>
                <CardSection>
                    
                        <Button transparent onPress={() => {
                        Actions.refresh({ key: 'drawer', open: value => !value });
                        }}>
                            Menu
                        </Button>
                    
                    <CardSection>
                        <Text>Header</Text>
                    </CardSection>
                </CardSection>
                <CardSection>
                    <Text>
                        This is Content Section
                    </Text>
                    
                </CardSection>
                <CardSection>
                    <Button full>
                        <Text>Footer</Text>
                    </Button>
                </CardSection>
            </Card>
        );
    }
}

export default Home;