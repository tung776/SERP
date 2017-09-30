
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
        { name: 'Thêm Khách Hàng', parentId: 18 },//19
        { name: 'Danh Sách Khách Hàng', parentId: 18 },//20
        { name: 'Công Nợ Khách Hàng', parentId: 18 },//21
        { name: 'Doanh Số Khách Hàng', parentId: 18 },//22

        { name: 'Phiếu Thu' }, //23
        { name: 'Lập Phiếu Thu Công Nợ', parentId: 23 }, //24
        { name: 'Tìm Phiếu Thu Công Nợ', parentId: 23 }, //25
        { name: 'Sửa Phiếu Thu', parentId: 23 }, //26

        { name: 'Phiếu Chi' },//27
        { name: 'Thêm Loại Phiếu Chi', parentId: 27 },//28
        { name: 'Chi Lương', parentId: 23 },//27
        { name: 'Chi Thuê Mặt Bằng', parentId: 27 },//30
        { name: 'Chi Lãi Vay', parentId: 27 },//31
        { name: 'Chi Khác', parentId: 27 },//32

        { name: 'Hóa Đơn Nhập' },//33
        { name: 'Thêm Hóa Đơn Nhập', parentId: 33 },//34
        { name: 'Trả Lại NCC', parentId: 33 },//35
        { name: 'Tìm Hóa Đơn Nhập', parentId: 33 },//36
        { name: 'Doanh Số', parentId: 33 },//37

        { name: 'Nhà Cung Cấp' },//38
        { name: 'Tìm Nhà Cung Cấp', parentId: 38 },//39
        { name: 'Thêm Nhà Cung Cấp', parentId: 38 },//40
        { name: 'Công Nợ Nhà Cung Cấp', parentId: 38 },//41
        { name: 'Doanh Số Nhà Cung Cấp', parentId: 38 },//42

        { name: 'Nghiên Cứu' },//43
        { name: 'Lập Công Thức Thực Nghiệm', parentId: 43 },//44
        { name: 'Giá Thành Tạm Tính', parentId: 43 },//45
        { name: 'Tìm Kiếm', parentId: 43 },//46
        { name: 'Chuyển Giao Nghiên Cứu', parentId: 43 },//47
        { name: 'Báo Cáo Kết Quả NC', parentId: 43 },//48
        { name: 'Tổng Hợp', parentId: 43 },//49

        { name: 'Sản Xuất' },//50
        { name: 'Lập Lệnh Sản Xuất', parentId: 50 },//51
        { name: 'Tìm Lệnh Sản Xuất', parentId: 50 },//52
        { name: 'Tái Chế', parentId: 50 },//53
        { name: 'Tổng Hợp', parentId: 50 },//54

        { name: 'Nhân Sự' },//55
        { name: 'Thêm phòng Ban', parentId: 55 },//56
        { name: 'Tìm Phòng Ban', parentId: 55 },//57
        { name: 'Thêm Người Dùng', parentId: 55 },//58
        { name: 'Tìm Kiếm Người dùng', parentId: 55 },//59
        { name: 'Thuyển Chuyển Công Tác', parentId: 55 },//60
        { name: 'Phân Quyền', parentId: 55 },//61

        { name: 'Báo Cáo Kinh Doanh' },//62
        { name: 'Báo Cáo Doanh Số', parentId: 62 },//63
        { name: 'Báo Cáo Lợi Nhuận Tạm Tính', parentId: 62 },//64
        { name: 'Báo Cáo Lợi Nhuận Thuần', parentId: 62 },//65
        { name: 'Báo Cáo Chi Phí', parentId: 62 },//66
        { name: 'Báo Cáo Giá Thành Sản Xuất', parentId: 62 },//67

        { name: 'Hệ Thống' },//68
        { name: 'Thay Đổi Thông Tin Công Ty', parentId: 68 }, //69
        { name: 'Thay Đổi Menu', parentId: 68 }, //70
        //update 4/8/2017
        { name: 'Thêm sản phẩm mới', parentId: 2 }, //71
        { name: 'Tìm kiếm sản phẩm', parentId: 2 }, //72
        //update 6/8
        { name: 'Thêm Nhóm Khách Hàng', parentId: 18 }, //73
        { name: 'Tìm kiếm Nhóm Khách Hàng', parentId: 18 }, //74

        { name: 'Thêm Nhóm Nhà Cung Cấp', parentId: 38 }, //75
        { name: 'Tìm kiếm Nhóm Nhà Cung Cấp', parentId: 38 }, //76
        //update 8/8
        { name: 'Lập Báo Giá', parentId: 18 }, //77
        { name: 'Tìm Báo Giá', parentId: 18 }, //78

        
      ]);
    });
};
