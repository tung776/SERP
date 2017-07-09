import React from 'react';
import Menu from './commons/menu';
import Footer from './commons/footer';
import {connect} from 'react-redux';

class Main extends React.Component {
    renderMessage() {
        if(this.props.message != "") {
            return (
                <div className="alert alert-success alert-dismissible" role="alert">
                    <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    {this.props.message}
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
    const { message } = state.flashMessage
    return { message }; 
}
export default connect(mapStateToProps)(Main);