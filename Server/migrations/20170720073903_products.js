
exports.up = function (knex, Promise) {
    return knex.schema.createTableIfNotExits('roles', function (table) {
        table.increments();
        table.string("name").notNullable().unique();
        table.string("description");
        table.timestamps();
    })
        .createTableIfNotExits("departments", function(table){
            table.increments();
            table.string("name").notNullable().unique();
            table.string("description");
            table.timestamps();
        })
        .createTableIfNotExits('banks', function(table) {
            table.increments();
            table.string('accountNumber').unique().notNullable();
            table.string('bankName').notNullable();
        })
        .createTableIfNotExits("companies", function(table) {
            table.increments();
            table.string("name").notNullable().unique();
            table.string("englishName");
            table.string("address").notNullable();
            table.string("taxtCode").unique();
            table.integer('bankId').references('id').inTable('banks');
            table.string("phone");
            table.string("email");
            table.string("website");
            table.string("logoUrl");
            table.string("director");
            table.timestamps();
        })
        .createTableIfNotExits("units", function(table) {
            table.increments();
            table.string("name").unique().notNullable();
            table.string("rate").notNullable();
        })
        .createTableIfNotExits("warehouses", function(table) {
            table.increments();
            table.string("name").unique().notNullable();
            table.string("description");
            table.string("address");
        })
        .createTableIfNotExits("customerGroups", function(table) {
            table.increments();
            table.string("name").notNullable().unique();
            table.string("description");
            table.timestamps();
        })
        .createTableIfNotExits('supplierGroups', function(table) {
            table.increments();
            table.string('name').unique().notNullable();
            table.string('description')
        })
        .createTableIfNotExists('categories', function (table) {
            table.increments();
            table.string('name').notNullable().unique();
            table.string('description');
            table.timestamps();
        })
        .createTableIfNotExists('users', function (table) {
            table.increments();
            table.string('username').unique();
            table.string('email').unique();
            table.string('password').notNullable();
            table.string('firstName').notNullable();
            table.string('lastName').notNullable();
            table.string('phone').notNullable();
            table.string('address');
            table.integer('roleId').notNullable().references("id").inTable("roles");
            table.integer('departmentId').notNullable().references("id").inTable("departments");
            table.string('gender').notNullable();
            table.string('rememberToken');
            table.timestamps();
        })        
        .createTableIfNotExits("customers", function(table) {
            table.increments();
            table.integer("customerGroupId").notNullable().references("id").inTable("customerGroups");
            table.string('name').unique().notNullable();
            table.integer('bankId').references('id').inTable('banks');
            table.interger('companyId').references('id').inTable('companies');
            table.string('address');
            table.string('imageUrl');
            table.string('phone');
            table.string('email');
            table.interger('overdue'); //Số ngày nợ cho phép, vượt quá sẽ bị hệ thống liệt kê trong ds đòi nợ
            table.float('excessDebt'); //Nợ vượt mức cho phép
        })
        .createTableIfNotExits('debtCustomers', function(table) {
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
        .createTableIfNotExists('paymentCustomers', function() {
            table.increments();
            table.integer('debtCustomerId').references('id').inTable('debtCustomers');
            table.integer('customerId').references('id').inTable('customers');
            table.date('createdDate').notNullable();
            table.string('title');
            table.date('createdDate').notNullable();
            table.string('description');
            table.float('amount').defaultTo(0);
        })
        .createTableIfNotExits("suppliers", function(table) {
            table.increments();
            table.integer("supplierGroupId").notNullable().references("id").inTable("supplierGroups");
            table.string('name').unique().notNullable();
            table.integer('bankId').references('id').inTable('banks');
            table.interger('companyId').references('id').inTable('companies');
            table.string('address');
            table.string('imageUrl');
            table.string('phone');
            table.string('email');
            table.interger('overdue'); //Số ngày nợ cho phép, vượt quá sẽ bị hệ thống liệt kê trong ds trả nợ
            table.float('excessDebt') //Nợ vượt mức cho phép
            
        })
        .createTableIfNotExits('debtSuppliers', function(table) {
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
        .createTableIfNotExists('paymentSuppliers', function() {
            table.increments();
            table.integer('debtSupplierId').references('id').inTable('debtSuppliers');
            table.integer('supplierId').references('id').inTable('suppliers');
            table.string('title');
            table.date('createdDate').notNullable();
            table.string('description');
            table.float('amount').defaultTo(0);
        })
        .createTableIfNotExits('typeCargoes', function(table) {
            //Định nghĩa loại hàng hóa là sản phẩm hay là nguyên liệu
            table.increments();
            table.string('name');
        })
        .createTableIfNotExits('products', function(table) {
            table.increments();
            table.integer('categoryId').references('id').inTable('categories');
            table.integer('unitId').references('id').inTable('units');
            table.integer('typeCargoId').references('id').inTable('typeCargoes');
            table.string('name').unique().notNullable();
            table.string('description');
            table.string('imageUrl');
            table.boolean('isPublic').defaultTo(false);
            table.float('purchasePrice');
            table.float('salePrice');
            table.float('minQuantity');//Lượng tồn kho tối thiểu,
            table.boolean('isAvaiable').defaultTo(true);// Hàng có sẵn trong kho không
        })
        .createTableIfNotExists('orderTypes', function(table) {
            table.increments();
            table.string('name').notNullable();
        })
        .createTableIfNotExists('saleOrders', function(table) {
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
            table.string('note').defaultTo(0);;
            table.float('total').defaultTo(0);;
            table.float('vat').defaultTo(0);;
            table.float('totalIncludeVat').defaultTo(0);
        })
        .createTableIfNotExists('saleOderDetails', function(table) {
            table.increments();
            table.integer('saleOrderId').notNullable().references('id').inTable('saleOrders');
            table.integer('productId').notNullable().unique().references('id').inTable('products');
            table.integer('unitId').notNullable().references('id').inTable('units');
            table.integer('warehorseId').notNullable().references('id').inTable('warehouses');
            table.float('quantity').defaultTo(0);
            table.float('price').defaultTo(0);
            table.float('total').defaultTo(0);            
        })
        .createTableIfNotExists('purchaseOrders', function(table) {
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
            table.string('note').defaultTo(0);;
            table.float('total').defaultTo(0);;
            table.float('vat').defaultTo(0);;
            table.float('totalIncludeVat').defaultTo(0);
        })
        .createTableIfNotExists('purchaseOrderDetails', function(table) {
            table.increments();
            table.integer('purchaseOrderId').notNullable().references('id').inTable('purchaseOrders');
            table.integer('productId').notNullable().unique().references('id').inTable('products');
            table.integer('unitId').notNullable().references('id').inTable('units');
            table.integer('warehorseId').notNullable().references('id').inTable('warehouses');
            table.float('quantity').defaultTo(0);
            table.float('price').defaultTo(0);
            table.float('total').defaultTo(0);            
        })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTableIfExists('roles')
        .dropTableIfExists('departments')
        .dropTableIfExists('banks')
        .dropTableIfExists('companies')
        .dropTableIfExists('units')
        .dropTableIfExists('warehouses')
        .dropTableIfExists('customerGroups')
        .dropTableIfExists('supplierGroups')
        .dropTableIfExists('categories')
        .dropTableIfExists('users')
        .dropTableIfExists('customers')
        .dropTableIfExists('debtCustomers')
        .dropTableIfExists('paymentCustomers')
        .dropTableIfExists('suppliers')
        .dropTableIfExists('debtSuppliers')
        .dropTableIfExists('paymentSuppliers')
        .dropTableIfExists('typeCargoes')
        .dropTableIfExists('products')
        .dropTableIfExists('orderTypes')
        .dropTableIfExists('saleOrders')
        .dropTableIfExists('saleOderDetails')
        .dropTableIfExists('purchaseOrders')
        .dropTableIfExists('purchaseOrderDetails');
};
