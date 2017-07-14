import React, { Component } from 'react';
import {connect} from 'react-redux';
import {addFlashMessage, ERROR_MESSAGE} from '../actions';
import PropTypes from 'prop-types';
import { Actions } from 'react-native-router-flux'

export default function (ComposedComponent) {
    class Authenticate extends Component {
        state = {  }

        componentWillMount() {
            if(!this.props.isAuthenticated) {
                
                this.props.addFlashMessage({
                    TypeMessage: ERROR_MESSAGE,
                    message: "Bạn cần đăng nhập trước khi sử dụng chức năng này"
                });
                Actions.auth();
                // browserHistory.push('/');
            }
        }
        render() {
            //  
           if(this.props.isAuthenticated) {
                return (
                    <ComposedComponent {...this.props} />
                );
           }
           else return null;
        }
    }
    // Authenticate.contextTypes = {
    //     router: PropTypes.object.isRequired
    // }
    function mapStateToProps(state) {
        return {
            isAuthenticated: state.auth.isAuthenticated
        }
    }

    return connect(mapStateToProps, {
        addFlashMessage
        
    })(Authenticate);
}

