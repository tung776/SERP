
exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('roles')
    .then(function () {
      // Inserts seed entries
      return knex('roles')
        .insert([
          { name: 'Admin', description: 'Quản trị viên, người có quyền cao nhất trong hệ thống' },
          { name: 'Giám Đốc', description: 'Giám đốc có quyền truy xuất vào toàn bộ nghiệp vụ trong hệ thống' },
          { name: 'Lãnh Đạo Cấp Cao', description: "Thành viên trong ban lãnh đạo cấp cao, có toàn quyền truy xuất vào hầu hết các hoạt động nghiệp vụ" },
          { name: 'Trưởng Phòng Kinh Doanh', description: "Trưởng Phòng kinh doanh có toàn quyền truy xuất vào các hoạt động nghiệp vụ liên quan đến bán hàng" },
          { name: 'Kế Toán Trưởng', description: "Kế toán trưởng có các đặc quyền theo thẩm quyền của mình" },
          { name: 'Kế Toán Viên', description: "Kế toán trưởng có các đặc quyền theo thẩm quyền của mình" },
          { name: 'Trưởng Phòng Sản Xuất', description: "Kế toán trưởng có các đặc quyền theo thẩm quyền của mình" },
          { name: 'Công Nhân', description: "Kế toán trưởng có các đặc quyền theo thẩm quyền của mình" }
        ]);
    })
};
