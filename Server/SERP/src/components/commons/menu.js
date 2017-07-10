import React from 'react';
import {connect} from 'react-redux';
import {logout} from '../../actions/LoginFormActions';
import axios from 'axios';

class Menu extends React.Component {
    logout(e) {
        e.preventDefault();
        this.props.logout();
    }
    onContactClick(e) {
        e.preventDefault();
        axios.get('/api/users/contacts').then(
            res => {
                console.log(res);
            }
        );
    }
    render(){
        const { isAuthenticated } = this.props.auth;

        const userLink = (
                <ul className="nav navbar-nav navbar-right">
                    <li><a href="/admin">Quản trị</a></li>
                    <li className="dropdown">
                        <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Người Dùng <span className="caret"></span>
                        </a>
                        <ul className="dropdown-menu">
                            <li><a href="#">Thông tin</a></li>
                            <li><a href="#">Lịch sử giao dịch</a></li>
                            <li>
                                <a href="/signup">Tạo người dùng</a>
                            </li>
                            <li role="separator" className="divider"></li>
                            <li><a href="/logout" onClick = {this.logout.bind(this)} >Thoát</a></li>
                        </ul>
                    </li>
                </ul>
            )
        

        const guestLink = (
                <ul className="nav navbar-nav navbar-right">
                    <li>
                        <a href="/login">Đăng Nhập</a>
                    </li>
                    
                </ul>
            )
        

        return(
            <nav className="navbar navbar-inverse navbar-fixed-top">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <img id = "logo" src="/favicon.ico" alt=""/>
                    </div>

                    <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                        <ul className="nav navbar-nav">
                            <li className="active">
                                <a href="/book-list">Chúng Tôi <span className="sr-only">(current)</span></a>
                            </li>
                            <li><a href="/contacts" onClick = { this.onContactClick.bind(this) }>Liên Hệ</a></li>
                        </ul>
                        
                            { isAuthenticated ? userLink : guestLink }
                        
                    </div>
                </div>
            </nav>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.auth
    }
}

export default connect(mapStateToProps, {logout})(Menu);