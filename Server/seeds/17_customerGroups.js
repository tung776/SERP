
exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('customerGroups')
        .then(() => {
            // Inserts seed entries
            return knex('customerGroups').insert([
                {
                    name: 'Đại lý cấp 1',
                    description: `Đại lý cấp 1`
                },
                {
                    name: 'Đại lý cấp 2',
                    description: `Đại lý cấp 2`
                },
                {
                    name: 'Đại lý cấp 3',
                    description: `Đại lý cấp 3`
                },
                {
                    name: 'Công ty Đồ Gỗ Mỹ Nghệ',
                    description: `Công ty sản xuất đồ gỗ mỹ nghệ`
                },
                {
                    name: 'Công ty mây tre đan mỹ nghệ',
                    description: `Công ty sản xuất mây tre đan mỹ nghệ`
                },
                {
                    name: 'Khách Lẻ',
                    description: `Khách Lẻ`
                },
                
            ]);
        });
};
