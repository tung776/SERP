import React, { Component } from 'react';
import {connect} from 'react-redux';
import TextfieldGroup from './commons/TextFieldGroup';
import { LoginFormChanged, LoginFormSubmit } from '../actions';

class Login extends Component {
    state = {  }

    onSubmit(e) {
         e.preventDefault();
         const { password, identifier,error, loading, LoginFormSubmit } = this.props;
         LoginFormSubmit({ identifier, password });
    }

    render() {
        const { password, identifier,error, loading, LoginFormChanged } = this.props;
        return (
            <div className = "row">
                <div className="col-md-4 col-md-offset-4">
                    <form onSubmit = {this.onSubmit.bind(this)} >
                        <h2 className = "text-center">Login</h2>
                        <TextfieldGroup 
                            field = "identifier"
                            label = "Email/Tên đăng nhập"
                            value = {identifier}
                            error = { error.identifier }
                            onChange = { e=> LoginFormChanged({
                                prop: "identifier",
                                value: e.target.value
                            }) }
                            placeholder = "Điền tên đăng nhập hoặc email"
                        />
                        <TextfieldGroup 
                            type = "password"
                            field = "password"
                            label = "Mật khẩu"
                            value = {password}
                            error = { error.password }
                            onChange = { e=> LoginFormChanged({
                                prop: "password",
                                value: e.target.value
                            }) }
                            placeholder = "Điền mật khẩu"
                        />
                        <div className="form-group">
                            <button disabled = {loading} className="btn btn-lg btn-primary">Đăng nhập</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    const { identifier, password, error, loading } = state.loginForm;

    return { identifier, password, error, loading }
}
export default connect(mapStateToProps, { 
    LoginFormChanged,
    LoginFormSubmit
})(Login);