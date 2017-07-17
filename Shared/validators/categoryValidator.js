import isEmpty from 'lodash/isEmpty';
import Validator from 'validator';

export const NewCategoryValidator = ({ NameCategory, Description }) => {
    console.log(NameCategory, Description);
    const errors = {};
    if (Validator.isEmpty(NameCategory)) {
        errors.NameCategory = 'Bạn chưa điền email hoặc tên đăng nhập';
    }
    if (Validator.isEmpty(Description)) {
        errors.Description = 'Bạn chưa điền mô tả';
    }
    return {
        errors,
        isValid: isEmpty(errors)
    };
};
