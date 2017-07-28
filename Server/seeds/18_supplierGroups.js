
exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('supplierGroups')
        .then(() => {
            // Inserts seed entries
            return knex('supplierGroups').insert([
                {
                    id: 1,
                    name: 'Nhà cung cấp Nguyên Liệu',
                    description: `Nhà cung cấp nguyên liệu sản xuất`
                },
            ]);
        });
};
