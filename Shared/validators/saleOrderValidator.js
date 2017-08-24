import isEmpty from 'lodash/isEmpty';
import Validator from 'validator';

export const NewSaleOrderValidator = ({ date, customerId }) => {
    // console.log(NameCustomer, Description);
    const errors = {};
    if (Validator.isEmpty(date)) {
        errors.customerid = 'Bạn chưa điền tên khách hàng';
    }
    return {
        errors,
        isValid: isEmpty(errors)
    };
};
