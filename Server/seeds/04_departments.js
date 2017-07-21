
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('departments').del()
    .then(function () {
      // Inserts seed entries
      return knex('departments').insert([
        {id: 1, name: 'Ban Giám Đốc', description: "Ban Giám Đốc công ty"},
        {id: 2, name: 'Hội Đồng Quản Trị', description: "Hội Đồng Quản trị"},
        {id: 3, name: 'Phòng Kinh Doanh', description: "Phòng Kinh Doanh"},
        {id: 4, name: 'Phòng Sản Xuất', description: "Phòng Sản Xuất"},
        {id: 5, name: 'Phòng Kế Toán', description: "Phòng Kế Toán"}
      ]);
    });
};
