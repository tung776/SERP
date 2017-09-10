

exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('debtCustomers')
        .then(() => {
            // Inserts seed entries
            return knex('debtCustomers').insert([
                {
                    customerId: 1,                   
                    title: 'Công nợ Tư Sim',
                    newDebt: 0,
                    oldDebt: 0,
                    minus: 0,
                    plus: 0
                },
                {
                    customerId: 2,                   
                    title: 'Công nợ Mỹ Nghệ',
                    newDebt: 0,
                    oldDebt: 0,
                    minus: 0,
                    plus: 0
                },
                {
                    customerId: 3,                  
                    title: '',
                    newDebt: 0,
                    oldDebt: 0,
                    minus: 0,
                    plus: 0
                },
                {
                    customerId: 4,                  
                    title: '',
                    newDebt: 0,
                    oldDebt: 0,
                    minus: 0,
                    plus: 0
                },
                {
                    customerId: 5,                  
                    title: '',
                    newDebt: 0,
                    oldDebt: 0,
                    minus: 0,
                    plus: 0
                },
                {
                    customerId: 6,                 
                    title: '',
                    newDebt: 0,
                    oldDebt: 0,
                    minus: 0,
                    plus: 0
                },
                {
                    customerId: 7,                   
                    title: '',
                    newDebt: 0,
                    oldDebt: 0,
                    minus: 0,
                    plus: 0
                },
                {
                    customerId: 8,                  
                    title: '',
                    newDebt: 0,
                    oldDebt: 0,
                    minus: 0,
                    plus: 0
                },
                {
                    customerId: 9,                 
                    title: '',
                    newDebt: 0,
                    oldDebt: 0,
                    minus: 0,
                    plus: 0
                },
                {
                    customerId: 10,                 
                    title: '',
                    newDebt: 0,
                    oldDebt: 0,
                    minus: 0,
                    plus: 0
                },
            ]);
        });
};
