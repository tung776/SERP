
exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('quoctes')
        .then(() => {
            // Inserts seed entries
            return knex('quoctes').insert([
                {
                    customerId: 1,                    
                    title: 'Bao Gia Tu Sim 01',
                },
                {
                    customerId: 2,                    
                    title: 'Bao Gia My Nghe 01',
                },
                {
                    customerId: 1,                    
                    title: 'Bao Gia Tu Sim 02',
                },
                {
                    customerId: 2,                    
                    title: 'Bao Gia My Nghe 02',
                },
                
            ]);
        });
};
