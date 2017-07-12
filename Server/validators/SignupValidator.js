// import isEmpty from 'lodash/isEmpty';
import Validator from 'validator';
export const SignupValidator = (data) => {
    let errors = {};
    let isValid = true;
    if(Validator.isEmpty(data.email)) {
        errors.email = 'Bạn chưa điền email';
        isValid = false;
    }
    if(!Validator.isEmail(data.email)) {
        isValid = false;
        errors.email = 'Không đúng định dạng địa chỉ email';
    }
    if(Validator.isEmpty(data.username)) {
        isValid = false;
        errors.username = 'Bạn chưa điền tên đăng nhập';
    }
    if(Validator.isEmpty(data.password)) {
        isValid = false;
        errors.password = 'Bạn chưa điền mật khẩu';
    }
    if(Validator.isEmpty(data.passwordConfirm)) {
        isValid = false;
        errors.passwordConfirm = 'Bạn chưa điền nhắc lại mật khẩu';
    }
    if(Validator.isEmpty(data.gender)) {
        isValid = false;
        errors.gender = 'Bạn chưa điền giới tính';
    }
    if(Validator.isEmpty(data.phone)) {
        isValid = false;
        errors.phone = 'Bạn chưa điền số điện thoại';
    }
    if(Validator.isEmpty(data.role)) {
        isValid = false;
        errors.role = 'Bạn chưa điền vai trò';
    }
    if(data.password !== data.passwordConfirm) {
        isValid = false;
        errors.passwordConfirm = "mật khẩu nhắc lại phải giống với mật khẩu"
    }
    return {
        errors,
        isValid : isValid
    }
}