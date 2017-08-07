
exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('customers')
        .then(() => {
            // Inserts seed entries
            return knex('customers').insert([
                {
                    customerGroupId: 6,                    
                    name: 'Tư Sim',
                    address: 'Giải phóng - Nam Định',
                    imageUrl: '',
                    phone: '',
                    email: '',
                    overdue: 10,
                    excessDebt: 10000000,
                    directorName: null,
                    bankNumber: null,
                    bankName: null,
                    companyName: null,
                    companyAdress: null,
                    taxCode: null,
                    fax: ''
                },
                {
                    customerGroupId: 5,                    
                    name: 'Mỹ Nghệ Nam Hà',
                    address: 'Giải phóng - Nam Định',
                    imageUrl: '',
                    phone: '0916545545',
                    email: 'mynghenamha@gmail.com',
                    overdue: 10,
                    excessDebt: 10000000,
                    directorName: 'Nguyen Van Hien',
                    bankNumber: 320320100556,
                    bankName: 'Ngân hàng nông nghiệp Nam Định',
                    companyName: 'Công ty cổ phần Mỹ Nghệ Nam Hà',
                    companyAdress: 'Cầu Đá Nam Định',
                    taxCode: 354656458,
                    fax: ''
                }
            ]);
        });
};
