import isEmpty from 'lodash/isEmpty';
import Validator from 'validator';

export const ProductFormValidator = ({
      CategoryId, 
      UnitId,
      TypeCargoId,
      Name, 
      Description,
      IsPublic,
      PurchasePrice,
      SalePrice,
      MinQuantity,
      IsAvaiable 
    }) => {
    // console.log(NameCategory, Description);
    const errors = {};
    if (Validator.isEmpty(Name)) {
        errors.Name = 'Bạn chưa điền tên sản phẩm';
    }
    if (Validator.isEmpty(CategoryId)) {
        errors.Name = 'Bạn chưa điền Nhóm sản phẩm';
    }
    if (Validator.isEmpty(UnitId)) {
        errors.Name = 'Bạn chưa điền đơn vị tính';
    }
    if (Validator.isEmpty(TypeCargoId)) {
        errors.Name = 'Loại sản phẩm';
    }
    if (Validator.isEmpty(IsPublic)) {
        errors.Name = 'Bạn cần xác định sản phẩm có nên public hay không';
    }
    if (Validator.isNumeric(PurchasePrice)) {
        errors.Name = 'Giá mua vào phải là số';
    }
    if (Validator.isNumeric(SalePrice)) {
        errors.Name = 'Giá bán phải là số';
    }
    if (Validator.isNumeric(MinQuantity)) {
        errors.Name = 'Tồn tối thiểu phải là số';
    }
    if (Validator.isBoolean(IsAvaiable)) {
        errors.Name = 'Hàng có sẵn phải là giá trị đúng hoặc sai';
    }
    // if (Validator.isEmpty(Description)) {
    //     errors.Description = 'Bạn chưa điền mô tả';
    // }
    return {
        errors,
        isValid: isEmpty(errors)
    };
};
