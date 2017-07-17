import isEmpty from 'lodash/isEmpty';
import Validator from 'validator';
export const LoginValidator = (data) => {
    const errors = {};
    if (Validator.isEmpty(data.identifier)) {
        errors.identifier = 'Bạn chưa điền email hoặc tên đăng nhập';
    }
    if (Validator.isEmpty(data.password)) {
        errors.password = 'Bạn chưa điền mật khẩu';
    }
    return {
        errors,
        isValid: isEmpty(errors)
    };
}
;