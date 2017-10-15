import isEmpty from 'lodash/isEmpty';
import Validator from 'validator';

export const NewSupplierValidator = ({ Name }) => {
    // console.log(NameSupplier, Description);
    const errors = {};
    if (Validator.isEmpty(Name)) {
        errors.Name = 'Bạn chưa điền tên khách hàng';
    }
    return {
        errors,
        isValid: isEmpty(errors)
    };
};
