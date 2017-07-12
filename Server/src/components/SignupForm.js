import React, { Component } from 'react';
import {connect} from 'react-redux';
import {SignupFormChanged, SignupFormSubmit, validateSignup} from '../actions/SignupFormActions';
// import isEmpty from 'lodash/isEmpty';
import classnames from 'classnames';
import TextFieldGroup from './commons/TextFieldGroup';

class SignupForm extends Component {
    constructor(props) {
        super(props);
    }
    state = {  }

    onSubmit(e) {
        e.preventDefault();
        this.props.SignupFormSubmit(this.props)
    }

    render() {
        const { username, email, password, passwordConfirm, gender, role, phone, error, loading, SignupFormChanged} = this.props;
        return (
            <form onSubmit = {this.onSubmit.bind(this)} >
                <h2 className = "text-center">Khởi tạo người dùng</h2>
                <div className="col-md-6">
                    <TextFieldGroup
                        label = "Tên đăng nhập"
                        type = "Text"
                        value = {username}
                        field = "username"
                        onChange = {e=> SignupFormChanged({
                            prop: "username",
                            value: e.target.value
                        }) }
                        placeholder = "Điền tên đăng nhập"
                        error = {error.username}
                     />
                     <TextFieldGroup
                        label = "Email"
                        type = "Text"
                        value = {email}
                        field = "email"
                        onChange = {e=> SignupFormChanged({
                            prop: "email",
                            value: e.target.value
                        }) }
                        placeholder = "Điền địa chỉ email"
                        error = {error.email}
                     />
                     <TextFieldGroup
                        label = "Mật Khẩu"
                        type = "password"
                        value = {password}
                        field = "password"
                        onChange = {e=> SignupFormChanged({
                            prop: "password",
                            value: e.target.value
                        }) }
                        placeholder = "Điền mật khẩu"
                        error = {error.password}
                     />
                     <TextFieldGroup
                        label = "Nhắc Lại Mật Khẩu"
                        type = "password"
                        value = {passwordConfirm}
                        field = "passwordConfirm"
                        onChange = {e=> SignupFormChanged({
                            prop: "passwordConfirm",
                            value: e.target.value
                        }) }
                        placeholder = "Điền lại mật khẩu"
                        error = {error.passwordConfirm}
                     />
                    
                </div>
                <div className="col-md-6">
                <TextFieldGroup
                        label = "Điện Thoại"
                        type = "Text"
                        value = {phone}
                        field = "phone"
                        onChange = {e=> SignupFormChanged({
                            prop: "phone",
                            value: e.target.value
                        }) }
                        placeholder = "Điền số điện thoại"
                        error = {error.phone}
                     />
                    
                <div className={classnames("form-group", {"has-error": error.gender})}>
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
                         { error.gender && <span className = "help-block">{error.gender}</span> }
                    </div>
                    <div className={classnames("form-group", {"has-error": error.role})}>
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
                         { error.role && <span className = "help-block">{error.role}</span> }
                    </div>
                    <div className="form-group">
                        <button disabled = {loading} className="btn btn-lg btn-primary">Khởi tạo</button>
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
    SignupFormChanged,
    SignupFormSubmit,
    validateSignup
})(SignupForm);