import React from 'react';
import { View, Text, Button, Image, ScrollView, AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';
// import { Card, CardSection, } from './index';
import { connect } from 'react-redux';
import { logout } from '../../actions';
import { loadMenusData } from '../../actions/index';
import { Spinner } from './Spinner';
import { getActionForMenus, HOME_ACT } from '../../actions/typeActionRouter';

class SideMenu extends React.Component {
    state = {
        collaped: [],
    }
    constructor(props) {
        super(props);
        this.renderMenuItems = this.renderMenuItems.bind(this);
    }
    
    componentWillReceiveProps(nextProps) {
        if (nextProps.menuItems && nextProps.menuItems.length > 0) {
            nextProps.menuItems.forEach((menu) => {
                if (menu.parentId == 'null') {
                    this.state.collaped[menu.menuId] = false;
                    this.setState({ collaped: this.state.collaped });
                }
            });
        }
    }
    
    
    getChildItems(parentId, data) {
        const child = data.map((item) => {
            if (item.parentId == parentId) {
                return (
                    <Button
                        key={item.menuId}
                        onPress={() => { 
                            console.log(`menu ${item.name} clicked id = ${item.menuId}`);
                            getActionForMenus(item.menuId); 
                        }}
                        title={item.name}
                        color="#34495e"
                    />
                );
            }
        });
        return child;
    }
    renderMenuItems() {
        const menuItems = this.props.menuItems;
        const parentMenu = menuItems.filter((item) => {
            if (item.parentId == 'null') {
                return item;
            }
        });

        const renderedMenus = parentMenu.map((parent) => {

            return (
                <View key={parent.menuId} style={styles.commonButton}>
                    <Button
                        onPress={() => {
                            this.state.collaped[parent.menuId] = !this.state.collaped[parent.menuId];
                            this.setState({ collaped: this.state.collaped });
                            console.log(`${parent.name} pressed, this.state.collaped = `, this.state.collaped[parent.menuId]);
                        }}
                        title={parent.name}
                    />
                    {
                        this.state.collaped[parent.menuId] && this.getChildItems(parent.menuId, this.props.menuItems)
                    }
                </View>
            );
        }, this);
        return (
            <View>
                {renderedMenus}
            </View>
        );
    }
    logout(e) {
        e.preventDefault();
        this.props.logout(() => {
            AsyncStorage.removeItem('jwtToken').then(() => {
                Actions.auth();
            });
        });
    }
    render() {
        const { containerStyle } = styles;
        goHomePage = () => {
            console.log('begin to get actions for menus');
            getActionForMenus(HOME_ACT);
        };
        goSignin = () => {
            Actions.auth();
        };

        if (this.props.loaded) {
            // this.renderMenuItems(this.props.menuItems);
            return (
                <View style={containerStyle}>
                    <View>
                        <Image style={styles.logoImage} source={require('../../../Shared/images/Logo.png')} />
                        {this.props.user && <Text style={styles.usernameStyle}>{this.props.user.username}</Text>}
                    </View>
                    <ScrollView>
                        {this.renderMenuItems()}

                        {this.renderAuthMenu()}
                    </ScrollView>
                </View>
            );
        }
        return (
            <View style={containerStyle}>
                <View>
                    <Image style={styles.logoImage} source={require('../../../Shared/images/Logo.png')} />
                    {this.props.user && <Text style={styles.usernameStyle}>{this.props.user.username}</Text>}
                </View>
                <ScrollView>
                    <Spinner />
                    {this.renderAuthMenu()}
                </ScrollView>
            </View>
        );
    }

    renderAuthMenu() {
        const { isAuthenticated, user } = this.props;
        if (isAuthenticated) {
            return (
                <View style={styles.buttonMenuContainer}>
                    <Button
                        onPress={this.logout.bind(this)}
                        title="Thoát"
                        color="rgba(39, 174, 96,1.0)"
                        accessibilityLabel=".."
                    />
                </View>
            );
        }
    }
    
}

const styles = {
    containerStyle: {
        flex: 1,
        backgroundColor: 'rgba(52, 73, 94,1.0)',
        alignItems: 'center',
    },
    textMenuStyle: {
        fontSize: 16,
        color: 'white'
    },
    logoImage: {
        width: 200,
        height: 110,
        margin: 20
    },
    usernameStyle: {
        fontSize: 16,
        color: '#FFFFFF',
        alignSelf: 'center',
        paddingBottom: 5,
        fontWeight: '600'
    },
    buttonMenuContainer: {
        margin: 3,
        width: 250,
    },
    commonButton: {
        margin: 3,
        width: 250,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#bdc3c7'
    }
};

const mapStateToProps = (state) => {
    const { isAuthenticated, user } = state.auth;
    const { menuItems, loaded, loading } = state.userMenus;
    return { isAuthenticated, user, menuItems, loaded, loading };
};
export default connect(mapStateToProps, {
    logout,
    loadMenusData,
})(SideMenu);
