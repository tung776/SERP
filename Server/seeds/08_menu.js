
exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('menus')
    .then(() => {
      // Inserts seed entries
      return knex('menus').insert([
        { name: 'Trang Chủ' },

        { name: 'Sản Phẩm' },
        { name: 'Nhóm Sản Phẩm', parentId: 2 },
        { name: 'Thêm Nhóm Sản Phẩm', parentId: 2 },
        { name: 'Tìm Kiếm Sản Phẩm', parentId: 2 },
        { name: 'Danh Sách Sản Phẩm', parentId: 2 },
        { name: 'Thêm Loại Hàng Hóa', parentId: 2 },
        { name: 'Danh Sách Loại Hàng Hóa', parentId: 2 },
        { name: 'Báo Cáo Tồn Kho', parentId: 2 },
        { name: 'Dự Báo Hàng Cần Nhập', parentId: 2 },
        { name: 'Doanh Số Sản Phẩm', parentId: 2 },
        { name: 'Dự Báo Sản Xuất', parentId: 2 },

        { name: 'Hóa Đơn Bán' },
        { name: 'Lập Hóa Đơn', parentId: 13 },
        { name: 'Lập Hóa Đơn Trả Lại', parentId: 13 },
        { name: 'Tìm Hóa Đơn', parentId: 13 },
        { name: 'Thêm Loại Hóa Đơn', parentId: 13 },

        { name: 'Khách Hàng' },
        { name: 'Thêm Khách Hàng', parentId: 18 },
        { name: 'Danh Sách Khách Hàng', parentId: 18 },
        { name: 'Công Nợ Khách Hàng', parentId: 18 },
        { name: 'Doanh Số Khách Hàng', parentId: 18 },

        { name: 'Phiếu Chi' },
        { name: 'Thêm Loại Phiếu Chi', parentId: 23 },
        { name: 'Chi Lương', parentId: 23 },
        { name: 'Chi Thuê Mặt Bằng', parentId: 23 },
        { name: 'Chi Lãi Vay', parentId: 23 },
        { name: 'Chi Khác', parentId: 23 },

        { name: 'Hóa Đơn Nhập' },
        { name: 'Thêm Hóa Đơn Nhập', parentId: 29 },
        { name: 'Trả Lại NCC', parentId: 29 },
        { name: 'Tìm Hóa Đơn Nhập', parentId: 29 },
        { name: 'Doanh Số', parentId: 29 },

        { name: 'Nhà Cung Cấp' },
        { name: 'Tìm Nhà Cung Cấp', parentId: 34 },
        { name: 'Thêm Nhà Cung Cấp', parentId: 34 },
        { name: 'Công Nợ Nhà Cung Cấp', parentId: 34 },
        { name: 'Doanh Số Nhà Cung Cấp', parentId: 34 },

        { name: 'Nghiên Cứu' },
        { name: 'Lập Công Thức Thực Nghiệm', parentId: 39 },
        { name: 'Giá Thành Tạm Tính', parentId: 39 },
        { name: 'Tìm Kiếm', parentId: 39 },
        { name: 'Chuyển Giao Nghiên Cứu', parentId: 39 },
        { name: 'Báo Cáo Kết Quả NC', parentId: 39 },
        { name: 'Tổng Hợp', parentId: 39 },

        { name: 'Sản Xuất' },
        { name: 'Lập Lệnh Sản Xuất', parentId: 46 },
        { name: 'Tìm Lệnh Sản Xuất', parentId: 46 },
        { name: 'Tái Chế', parentId: 46 },
        { name: 'Tổng Hợp', parentId: 46 },

        { name: 'Nhân Sự' },
        { name: 'Thêm phòng Ban', parentId: 51 },
        { name: 'Tìm Phòng Ban', parentId: 51 },
        { name: 'Thêm Người Dùng', parentId: 51 },
        { name: 'Tìm Kiếm Người dùng', parentId: 51 },
        { name: 'Thuyển Chuyển Công Tác', parentId: 51 },
        { name: 'Phân Quyền', parentId: 51 },

        { name: 'Báo Cáo Kinh Doanh' },
        { name: 'Báo Cáo Doanh Số', parentId: 58 },
        { name: 'Báo Cáo Lợi Nhuận Tạm Tính', parentId: 58 },
        { name: 'Báo Cáo Lợi Nhuận Thuần', parentId: 58 },
        { name: 'Báo Cáo Chi Phí', parentId: 58 },
        { name: 'Báo Cáo Giá Thành Sản Xuất', parentId: 58 },

        { name: 'Hệ Thống' },
        { name: 'Thay Đổi Thông Tin Công Ty', parentId: 64 }, //65
        { name: 'Thay Đổi Menu', parentId: 64 }, //66
        //update 4/8/2017
        { name: 'Thêm sản phẩm mới', parentId: 2 }, //67
        { name: 'Tìm kiếm sản phẩm', parentId: 2 }, //68
        //update 6/8
        { name: 'Thêm Nhóm Khách Hàng', parentId: 18 }, //69
        { name: 'Tìm kiếm Nhóm Khách Hàng', parentId: 18 }, //70

        { name: 'Thêm Nhóm Nhà Cung Cấp', parentId: 34 }, //71
        { name: 'Tìm kiếm Nhóm Nhà Cung Cấp', parentId: 34 }, //72
        //update 8/8
        { name: 'Lập Báo Giá', parentId: 29 }, //73
        { name: 'Tìm Báo Giá', parentId: 29 } //74
      ]);
    });
};
