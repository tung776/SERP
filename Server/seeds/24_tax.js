

exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('tax')
        .then(() => {
            // Inserts seed entries
            return knex('tax').insert([
                {
                    name: 'VAT 0',
                    rate: 0
                },
                {
                    name: 'VAT 5',
                    rate: 0.05
                },
                {
                    name: 'VAT 10',
                    rate: 0.1
                },
                
            ]);
        });
};
