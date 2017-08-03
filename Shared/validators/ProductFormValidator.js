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
    // if (Validator.isNumeric(CategoryId)) {
    //     errors.CategoryId = 'Mã nhóm sản phẩm phải là một số nguyên';
    // }
    // if (Validator.isNumeric(UnitId)) {
    //     errors.UnitId = 'Mã đơn vị tính phải là một số nguyên';
    // }
    // if (Validator.isNumeric(TypeCargoId)) {
    //     errors.TypeCargoId = 'Mã loại hàng hóa phải là một số nguyên';
    // }
    // if (Validator.isBoolean(IsPublic)) {
    //     errors.IsPublic = 'Bạn cần xác định sản phẩm có nên public hay không';
    // }
    // if (Validator.isNumeric(PurchasePrice)) {
    //     errors.PurchasePrice = 'Giá mua vào phải là số';
    // }
    // if (Validator.isNumeric(SalePrice)) {
    //     errors.SalePrice = 'Giá bán phải là số';
    // }
    // if (Validator.isNumeric(MinQuantity)) {
    //     errors.MinQuantity = 'Tồn tối thiểu phải là số';
    // }
    // if (Validator.isBoolean(IsAvaiable)) {
    //     errors.IsAvaiable = 'Hàng có sẵn phải là giá trị đúng hoặc sai';
    // }
    // if (Validator.isEmpty(Description)) {
    //     errors.Description = 'Bạn chưa điền mô tả';
    // }
    return {
        errors,
        isValid: isEmpty(errors)
    };
};
