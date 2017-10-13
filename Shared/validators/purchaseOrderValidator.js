import isEmpty from 'lodash/isEmpty';
import Validator from 'validator';

export const NewSaleOrderValidator = ({ date, customerId }) => {
    // console.log(NameSupplier, Description);
    const errors = {};
    // if (Validator.isEmpty(customerId)) {
    //     errors.customerid = 'Bạn chưa điền khách hàng';
    // }
    return {
        errors,
        isValid: isEmpty(errors)
    };
};
