
exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('menus')
    .then(() => {
      // Inserts seed entries
      return knex('menus').insert([
        { id: 1, name: 'Trang Chủ' },

        { id: 2, name: 'Sản Phẩm' },
        { id: 3, name: 'Nhóm Sản Phẩm', parentId: 2 },
        { id: 4, name: 'Thêm Nhóm Sản Phẩm', parentId: 2 },
        { id: 5, name: 'Tìm Kiếm Sản Phẩm', parentId: 2 },
        { id: 6, name: 'Danh Sách Sản Phẩm', parentId: 2 },
        { id: 7, name: 'Thêm Loại Hàng Hóa', parentId: 2 },
        { id: 8, name: 'Danh Sách Loại Hàng Hóa', parentId: 2 },
        { id: 9, name: 'Báo Cáo Tồn Kho', parentId: 2 },
        { id: 10, name: 'Dự Báo Hàng Cần Nhập', parentId: 2 },
        { id: 11, name: 'Doanh Số Sản Phẩm', parentId: 2 },
        { id: 12, name: 'Dự Báo Sản Xuất', parentId: 2 },

        { id: 13, name: 'Hóa Đơn Bán' },
        { id: 14, name: 'Lập Hóa Đơn', parentId: 13 },
        { id: 15, name: 'Lập Hóa Đơn Trả Lại', parentId: 13 },
        { id: 16, name: 'Tìm Hóa Đơn', parentId: 13 },
        { id: 17, name: 'Thêm Loại Hóa Đơn', parentId: 13 },

        { id: 18, name: 'Khách Hàng' },
        { id: 19, name: 'Thêm Khách Hàng', parentId: 18 },
        { id: 20, name: 'Danh Sách Khách Hàng', parentId: 18 },
        { id: 21, name: 'Công Nợ Khách Hàng', parentId: 18 },
        { id: 22, name: 'Doanh Số Khách Hàng', parentId: 18 },

        { id: 23, name: 'Phiếu Chi' },
        { id: 24, name: 'Thêm Loại Phiếu Chi', parentId: 23 },
        { id: 25, name: 'Chi Lương', parentId: 23 },
        { id: 26, name: 'Chi Thuê Mặt Bằng', parentId: 23 },
        { id: 27, name: 'Chi Lãi Vay', parentId: 23 },
        { id: 28, name: 'Chi Khác', parentId: 23 },

        { id: 29, name: 'Hóa Đơn Nhập' },
        { id: 30, name: 'Thêm Hóa Đơn Nhập', parentId: 29 },
        { id: 31, name: 'Trả Lại NCC', parentId: 29 },
        { id: 32, name: 'Tìm Hóa Đơn Nhập', parentId: 29 },
        { id: 33, name: 'Doanh Số', parentId: 29 },

        { id: 34, name: 'Nhà Cung Cấp' },
        { id: 35, name: 'Tìm Nhà Cung Cấp', parentId: 34 },
        { id: 36, name: 'Thêm Nhà Cung Cấp', parentId: 34 },
        { id: 37, name: 'Công Nợ Nhà Cung Cấp', parentId: 34 },
        { id: 38, name: 'Doanh Số Nhà Cung Cấp', parentId: 34 },

        { id: 39, name: 'Nghiên Cứu' },
        { id: 40, name: 'Lập Công Thức Thực Nghiệm', parentId: 39 },
        { id: 41, name: 'Giá Thành Tạm Tính', parentId: 39 },
        { id: 42, name: 'Tìm Kiếm', parentId: 39 },
        { id: 43, name: 'Chuyển Giao Nghiên Cứu', parentId: 39 },
        { id: 44, name: 'Báo Cáo Kết Quả NC', parentId: 39 },
        { id: 45, name: 'Tổng Hợp', parentId: 39 },

        { id: 46, name: 'Sản Xuất' },
        { id: 47, name: 'Lập Lệnh Sản Xuất', parentId: 46 },
        { id: 48, name: 'Tìm Lệnh Sản Xuất', parentId: 46 },
        { id: 49, name: 'Tái Chế', parentId: 46 },
        { id: 50, name: 'Tổng Hợp', parentId: 46 },

        { id: 51, name: 'Nhân Sự' },
        { id: 52, name: 'Thêm phòng Ban', parentId: 51 },
        { id: 53, name: 'Tìm Phòng Ban', parentId: 51 },
        { id: 54, name: 'Thêm Người Dùng', parentId: 51 },
        { id: 55, name: 'Tìm Kiếm Người dùng', parentId: 51 },
        { id: 56, name: 'Thuyển Chuyển Công Tác', parentId: 51 },
        { id: 57, name: 'Phân Quyền', parentId: 51 },

        { id: 58, name: 'Báo Cáo Kinh Doanh' },
        { id: 59, name: 'Báo Cáo Doanh Số', parentId: 58 },
        { id: 60, name: 'Báo Cáo Lợi Nhuận Tạm Tính', parentId: 58 },
        { id: 61, name: 'Báo Cáo Lợi Nhuận Thuần', parentId: 58 },
        { id: 62, name: 'Báo Cáo Chi Phí', parentId: 58 },
        { id: 63, name: 'Báo Cáo Giá Thành Sản Xuất', parentId: 58 },

        { id: 64, name: 'Hệ Thống' },
        { id: 65, name: 'Thay Đổi Thông Tin Công Ty', parentId: 64 },
        { id: 66, name: 'Thay Đổi Menu', parentId: 64 }

      ]);
    });
};
