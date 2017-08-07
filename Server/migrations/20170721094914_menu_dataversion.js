
exports.up = function (knex, Promise) {
    return knex.schema.createTableIfNotExists('roles', (table) => {
        table.increments();
        table.string('name').notNullable().unique();
        table.string('description');
        table.timestamps();
    })
        .createTableIfNotExists('permisions', (table) => {
            table.increments();
            table.string('name').notNullable().unique();
            table.string('description');
        })
        .createTableIfNotExists('permisionsRoles', (table) => {
            table.increments();
            table.integer("roleId").references('id').inTable('roles');
            table.integer("permisionId").references('id').inTable('permisions');
            table.timestamps();
        })
        .createTableIfNotExists('departments', (table) => {
            table.increments();
            table.string('name').notNullable().unique();
            table.string('description');
            table.timestamps();
        })
        .createTableIfNotExists('banks', (table) => {
            table.increments();
            table.string('accountNumber').unique().notNullable();
            table.string('bankName').notNullable();
        })
        .createTableIfNotExists('companies', (table) => {
            table.increments();
            table.string('name').notNullable().unique();
            table.string('englishName');
            table.string('address').notNullable();
            table.string('taxtCode').unique();
            table.integer('bankId').references('id').inTable('banks');
            table.string('phone');
            table.string('email');
            table.string('website');
            table.string('logoUrl');
            table.string('director');
            table.timestamps();
        })
        .createTableIfNotExists('units', (table) => {
            table.increments();
            table.string('name').unique().notNullable();
            table.float('rate').notNullable();
        })
        .createTableIfNotExists('warehouses', (table) => {
            table.increments();
            table.string('name').unique().notNullable();
            table.string('description');
            table.string('address');
        })
        .createTableIfNotExists('customerGroups', (table) => {
            table.increments();
            table.string('name').notNullable().unique();
            table.string('description');
            table.timestamps();
        })
        .createTableIfNotExists('supplierGroups', (table) => {
            table.increments();
            table.string('name').unique().notNullable();
            table.string('description');
        })
        .createTableIfNotExists('categories', (table) => {
            table.increments();
            table.string('name').notNullable().unique();
            table.text('description');
            table.string('imageUrl').nullable();
            table.timestamps();
        })
        .createTableIfNotExists('users', (table) => {
            table.increments();
            table.string('username').unique();
            table.string('email').unique();
            table.string('password').notNullable();
            table.string('firstName').notNullable();
            table.string('lastName').notNullable();
            table.string('phone').notNullable();
            table.string('address');
            table.integer('roleId').notNullable().references('id').inTable('roles');
            table.integer('departmentId').notNullable().references('id').inTable('departments');
            table.string('gender').notNullable();
            table.string('rememberToken');
            table.timestamps();
        })
        .createTableIfNotExists('customers', (table) => {
            table.increments();
            table.integer('customerGroupId').notNullable().references('id').inTable('customerGroups');
            table.string('name').unique().notNullable();
            table.string('address');
            table.string('imageUrl');
            table.string('phone');
            table.string('email');
            table.integer('overdue'); //Số ngày nợ cho phép, vượt quá sẽ bị hệ thống liệt kê trong ds đòi nợ
            table.float('excessDebt'); //Nợ vượt mức cho phép
            table.string('directorName').nullable();
            table.string('bankNumber').nullable();
            table.string('bankName').nullable();
            table.string('companyName').nullable();
            table.string('companyAdress').nullable();
            table.string('taxCode').nullable();
            table.string('fax').nullable();
        })
        .createTableIfNotExists('debtCustomers', (table) => {
            /*
            Mỗi hóa đơn, phiêu thu đều phải tham chiếu tới bảng này
            Mỗi khi phát sinh giao dịch, thì sẽ phát sinh 1 dòng phản ảnh công nợ hiện tại
            Khi điều chỉnh hóa đơn, phiếu thu, xóa hóa đơn, phiếu thu thì cũng cần phải thay đổi
            công nợ ở bảng này.
            Trong trường hợp thay đổi hóa đơn, phiếu thu đã lập trước đó thì cũng cần thay đổi toàn bộ
            công nợ phát sinh sau ngày hóa đơn, phiếu thu bị thay đổi
            */
            table.increments();
            table.integer('customerId').notNullable().references('id').inTable('customers');
            table.date('createdDate').notNullable();
            table.string('title').notNullable();
            table.float('newDebt').defaultTo(0);
            table.float('oldDebt').defaultTo(0);
            table.float('minus').defaultTo(0);
            table.float('plus').defaultTo(0);
            table.timestamps();
        })
        .createTableIfNotExists('paymentCustomers', (table) => {
            table.increments();
            table.integer('debtCustomerId').references('id').inTable('debtCustomers');
            table.integer('customerId').references('id').inTable('customers');
            table.date('createdDate').notNullable();
            table.string('title');
            table.string('description');
            table.float('amount').defaultTo(0);
        })
        .createTableIfNotExists('suppliers', (table) => {
            table.increments();
            table.integer('supplierGroupId').notNullable().references('id').inTable('supplierGroups');
            table.string('name').unique().notNullable();
            table.integer('bankId').references('id').inTable('banks');
            table.integer('companyId').references('id').inTable('companies');
            table.string('address');
            table.string('imageUrl');
            table.string('phone');
            table.string('email');
            table.integer('overdue'); //Số ngày nợ cho phép, vượt quá sẽ bị hệ thống liệt kê trong ds trả nợ
            table.float('excessDebt'); //Nợ vượt mức cho phép
        })
        .createTableIfNotExists('debtSuppliers', (table) => {
            /*
            Mỗi hóa đơn, phiêu chi đều phải tham chiếu tới bảng này
            Mỗi khi phát sinh giao dịch, thì sẽ phát sinh 1 dòng phản ảnh công nợ hiện tại
            Khi điều chỉnh hóa đơn, phiếu chi, xóa hóa đơn, phiếu chi thì cũng cần phải thay đổi
            công nợ ở bảng này.
            Trong trường hợp thay đổi hóa đơn, phiếu chi đã lập trước đó thì cũng cần thay đổi toàn bộ
            công nợ phát sinh sau ngày hóa đơn, phiếu chi bị thay đổi
            */
            table.increments();
            table.integer('supplierId').notNullable().references('id').inTable('suppliers');
            table.date('createdDate').notNullable();
            table.string('title').notNullable();
            table.float('newDebt').defaultTo(0);
            table.float('oldDebt').defaultTo(0);
            table.float('minus').defaultTo(0);
            table.float('plus').defaultTo(0);
            table.timestamps();
        })
        .createTableIfNotExists('paymentSuppliers', (table) => {
            table.increments();
            table.integer('debtSupplierId').references('id').inTable('debtSuppliers');
            table.integer('supplierId').references('id').inTable('suppliers');
            table.string('title');
            table.date('createdDate').notNullable();
            table.string('description');
            table.float('amount').defaultTo(0);
        })
        .createTableIfNotExists('typeCargoes', (table) => {
            //Định nghĩa loại hàng hóa là sản phẩm hay là nguyên liệu
            table.increments();
            table.string('name');
        })
        .createTableIfNotExists('products', (table) => {
            table.increments();
            table.integer('categoryId').references('id').inTable('categories');
            table.integer('unitId').references('id').inTable('units');
            table.integer('typeCargoId').references('id').inTable('typeCargoes');
            table.string('name').unique().notNullable();
            table.text('description');
            table.string('imageUrl');
            table.boolean('isPublic').defaultTo(false);
            table.float('purchasePrice');
            table.float('salePrice');
            table.float('minQuantity');//Lượng tồn kho tối thiểu,
            table.boolean('isAvaiable').defaultTo(true);// Hàng có sẵn trong kho không
        })
        .createTableIfNotExists('orderTypes', (table) => {
            table.increments();
            table.string('name').notNullable();
        })
        .createTableIfNotExists('saleOrders', (table) => {
            /*
            mỗi hóa đơn sẽ có thể có hoặc không phát sinh phiếu thu 
            (paymentCustomers). Nếu khách hàng
            thanh toán, một phiếu thu sẽ tự động được lập minus = (tổng tiền khách thành toán)
            nếu không thì sẽ ko có phiếu thu nào dc lập
            Công nơ khách hàng sẽ dc lọc thông qua phiếu thu gần nhất để tìm ra sổ nợ của khách hàng
            Mỗi hóa đơn sẽ đi kèm một bản ghi trong sổ nợ khách hàng (debtCustomers) plus = tổng tiền hóa đơn
            Như vậy 1 hóa đơn đã dc thanh toán sẽ phát sinh 2 record trong sổ nợ
            1 cho phát sinh tăng
            1 cho phát sinh giảm
            Khi điều chỉnh hóa đơn cũng dồng thời phải điều chỉnh phiếu thu (nếu có) và sổ nợ
            */
            table.increments();
            table.integer('customerId').notNullable().references('id').inTable('customers');
            table.integer('userId').notNullable().references('id').inTable('users');
            table.integer('paymentCustomerId').nullable().references('id').inTable('paymentCustomers');
            table.integer('debtCustomerId').notNullable().references('id').inTable('debtCustomers');
            table.integer('orderTypeId').notNullable().references('id').inTable('orderTypes');
            table.string('note').defaultTo(0);
            table.float('total').defaultTo(0);
            table.float('vat').defaultTo(0);
            table.float('totalIncludeVat').defaultTo(0);
        })
        .createTableIfNotExists('saleOderDetails', (table) => {
            table.increments();
            table.integer('saleOrderId').notNullable().references('id').inTable('saleOrders');
            table.integer('productId').notNullable().unique().references('id').inTable('products');
            table.integer('unitId').notNullable().references('id').inTable('units');
            table.integer('warehourseId').notNullable().references('id').inTable('warehouses');
            table.float('quantity').defaultTo(0);
            table.float('price').defaultTo(0);
            table.float('total').defaultTo(0);
        })
        .createTableIfNotExists('purchaseOrders', (table) => {
            /*
            mỗi hóa đơn sẽ có thể có hoặc không phát sinh phiếu thu 
            (paymentCustomers). Nếu khách hàng
            thanh toán, một phiếu thu sẽ tự động được lập minus = (tổng tiền khách thành toán)
            nếu không thì sẽ ko có phiếu thu nào dc lập
            Công nơ khách hàng sẽ dc lọc thông qua phiếu thu gần nhất để tìm ra sổ nợ của khách hàng
            Mỗi hóa đơn sẽ đi kèm một bản ghi trong sổ nợ khách hàng (debtCustomers) plus = tổng tiền hóa đơn
            Như vậy 1 hóa đơn đã dc thanh toán sẽ phát sinh 2 record trong sổ nợ
            1 cho phát sinh tăng
            1 cho phát sinh giảm
            Khi điều chỉnh hóa đơn cũng dồng thời phải điều chỉnh phiếu thu (nếu có) và sổ nợ
            */
            table.increments();
            table.integer('supplierId').notNullable().references('id').inTable('suppliers');
            table.integer('userId').notNullable().references('id').inTable('users');
            table.integer('paymentSupplierId').nullable().references('id').inTable('paymentSuppliers');
            table.integer('debtSupplierId').notNullable().references('id').inTable('debtSuppliers');
            table.integer('orderTypeId').notNullable().references('id').inTable('orderTypes');
            table.string('note').defaultTo(0);
            table.float('total').defaultTo(0);
            table.float('vat').defaultTo(0);
            table.float('totalIncludeVat').defaultTo(0);
        })
        .createTableIfNotExists('purchaseOrderDetails', (table) => {
            table.increments();
            table.integer('purchaseOrderId').notNullable().references('id').inTable('purchaseOrders');
            table.integer('productId').notNullable().unique().references('id').inTable('products');
            table.integer('unitId').notNullable().references('id').inTable('units');
            table.integer('warehourseId').notNullable().references('id').inTable('warehouses');
            table.float('quantity').defaultTo(0);
            table.float('price').defaultTo(0);
            table.float('total').defaultTo(0);
        })
        .createTableIfNotExists('formulationTypes', (table) => {
            table.increments();
            table.string('name');
        })
        .createTableIfNotExists('formulations', (table) => {
            table.increments();
            table.integer('userId').references('id').inTable('users');
            table.integer('formulationTypeId').references('id').inTable('formulationTypes');
            table.integer('producId').references('id').inTable('products');
            table.integer('warehourseId').references('id').inTable('warehouses');
            table.integer('unitId').references('id').inTable('units');
            table.float('quantity').defaultTo(0);
            table.boolean('isActive').defaultTo(false);
            table.string('note');
            table.timestamps();
        })
        .createTableIfNotExists('formulationDetails', (table) => {
            table.increments();
            table.integer('formulationId').references('id').inTable('formulations');
            table.integer('productId').references('id').inTable('products');
            table.integer('unitId').references('id').inTable('units');
            table.integer('warehourseId').references('id').inTable('warehouses');
            table.float('quantity').defaultTo(0);
            table.timestamps();
        })
        .createTableIfNotExists('billOfMaterials', (table) => {
            table.increments();
            table.integer('userId').references('id').inTable('users');
            table.integer('producId').references('id').inTable('products');
            table.integer('warehourseId').references('id').inTable('warehouses');
            table.integer('unitId').references('id').inTable('units');
            table.float('quantity').defaultTo(0);
            table.boolean('isActive').defaultTo(false);
            table.string('note');
            table.timestamps();
        })
        .createTableIfNotExists('billOfMaterialDetails', (table) => {
            table.increments();
            table.integer('billOfMaterialId').references('id').inTable('billOfMaterials');
            table.integer('productId').references('id').inTable('products');
            table.integer('unitId').references('id').inTable('units');
            table.integer('warehourseId').references('id').inTable('warehouses');
            table.float('quantity').defaultTo(0);
            table.timestamps();
        })
        .createTableIfNotExists('movingProducts', (table) => {
            table.increments();
            table.integer('userId').references('id').inTable('users');
            table.string('note');
            table.timestamps();
        })
        .createTableIfNotExists('movingProductDetail', (table) => {
            table.increments();
            table.integer('movingProductId').references('id').inTable('movingProducts');
            table.integer('fromWarehourseId').notNullable().references('id').inTable('warehouses');
            table.integer('toWarehourseId').notNullable().references('id').inTable('warehouses');
            table.integer('unitId').references('id').inTable('units');
            table.integer('productId').references('id').inTable('products');
            table.float('quantity').defaultTo(0);
        })
        .createTableIfNotExists('costPrices', (table) => {
            table.increments();
            table.integer('userId').references('id').inTable('users');
            table.string('note');
            table.timestamps();
        })
        .createTableIfNotExists('costPriceDetails', (table) => {
            table.increments();
            table.integer('costPriceId').references('id').inTable('costPrices');
            table.integer('productId').references('id').inTable('products');
            table.integer('unitId').references('id').inTable('units');
            table.float('quantity').defaultTo(0);
            table.float('costAverage').defaultTo(0);
        })
        .createTableIfNotExists('receipts', (table) => {
            //Phiếu thu
            table.increments();
            table.integer('userId').references('id').inTable('users');
            table.float('amount').defaultTo(0);
            table.timestamps();
        })
        .createTableIfNotExists('payTypes', (table) => {
            //Loại Phiếu thu
            table.increments();
            table.string('name').notNullable();
        })
        .createTableIfNotExists('pays', (table) => {
            //Phiếu thu
            table.increments();
            table.integer('userId').references('id').inTable('users');
            table.integer('payTypeId').references('id').inTable('payTypes');
            table.float('amount').defaultTo(0);
            table.timestamps();
        })
        .createTableIfNotExists('menus', (table) => {
            table.increments();
            table.string('name').notNullable();
            table.string('parentId').nullable();
            table.timestamps();
        })
        .createTableIfNotExists('userMenus', (table) => {
            table.increments();
            table.integer('menuId').references('id').inTable('menus');
            table.integer('userId').references('id').inTable('users');
        })
        .createTableIfNotExists('dataVersions', (table) => {
            table.increments();
            table.integer('menus').notNullable().defaultTo(1);
            table.integer('userMenus').notNullable().defaultTo(1);
            table.integer('roles').notNullable().defaultTo(1);
            table.integer('categories').notNullable().defaultTo(1);
            table.integer('units').notNullable().defaultTo(1);
            table.integer('typeCargoes').notNullable().defaultTo(1);
            table.integer('warehouses').notNullable().defaultTo(1);
            table.integer('products').notNullable().defaultTo(1);
            table.integer('customerGroups').notNullable().defaultTo(1);
            table.integer('customers').notNullable().defaultTo(1);
        });
};

