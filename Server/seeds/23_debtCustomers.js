
exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('debtCustomers')
        .then(() => {
            // Inserts seed entries
            return knex('debtCustomers').insert([
                {
                    customerId: 1,                    
                    title: 'Công nợ Tư Sim',
                    newDebt: 20000000,
                    oldDebt: 15000000,
                    minus: 5000000,
                    plus: 10000000
                },
                {
                    customerId: 2,                    
                    title: 'Công nợ Mỹ Nghệ',
                    newDebt: 29000000,
                    oldDebt: 39000000,
                    minus: 30000000,
                    plus: 20000000
                }
            ]);
        });
};
