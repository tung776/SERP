
exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('quoctes')
        .then(() => {
            // Inserts seed entries
            return knex('quoctes').insert([
                {//id =1
                    customerId: 1, 
                    date: '10-09-2017',                  
                    title: 'Bao Gia Tu Sim 01',
                },
                {//id =2
                    customerId: 2,  
                    date: '10-09-2017',                  
                    title: 'Bao Gia My Nghe 01',
                },
                {//id =3
                    customerId: 1,  
                    date: '10-09-2017',                  
                    title: 'Bao Gia Tu Sim 02',
                },
                {//id =4
                    customerId: 2,  
                    date: '10-09-2017',                  
                    title: 'Bao Gia My Nghe 02',
                },
                //lập báo giá cho nhóm khách lẻ
                {//id =5
                    customerGroupId: 6, 
                    date: '10-09-2017',                  
                    title: 'Bao Gia Khách lẻ',
                },
                //lập báo giá cho nhóm khách mỹ nghệ mây tre đan
                {//id =6
                    customerGroupId: 5,     
                    date: '10-09-2017',               
                    title: 'Bao Gia Mỹ Nghệ Mây Tre Đan',
                },
                
            ]);
        });
};
