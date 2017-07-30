
exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('permisions')
    .then(function () {
      // Inserts seed entries
      return knex('permisions').insert([
        { name: 'Quản Trị', description: 'Có toàn bộ các đặc quyền' },
        { name: 'Thêm Người Dùng', description: 'Đặc quyền thêm người dùng' },
        { name: 'Thay đổi vai trò', description: 'Đặc quyền thay đổi vai trò người dùng ' },
        { name: 'Thay đổi đặc quyền', description: 'Đặc quyền thay đổi đặc quyền của từng vai trò' },
        { name: 'Thêm khách hàng', description: 'Đặc quyền thêm khách hàng' },
        { name: 'Xem công nợ Khách Hàng', description: 'Đặc quyền xem công nợ của khách hàng' },
        { name: 'Lập Hóa đơn', description: 'Đặc quyền lập, thay đổi và xem hóa đơn của khách hàng' },
        { name: 'Báo cáo Doanh Số', description: 'Đặc quyền Xem các kết quả báo cáo về doanh số bán hàng' },
        { name: 'Báo cáo Kết quả kinh doanh', description: 'Đặc quyền Xem các kết quả báo cáo kinh doanh' },
        { name: 'Lập Hóa Đơn Nhập', description: 'Đặc quyền thêm, xem, xóa, sửa hóa đơn nhập' },
        { name: 'Công nợ Nhà cung cấp', description: 'Đặc quyền xem các báo cáo công nợ nha cung cấp' },
        { name: 'Báo cáo Tồn Kho', description: 'Đặc quyền xem các báo cáo tồn kho liên quan' },
        { name: 'Lập Công Thức Nghiên Cứu', description: 'Đặc quyền thêm, xóa, sửa các công thức nghiên cứu' },
        { name: 'Lập Lệnh sản xuất', description: 'Đặc quyền thêm, xóa, sửa lệnh sản xuất' },
        { name: 'Báo Cáo Sản xuất', description: 'Đặc quyền xem toàn bộ các báo cáo sản xuất' }
      ]);
    });
};
