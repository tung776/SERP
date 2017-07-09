import isEmpty from 'lodash/isEmpty';
import Validator from 'validator';
export default function validateInput(data) {
    let errors = {};
    if(Validator.isEmpty(data.email)) {
        errors.email = 'Bạn chưa điền email';
    }
    if(!Validator.isEmail(data.email)) {
        errors.email = 'Không đúng định dạng địa chỉ email';
    }
    if(Validator.isEmpty(data.username)) {
        errors.username = 'Bạn chưa điền tên đăng nhập';
    }
    if(Validator.isEmpty(data.password)) {
        errors.password = 'Bạn chưa điền mật khẩu';
    }
    if(Validator.isEmpty(data.passwordConfirm)) {
        errors.passwordConfirm = 'Bạn chưa điền nhắc lại mật khẩu';
    }
    if(Validator.isEmpty(data.gender)) {
        errors.gender = 'Bạn chưa điền giới tính';
    }
    if(Validator.isEmpty(data.phone)) {
        errors.phone = 'Bạn chưa điền số điện thoại';
    }
    if(Validator.isEmpty(data.role)) {
        errors.role = 'Bạn chưa điền vai trò';
    }
    if(data.password !== data.passwordConfirm) {
        errors.passwordConfirm = "mật khẩu nhắc lại phải giống với mật khẩu"
    }
    return {
        errors,
        isValid : isEmpty(errors)
    }
}