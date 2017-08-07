import isEmpty from 'lodash/isEmpty';
import Validator from 'validator';

export const NewCustomerValidator = ({ Name, CustomerGroupId }) => {
    // console.log(NameCustomer, Description);
    const errors = {};
    if (Validator.isEmpty(Name)) {
        errors.Name = 'Bạn chưa điền tên khách hàng';
    }
    if (Validator.isEmpty(`${CustomerGroupId}`)) {
        errors.CustomerGroupId = 'Bạn chưa điền nhóm khách hàng';
    }
    return {
        errors,
        isValid: isEmpty(errors)
    };
};
