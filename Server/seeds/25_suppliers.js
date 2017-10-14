
exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('suppliers')
        .then(() => {
            // Inserts seed entries
            return knex('suppliers').insert([
                {          
                    name: 'Công ty TNHH FSI',
                    address: 'Hà Nội',
                    imageUrl: '',
                    phone: '0916678845',
                    email: 'thanhtung776@gmail.com',
                    CurentDebt: 0,
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
                    name: 'Công ty TNHH hóa chất Trường Phát',
                    address: 'Hà Nội',
                    imageUrl: '',
                    phone: '0916545545',
                    email: 'mynghenamha@gmail.com',
                    CurentDebt: 0,
                    overdue: 10,
                    excessDebt: 10000000,
                    directorName: 'Nguyen Thị Hằng',
                    bankNumber: 320320100556,
                    bankName: 'Ngân hàng sacombank Hà Nội',
                    companyName: 'Công ty TNHH hóa chất Trường Phát',
                    companyAdress: 'Hà Nội',
                    taxCode: 354656458,
                    fax: ''
                },
                {                 
                    name: 'Hà Anh Phát',
                    address: 'Hà Nội',
                    imageUrl: '',
                    phone: '0916678845',
                    email: 'thanhtung776@gmail.com',
                    CurentDebt: 0,
                    overdue: 10,
                    excessDebt: 10000000,
                    directorName: null,
                    bankNumber: null,
                    bankName: null,
                    companyName: 'Công ty TNHH Hà Anh Phát',
                    companyAdress: null,
                    taxCode: null,
                    fax: ''
                },
                {              
                    name: 'MIKA',
                    address: 'TP Hồ Chí Minh',
                    imageUrl: '',
                    phone: '0916545545',
                    email: 'mynghenamha@gmail.com',
                    CurentDebt: 0,
                    overdue: 10,
                    excessDebt: 10000000,
                    directorName: '...',
                    bankNumber: 320320100556,
                    bankName: 'Ngân hàng nông nghiệp HCM',
                    companyName: 'Công ty TNHH MIKA',
                    companyAdress: 'TP Hồ Chí Minh',
                    taxCode: 354656458,
                    fax: ''
                }
            ]);
        });
};
