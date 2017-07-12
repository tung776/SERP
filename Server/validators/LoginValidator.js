// import isEmpty from 'lodash/isEmpty';
import Validator from 'validator';
export const LoginValidator = (data) =>{
    let errors = {};
    let isValid = true;
    if(Validator.isEmpty(data.identifier)) {
        isValid = false
        errors.identifier = 'Bạn chưa điền email hoặc tên đăng nhập';
    }
    if(Validator.isEmpty(data.password)) {
        isValid = false;
        errors.password = 'Bạn chưa điền mật khẩu';
    }
    return {
        errors,
        isValid : isValid
    }
}