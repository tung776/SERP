
exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('quocteDetails')
        .then(() => {
            // Inserts seed entries
            return knex('quocteDetails').insert([
                {
                    quocteId: 1,                    
                    productId: 1,
                    unitId: 1,
                    price: 53000
                },
                {
                    quocteId: 1,                    
                    productId: 2,
                    unitId: 8,
                    price: 4300000
                },
                {
                    quocteId: 2,                    
                    productId: 1,
                    unitId: 1,
                    price: 55000
                },
                {
                    quocteId: 2,                    
                    productId: 2,
                    unitId: 8,
                    price: 4500000
                },
                {
                    quocteId: 3,                    
                    productId: 1,
                    unitId: 1,
                    price: 54000,
                },
                {
                    quocteId: 3,                    
                    productId: 2,
                    unitId: 8,
                    price: 4350000
                },
                {
                    quocteId: 4,                    
                    productId: 1,
                    unitId: 1,
                    price: 55000,
                },
                {
                    quocteId: 4,                    
                    productId: 2,
                    unitId: 8,
                    price: 4600000
                },
                
                
            ]);
        });
};
