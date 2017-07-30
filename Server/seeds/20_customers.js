
exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('customers')
        .then(() => {
            // Inserts seed entries
            return knex('customers').insert([
                {
                    customerGroupId: 6,
                    bankId: null,
                    companyId: null,
                    name: 'Tư Sim',
                    address: 'Giải phóng - Nam Định',
                    imageUrl: '',
                    phone: '',
                    email: '',
                    overdue: 10,
                    excessDebt: 10000000,
                },
            ]);
        });
};
