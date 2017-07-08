import React, { Component } from 'react';
import {connect} from 'react-redux';
import {SignupFormChanged} from '../actions/SignupFormActions';
import axios from 'axios';

class SignupForm extends Component {
    constructor(props) {
        super(props);
    }
    state = {  }

    onSubmit(e) {
        e.preventDefault();
        //  const { username, email, password, passwordConfirm, gender, role, phone, error, loading, SignupFormChanged} = this.props;
        axios.post('/api/users/signup', this.props);
    }

    render() {
        const { username, email, password, passwordConfirm, gender, role, phone, error, loading, SignupFormChanged} = this.props;
        return (
            <form onSubmit = {this.onSubmit.bind(this)} >
                <h2 className = "text-center">Khởi tạo người dùng</h2>
                <div className="col-md-6">
                    <div className="form-group">
                        <label className="control-label">Tên Người Dùng</label>
                        <input 
                            value = {username}
                            onChange = { e => SignupFormChanged({prop: "username", value: e.target.value}) }
                            type="text" 
                            name = 'username' 
                            className = "form-control"
                            placeholder = "Điền tên đăng nhập"
                        />
                    </div>
                    <div className="form-group">
                        <label className="control-label">Email</label>
                        <input 
                            value = {email}
                            onChange = { e => SignupFormChanged({prop: "email", value: e.target.value}) }
                            type="text" 
                            name = 'email' 
                            className = "form-control"
                            placeholder = "Điền địa chỉ email"
                        />
                    </div>
                    <div className="form-group">
                        <label className="control-label">Mật Khẩu</label>
                        <input 
                            onChange = {e=> SignupFormChanged({prop: "password", value: e.target.value})}
                            value = {password}
                            type="password" 
                            name = 'password' 
                            className = "form-control"
                            placeholder = "Điền mật khẩu"
                        />
                    </div>
                    <div className="form-group">
                        <label className="control-label">Nhắc lại Mật Khẩu</label>
                        <input 
                            onChange = {e=> SignupFormChanged({prop: "passwordConfirm", value: e.target.value})}
                            value = {passwordConfirm}
                            type="password" 
                            name = 'passwordConfirm' 
                            className = "form-control"
                            placeholder = "Điền lại mật khẩu"
                        />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                    <label className="control-label">Điện Thoại</label>
                    <input 
                        onChange = {e=> SignupFormChanged({prop: "phone", value: e.target.value})}
                        value = {phone}
                        type="text" 
                        name = 'phone' 
                        className = "form-control"
                        placeholder = "Điền số điện thoại"
                    />
                </div>
                <div className="form-group">
                    <label className="control-label">Giới Tính</label>
                        <select 
                            className = "form-control"
                            name = "gender"
                            value = {gender}
                            onChange = {e => SignupFormChanged({
                                prop: "gender",
                                value: e.target.value
                            })}
                        >
                            <option value="" disabled>Chọn giới tính của bạn</option>
                            <option value="Nam" >Nam</option>
                            <option value="Nữ" >Nữ</option> 
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="control-label">Vai trò</label>
                        <select 
                            className = "form-control"
                            name = "gender"
                            value = {role}
                            onChange = {e => SignupFormChanged({
                                prop: "role",
                                value: e.target.value
                            })}
                        >
                            <option value="" disabled>Chọn vai trò của người dùng</option>
                            <option value="1" >Lãnh Đạo</option>
                            <option value="2" >Kế Toán</option>
                            <option value="3" >Bán Hàng</option>
                            <option value="4" >Thủ Kho</option>  
                        </select>
                    </div>
                    <div className="form-group">
                        <button className="btn btn-lg btn-primary">Khởi tạo</button>
                    </div>
                </div>
            </form>
        );
    }
}

const mapStateToProps = (state) => {
    const {username, email, password, passwordConfirm, role, phone, gender, loading, error} = state.signupForm;
    return {username, email, password, passwordConfirm, gender, role, phone, error, loading};
}

export default connect(mapStateToProps, {
    SignupFormChanged
})(SignupForm);