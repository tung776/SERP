import React from 'react';
import Menu from './commons/menu';
import Footer from './commons/footer';
import {connect} from 'react-redux';
import { SUCCESS_MESSAGE, WARNING_MESSAGE, ERROR_MESSAGE } from '../actions/types';

class Main extends React.Component {
    renderMessage() {
        if(this.props.message != "") {
            if(this.props.TypeMessage == SUCCESS_MESSAGE) {
                return (
                    <div className="alert alert-success alert-dismissible" role="alert">
                        <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        {this.props.message}
                    </div>
                );
            }
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