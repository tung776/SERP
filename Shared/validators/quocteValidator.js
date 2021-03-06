import isEmpty from 'lodash/isEmpty';
import Validator from 'validator';

export const NewQuocteValidator = ({ date }) => {
    // console.log(NameCustomer, Description);
    const errors = {};
    if (Validator.isEmpty(date)) {
        errors.date = 'Bạn chưa điền ngày lập báo giá';
    }
    return {
        errors,
        isValid: isEmpty(errors)
    };
};
