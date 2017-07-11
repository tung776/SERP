import React, { Component } from 'react';
// import { Container,Icon, Button,Content, Title, FooterTab, Text, Header, Body, Footer, Right, Left} from 'native-base';
import {View, Text} from 'react-native';
import {Card, CardSection, Button} from './commons';

class Home extends Component {
    state = {  }
    render() {
        return (
            <Card>
                <CardSection>
                    <CardSection>
                        <Button transparent>
                        </Button>
                    </CardSection>
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