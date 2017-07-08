import React from 'react';
import Menu from './commons/menu';
import Footer from './commons/footer';
import {connect} from 'react-redux';

class Main extends React.Component {
    render(){
        return (
            <div>
                <Menu cartItemsNumber = {this.props.totalQty}/>
                {this.props.children}
                <Footer/>
            </div>
        );
    }
}
// function mapStateToProps(state){
//     return {
//         totalQty: state.cart.totalQty
//     }
// }
export default Main;