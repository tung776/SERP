
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('menus').del()
    .then(function () {
      // Inserts seed entries
      return knex('menus').insert([
        {id: 1, name: 'Trang Chủ'},
        {id: 2, name: 'Sản Phẩm'},
        {id: 3, name: 'Hóa Đơn Bán'},
        {id: 4, name: 'Phiếu Chi'},
        {id: 5, name: 'Khách Hàng'},
        {id: 6, name: 'Hóa Đơn Nhập'},
        {id: 7, name: 'Nhà Cung Cấp'},
        {id: 8, name: 'Báo Cáo Kinh Doanh'}
      ]);
    });
};
