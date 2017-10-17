
exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('menus')
    .then(() => {
      // Inserts seed entries
      return knex('menus').insert([
        { name: 'Trang Chủ' },//1

        { name: 'Sản Phẩm' },//2
        { name: 'Nhóm Sản Phẩm', parentId: 2 },//3
        { name: 'Thêm Nhóm Sản Phẩm', parentId: 2 },//4
        { name: 'Tìm Kiếm Sản Phẩm', parentId: 2 },//5
        { name: 'Danh Sách Sản Phẩm', parentId: 2 },//6
        { name: 'Thêm Loại Hàng Hóa', parentId: 2 },//7
        { name: 'Danh Sách Loại Hàng Hóa', parentId: 2 },//8
        { name: 'Báo Cáo Tồn Kho', parentId: 2 },//9
        { name: 'Dự Báo Hàng Cần Nhập', parentId: 2 },//10
        { name: 'Doanh Số Sản Phẩm', parentId: 2 },//11
        { name: 'Dự Báo Sản Xuất', parentId: 2 },//12

        { name: 'Hóa Đơn Bán' },//13
        { name: 'Lập Hóa Đơn', parentId: 13 },//14
        { name: 'Lập Hóa Đơn Trả Lại', parentId: 13 },//15
        { name: 'Tìm Hóa Đơn', parentId: 13 },//16
        { name: 'Thêm Loại Hóa Đơn', parentId: 13 },//17

        { name: 'Khách Hàng' },//18
        { name: 'Thêm Khách Hàng', parentId: 18 },//19
        { name: 'Danh Sách Khách Hàng', parentId: 18 },//20
        { name: 'Công Nợ Khách Hàng', parentId: 18 },//21
        { name: 'Doanh Số Khách Hàng', parentId: 18 },//22

        { name: 'Phiếu Thu' }, //23
        { name: 'Lập Phiếu Thu Công Nợ', parentId: 23 }, //24
        { name: 'Tìm Phiếu Thu Công Nợ', parentId: 23 }, //25
        { name: 'Thêm Loại Phiếu Thu', parentId: 23 },//26
        { name: 'Lập phiếu thu', parentId: 23 }, //27
        { name: 'Tổng Hợp Các Khoản Thu', parentId: 23 }, //28

        { name: 'Phiếu Chi' },//29
        { name: 'Thêm phiếu Chi Công Nợ', parentId: 28 },//30
        { name: 'Tìm Phiếu Chi Công nợ', parentId: 29 },//31
        { name: 'Thêm Loại Phiếu Chi', parentId: 29 },//32
        { name: 'Thêm Phiếu Chi Khác', parentId: 29 },//33
        { name: 'Tổng Hợp Các Khoản Chi', parentId: 29 },//34


        { name: 'Hóa Đơn Nhập' },//35
        { name: 'Thêm Hóa Đơn Nhập', parentId: 35 },//36
        { name: 'Trả Lại NCC', parentId: 35 },//37
        { name: 'Tìm Hóa Đơn Nhập', parentId: 35 },//38
        { name: 'Tổng Hợp Hàng Nhập', parentId: 35 },//39

        { name: 'Nhà Cung Cấp' },//40
        { name: 'Tìm Nhà Cung Cấp', parentId: 40 },//41
        { name: 'Thêm Nhà Cung Cấp', parentId: 40 },//42
        { name: 'Công Nợ Nhà Cung Cấp', parentId: 40 },//43
        { name: 'Doanh Số Nhà Cung Cấp', parentId: 40 },//44

        { name: 'Nghiên Cứu' },//45
        { name: 'Lập Công Thức Thực Nghiệm', parentId: 45 },//46
        { name: 'Giá Thành Tạm Tính', parentId: 45 },//47
        { name: 'Tìm Kiếm', parentId: 45 },//48
        { name: 'Chuyển Giao Nghiên Cứu', parentId: 45 },//49
        { name: 'Báo Cáo Kết Quả NC', parentId: 45 },//50
        { name: 'Tổng Hợp', parentId: 45 },//51

        { name: 'Sản Xuất' },//52
        { name: 'Lập Lệnh Sản Xuất', parentId: 52 },//53
        { name: 'Tìm Lệnh Sản Xuất', parentId: 52 },//54
        { name: 'Tái Chế', parentId: 52 },//55
        { name: 'Tổng Hợp', parentId: 52 },//56

        { name: 'Nhân Sự' },//57
        { name: 'Thêm phòng Ban', parentId: 57 },//58
        { name: 'Tìm Phòng Ban', parentId: 57 },//59
        { name: 'Thêm Người Dùng', parentId: 57 },//60
        { name: 'Tìm Kiếm Người dùng', parentId: 57 },//61
        { name: 'Thuyển Chuyển Công Tác', parentId: 57 },//62
        { name: 'Phân Quyền', parentId: 57 },//63

        { name: 'Báo Cáo Kinh Doanh' },//64
        { name: 'Báo Cáo Doanh Số', parentId: 64 },//65
        { name: 'Báo Cáo Lợi Nhuận Tạm Tính', parentId: 64 },//66
        { name: 'Báo Cáo Lợi Nhuận Thuần', parentId: 64 },//67
        { name: 'Báo Cáo Chi Phí', parentId: 64 },//68
        { name: 'Báo Cáo Giá Thành Sản Xuất', parentId: 64 },//69

        { name: 'Hệ Thống' },//70
        { name: 'Thay Đổi Thông Tin Công Ty', parentId: 70 }, //71
        { name: 'Thay Đổi Menu', parentId: 70 }, //72
        //update 4/8/2017
        { name: 'Thêm sản phẩm mới', parentId: 2 }, //73
        { name: 'Tìm kiếm sản phẩm', parentId: 2 }, //74
        //update 6/8
        { name: 'Thêm Nhóm Khách Hàng', parentId: 18 }, //75
        { name: 'Tìm kiếm Nhóm Khách Hàng', parentId: 18 }, //76

        { name: 'Thêm Nhóm Nhà Cung Cấp', parentId: 38 }, //77
        { name: 'Tìm kiếm Nhóm Nhà Cung Cấp', parentId: 38 }, //78
        //update 8/8
        { name: 'Lập Báo Giá', parentId: 18 }, //79
        { name: 'Tìm Báo Giá', parentId: 18 }, //80

        
      ]);
    });
};
