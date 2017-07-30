
exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('warehouses')
        .then(() => {
            // Inserts seed entries
            return knex('warehouses').insert([
                {
                    name: 'Cửa Hàng',
                    description: `Cửa hàng chính`,
                    address: `152 Giải Phóng - Cửa Bắc - TP Nam Định`
                },
                {
                    name: 'Xưởng sản xuất',
                    description: `Xưởng sản xuất`,
                    address: `Số 01 Trần Nhân Tông - TP Nam Định`
                },
            ]);
        });
};
