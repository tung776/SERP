import isEmpty from 'lodash/isEmpty';
import Validator from 'validator';

export const NewSupplierValidator = ({ Name, SupplierGroupId }) => {
    // console.log(NameSupplier, Description);
    const errors = {};
    if (Validator.isEmpty(Name)) {
        errors.Name = 'Bạn chưa điền tên khách hàng';
    }
    if (Validator.isEmpty(`${SupplierGroupId}`)) {
        errors.SupplierGroupId = 'Bạn chưa điền nhóm khách hàng';
    }
    return {
        errors,
        isValid: isEmpty(errors)
    };
};