exports.down = function (knex, Promise) {
    return knex.schema
        .dropTableIfExists('saleOderDetails')
        .dropTableIfExists('purchaseOrderDetails')
        .dropTableIfExists('purchaseOrders')
        .dropTableIfExists('saleOrders')
        .dropTableIfExists('orderTypes')
        .dropTableIfExists('billOfMaterialDetails')
        .dropTableIfExists('billOfMaterials')
        .dropTableIfExists('formulationDetails')
        .dropTableIfExists('formulations')
        .dropTableIfExists('formulationTypes')
        .dropTableIfExists('movingProductDetail')
        .dropTableIfExists('movingProducts')
        .dropTableIfExists('warehouses')
        .dropTableIfExists('receipts')
        .dropTableIfExists('paymentCustomers')
        .dropTableIfExists('paymentSuppliers')
        .dropTableIfExists('debtCustomers')
        .dropTableIfExists('debtSuppliers')
        .dropTableIfExists('suppliers')
        .dropTableIfExists('customers')
        .dropTableIfExists('pays')
        .dropTableIfExists('payTypes')
        .dropTableIfExists('customerGroups')
        .dropTableIfExists('supplierGroups')
        .dropTableIfExists('companies')
        .dropTableIfExists('banks')
        .dropTableIfExists('costPriceDetails')
        .dropTableIfExists('costPrices')
        .dropTableIfExists('userMenus')
        .dropTableIfExists('permisionsRoles')
        .dropTableIfExists('permisions')
        .dropTableIfExists('users')
        .dropTableIfExists('roles')
        .dropTableIfExists('products')
        .dropTableIfExists('typeCargoes')
        .dropTableIfExists('categories')
        .dropTableIfExists('units')
        .dropTableIfExists('menus')
        .dropTableIfExists('departments')
        .dropTableIfExists('dataVersions');
};
