
exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('companies')
        .then(() => {
            // Inserts seed entries
            return knex('companies').insert([
                {
                    id: 1,
                    name: 'Công ty cổ phần kim khí hóa chất Cát Tường',
                    englishName: `Son Cat Tuong joint stock company`,
                    address: `35 Diên Hồng - Phường Quan Trung - TP Nam Định`,
                    taxtCode: `0600000000`,
                    bankId: 1,
                    phone: '03503845364',
                    email: 'admin@soncattuong.com',
                    website: 'www.soncattuong.com',
                    logoUrl: 'images/logo.png',
                    director: 'Nguyễn Thanh Tùng'
                },
            ]);
        });
};
