import React from 'react';

class Menu extends React.Component {
    render(){
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
                            <li><a href="/contacts">Liên Hệ</a></li>
                        </ul>
                        <ul className="nav navbar-nav navbar-right">
                            <li><a href="/admin">Quản trị</a></li>

                            <li><a href="/cart">Giỏ hàng 
                            
                            {(this.props.cartItemsNumber)?(<span className="badge">{this.props.cartItemsNumber}</span>):("")}
                            
                            </a></li>
                            <li>
                                <a href="/signup">Đăng ký</a>
                            </li>
                            <li>
                                <a href="/login">Đăng Nhập</a>
                            </li>
                            <li className="dropdown">
                                <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Người Dùng <span className="caret"></span></a>
                                <ul className="dropdown-menu">
                                    <li><a href="#">Thông tin</a></li>
                                    <li><a href="#">Lịch sử giao dịch</a></li>
                                    <li role="separator" className="divider"></li>
                                    <li><a href="#">Thoát</a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}

export default Menu;