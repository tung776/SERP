import moment from '../../Shared/utils/moment';

exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('debtCustomers')
        .then(() => {
            // Inserts seed entries
            return knex('debtCustomers').insert([
                {
                    customerId: 1,    
                    date: moment().format('YYYY-MM-DD'),                
                    title: 'Công nợ Tư Sim',
                    newDebt: 0,
                    oldDebt: 0,
                    minus: 0,
                    plus: 0
                },
                {
                    customerId: 2,            
                    date: moment().format('YYYY-MM-DD'),        
                    title: 'Công nợ Mỹ Nghệ',
                    newDebt: 0,
                    oldDebt: 0,
                    minus: 0,
                    plus: 0
                },
                {
                    customerId: 3,         
                    date: moment().format('YYYY-MM-DD'),           
                    title: '',
                    newDebt: 0,
                    oldDebt: 0,
                    minus: 0,
                    plus: 0
                },
                {
                    customerId: 4,        
                    date: moment().format('YYYY-MM-DD'),            
                    title: '',
                    newDebt: 0,
                    oldDebt: 0,
                    minus: 0,
                    plus: 0
                },
                {
                    customerId: 5,     
                    date: moment().format('YYYY-MM-DD'),               
                    title: '',
                    newDebt: 0,
                    oldDebt: 0,
                    minus: 0,
                    plus: 0
                },
                {
                    customerId: 6,     
                    date: moment().format('YYYY-MM-DD'),               
                    title: '',
                    newDebt: 0,
                    oldDebt: 0,
                    minus: 0,
                    plus: 0
                },
                {
                    customerId: 7,    
                    date: moment().format('YYYY-MM-DD'),                
                    title: '',
                    newDebt: 0,
                    oldDebt: 0,
                    minus: 0,
                    plus: 0
                },
                {
                    customerId: 8,          
                    date: moment().format('YYYY-MM-DD'),          
                    title: '',
                    newDebt: 0,
                    oldDebt: 0,
                    minus: 0,
                    plus: 0
                },
                {
                    customerId: 9,   
                    date: moment().format('YYYY-MM-DD'),                 
                    title: '',
                    newDebt: 0,
                    oldDebt: 0,
                    minus: 0,
                    plus: 0
                },
                {
                    customerId: 10,  
                    date: moment().format('YYYY-MM-DD'),                  
                    title: '',
                    newDebt: 0,
                    oldDebt: 0,
                    minus: 0,
                    plus: 0
                },
            ]);
        });
};
