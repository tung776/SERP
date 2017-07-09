import React from 'react';
import Menu from './commons/menu';
import Footer from './commons/footer';
import {connect} from 'react-redux';
import { SUCCESS_MESSAGE, WARNING_MESSAGE, ERROR_MESSAGE } from '../actions/types';
import classnames from 'classnames';

class Main extends React.Component {
    renderMessage() {
        const { message, TypeMessage } = this.props;
        if(message != "") {
            
            return (
                <div className = "container">
                    <div className= {
                        classnames('alert', {
                                'alert-success': TypeMessage == SUCCESS_MESSAGE, 
                                'alert-danger': TypeMessage == ERROR_MESSAGE, 
                                "alert-warning": TypeMessage == WARNING_MESSAGE
                            })
                        } role="alert">
                        <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        {message}
                    </div>
                </div>
            );
            
        }
        return (
            <div></div>
        );
    }
    render(){
        return (
            <div>
                <Menu cartItemsNumber = {this.props.totalQty}/>                
                {this.renderMessage()}
                {this.props.children}
                <Footer/>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    const { message, TypeMessage } = state.flashMessage
    return { message, TypeMessage }; 
}
export default connect(mapStateToProps)(Main);