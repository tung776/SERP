
exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('products')
        .then(() => {
            // Inserts seed entries
            return knex('products').insert([
                {
                    categoryId: 1,
                    unitId: 1,
                    typeCargoId: 2,
                    name: 'lót Pu 08',
                    description: 'Lót Pu-08 được sản xuất dựa trên nhựa alkyd cao cấp, giúp lót bám tốt trên mọi chất liệu đồng thời che phủ khuyết tật của bề mặt, giúp bề mặt phẳng hơn tạo điều kiện cho lớp sơn phủ mặt bám chắc trên bề mặt vật liệu',
                    imageUrl: '',
                    isPublic: true,
                    purchasePrice: 35000,
                    salePrice: 53000,
                    minQuantity: 320,
                    isAvaiable: true,
                },
                {
                    id: 2,
                    categoryId: 1,
                    unitId: 1,
                    typeCargoId: 1,
                    name: 'N Butyl acetate',
                    description: 'n-Butyl acetate là hợp chất hữu cơ có công thức phân tử C6H12O2, dạng lỏng, không màu, có mùi dầu chuối, dễ cháy, tan được trong hầu hết các dung môi hữu cơ  như alcohol, glycol, ester, ketone, và tan ít trong nước',
                    imageUrl: '',
                    isPublic: false,
                    purchasePrice: 20500,
                    salePrice: 25000,
                    minQuantity: 4000,
                    isAvaiable: true,
                },
            ]);
        });
};
