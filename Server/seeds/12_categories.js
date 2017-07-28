
exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('categories')
        .then(() => {
            // Inserts seed entries
            return knex('categories').insert([
                {
                    id: 1,
                    name: 'Sơn PU',
                    description: `Sơn PU tiếng Anh có nghĩa là Polyurethane, một loại polymer có khá nhiều ứng dụng trong cuộc sống. Sơn PU có hai dạng tồn tại chính là dạng cứng và dạng foam, được dùng làm vecni để đánh bóng và bảo vệ đồ gỗ như bàn ghế, cửa gỗ… Đối với dạng foam, được dùng để làm nệm mút trong các loại ghế (như ghế ngồi trong xe hơi chẳng hạn). Ngoài ra, ứng dụng của foam được dùng để bảo vệ và vận chuyển các thiết bị, dụng cụ dễ vỡ.
                    Theo ngôn ngữ đơn giản của các thợ sơn thì sơn PU là loại sơn để bảo vệ, đánh bóng, tạo màu cho gỗ tự nhiên, gỗ công nghiệp một cách đẹp và mịn nhất`
                },
                {
                    id: 2,
                    name: 'Sơn 2k',
                    description: `Sơn 2K được xếp vào loại sơn hai thành phần (cũng giống như sơn PU thông thường – cũng là hệ sơn 2 thành phần), tức là phải pha trộn từ 2 thành phần trở lên mới cho ra 1 dung dịch sơn phủ lên bề mặt gỗ. Về cấu tạo thì chúng được kết hợp từ nhựa acrylic polyol và chất đóng rắn Isocyanate chất lượng cao, cho màng sơn nhanh khô, có độ bóng đẹp và độ cứng cao, bám dính tốt, giữ được độ trong sáng.`
                },
            ]);
        });
};
