
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('departments')
    .then(function () {
      // Inserts seed entries
      return knex('departments').insert([
        { name: 'Ban Giám Đốc', description: "Ban Giám Đốc công ty"},
        { name: 'Hội Đồng Quản Trị', description: "Hội Đồng Quản trị"},
        { name: 'Phòng Kinh Doanh', description: "Phòng Kinh Doanh"},
        { name: 'Phòng Sản Xuất', description: "Phòng Sản Xuất"},
        { name: 'Phòng Kế Toán', description: "Phòng Kế Toán"}
      ]);
    });
};
