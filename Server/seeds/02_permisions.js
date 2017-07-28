
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('permisions')
    .then(function () {
      // Inserts seed entries
      return knex('permisions').insert([
        {id: 1, name: 'Quản Trị', description: 'Có toàn bộ các đặc quyền'},
        {id: 2, name: 'Thêm Người Dùng', description: 'Đặc quyền thêm người dùng'},
        {id: 3, name: 'Thay đổi vai trò', description: 'Đặc quyền thay đổi vai trò người dùng '},
        {id: 4, name: 'Thay đổi đặc quyền', description: 'Đặc quyền thay đổi đặc quyền của từng vai trò'},
        {id: 5, name: 'Thêm khách hàng', description: 'Đặc quyền thêm khách hàng'},
        {id: 6, name: 'Xem công nợ Khách Hàng', description: 'Đặc quyền xem công nợ của khách hàng'},
        {id: 7, name: 'Lập Hóa đơn', description: 'Đặc quyền lập, thay đổi và xem hóa đơn của khách hàng'},
        {id: 8, name: 'Báo cáo Doanh Số', description: 'Đặc quyền Xem các kết quả báo cáo về doanh số bán hàng'},
        {id: 9, name: 'Báo cáo Kết quả kinh doanh', description: 'Đặc quyền Xem các kết quả báo cáo kinh doanh'},
        {id: 10, name: 'Lập Hóa Đơn Nhập', description: 'Đặc quyền thêm, xem, xóa, sửa hóa đơn nhập'},
        {id: 11, name: 'Công nợ Nhà cung cấp', description: 'Đặc quyền xem các báo cáo công nợ nha cung cấp'},
        {id: 12, name: 'Báo cáo Tồn Kho', description: 'Đặc quyền xem các báo cáo tồn kho liên quan'},
        {id: 13, name: 'Lập Công Thức Nghiên Cứu', description: 'Đặc quyền thêm, xóa, sửa các công thức nghiên cứu'},
        {id: 14, name: 'Lập Lệnh sản xuất', description: 'Đặc quyền thêm, xóa, sửa lệnh sản xuất'},
        {id: 15, name: 'Báo Cáo Sản xuất', description: 'Đặc quyền xem toàn bộ các báo cáo sản xuất'}
      ]);
    });
};
