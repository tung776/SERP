
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
                    salePrice: 53000
                },
                {
                    quocteId: 1,                    
                    productId: 2,
                    unitId: 8,
                    salePrice: 4300000
                },
                {
                    quocteId: 2,                    
                    productId: 1,
                    unitId: 1,
                    salePrice: 55000
                },
                {
                    quocteId: 2,                    
                    productId: 2,
                    unitId: 8,
                    salePrice: 4500000
                },
                {
                    quocteId: 3,                    
                    productId: 1,
                    unitId: 1,
                    salePrice: 54000,
                },
                {
                    quocteId: 3,                    
                    productId: 2,
                    unitId: 8,
                    salePrice: 4350000
                },
                {
                    quocteId: 4,                    
                    productId: 1,
                    unitId: 1,
                    salePrice: 55000,
                },
                {
                    quocteId: 4,                    
                    productId: 2,
                    unitId: 8,
                    salePrice: 4600000
                },
                //khách mây tre đan
                {
                    quocteId: 5,                    
                    productId: 1,
                    unitId: 1,
                    salePrice: 59000
                },
                {
                    quocteId: 5,                    
                    productId: 2,
                    unitId: 8,
                    salePrice: 4590000
                },
                //khách lẻ
                {
                    quocteId: 6,                    
                    productId: 1,
                    unitId: 1,
                    salePrice: 54000
                },
                {
                    quocteId: 6,                    
                    productId: 2,
                    unitId: 8,
                    salePrice: 4550000
                },            
            ]);
        });
};
