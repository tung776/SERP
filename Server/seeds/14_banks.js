
exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('banks')
        .then(() => {
            // Inserts seed entries
            return knex('banks').insert([
                {
                    accountNumber: '320 120 100 2867',
                    bankName: `Ngân hàng nông nghiệp thành phố Nam Định`
                },
            ]);
        });
};
