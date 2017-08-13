import isEmpty from 'lodash/isEmpty';
import Validator from 'validator';

export const NewQuocteValidator = ({ date }) => {
    // console.log(NameCustomer, Description);
    const errors = {};
    if (Validator.isEmpty(date)) {
        errors.Name = 'Bạn chưa điền tên khách hàng';
    }
    return {
        errors,
        isValid: isEmpty(errors)
    };
};
