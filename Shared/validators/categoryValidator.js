import isEmpty from 'lodash/isEmpty';
import Validator from 'validator';

export const NewCategoryValidator = ({ Name, Description }) => {
    // console.log(NameCategory, Description);
    const errors = {};
    if (Validator.isEmpty(Name)) {
        errors.Name = 'Bạn chưa điền tên nhóm sản phẩm';
    }
    if (Validator.isEmpty(Description)) {
        errors.Description = 'Bạn chưa điền mô tả';
    }
    return {
        errors,
        isValid: isEmpty(errors)
    };
};
