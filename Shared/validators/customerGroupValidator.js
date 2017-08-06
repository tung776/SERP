import isEmpty from 'lodash/isEmpty';
import Validator from 'validator';

export const NewCustomerGroupValidator = ({ Name, Description }) => {
    // console.log(NameCustomerGroup, Description);
    const errors = {};
    if (Validator.isEmpty(Name)) {
        errors.Name = 'Bạn chưa điền tên nhóm khách hàng';
    }
    if (Validator.isEmpty(Description)) {
        errors.Description = 'Bạn chưa điền mô tả';
    }
    return {
        errors,
        isValid: isEmpty(errors)
    };
};
