

exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('debtCustomers')
        .then(() => {
            // Inserts seed entries
            return knex('debtCustomers').insert([
                {
                    customerId: 1,   
                    createdDate: '10-09-2017',                
                    title: 'Công nợ Tư Sim',
                    newDebt: 0,
                    oldDebt: 0,
                    minus: 0,
                    plus: 0
                },
                {
                    customerId: 2,          
                    createdDate: '10-09-2017',         
                    title: 'Công nợ Mỹ Nghệ',
                    newDebt: 0,
                    oldDebt: 0,
                    minus: 0,
                    plus: 0
                },
                {
                    customerId: 3,    
                    createdDate: '10-09-2017',              
                    title: '',
                    newDebt: 0,
                    oldDebt: 0,
                    minus: 0,
                    plus: 0
                },
                {
                    customerId: 4,      
                    createdDate: '10-09-2017',            
                    title: '',
                    newDebt: 0,
                    oldDebt: 0,
                    minus: 0,
                    plus: 0
                },
                {
                    customerId: 5,   
                    createdDate: '10-09-2017',               
                    title: '',
                    newDebt: 0,
                    oldDebt: 0,
                    minus: 0,
                    plus: 0
                },
                {
                    customerId: 6,     
                    createdDate: '10-09-2017',            
                    title: '',
                    newDebt: 0,
                    oldDebt: 0,
                    minus: 0,
                    plus: 0
                },
                {
                    customerId: 7,   
                    createdDate: '10-09-2017',                
                    title: '',
                    newDebt: 0,
                    oldDebt: 0,
                    minus: 0,
                    plus: 0
                },
                {
                    customerId: 8,    
                    createdDate: '10-09-2017',              
                    title: '',
                    newDebt: 0,
                    oldDebt: 0,
                    minus: 0,
                    plus: 0
                },
                {
                    customerId: 9,   
                    createdDate: '10-09-2017',              
                    title: '',
                    newDebt: 0,
                    oldDebt: 0,
                    minus: 0,
                    plus: 0
                },
                {
                    customerId: 10,    
                    createdDate: '10-09-2017',             
                    title: '',
                    newDebt: 0,
                    oldDebt: 0,
                    minus: 0,
                    plus: 0
                },
            ]);
        });
};
