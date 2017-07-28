
exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('customerGroups')
        .then(() => {
            // Inserts seed entries
            return knex('customerGroups').insert([
                {
                    id: 1,
                    name: 'Đại lý cấp 1',
                    description: `Đại lý cấp 1`
                },
                {
                    id: 2,
                    name: 'Đại lý cấp 2',
                    description: `Đại lý cấp 2`
                },
                {
                    id: 3,
                    name: 'Đại lý cấp 3',
                    description: `Đại lý cấp 3`
                },
                {
                    id: 4,
                    name: 'Công ty Đồ Gỗ Mỹ Nghệ',
                    description: `Công ty sản xuất đồ gỗ mỹ nghệ`
                },
                {
                    id: 5,
                    name: 'Công ty mây tre đan mỹ nghệ',
                    description: `Công ty sản xuất mây tre đan mỹ nghệ`
                },
                {
                    id: 6,
                    name: 'Khách Lẻ',
                    description: `Khách Lẻ`
                },
                
            ]);
        });
};
