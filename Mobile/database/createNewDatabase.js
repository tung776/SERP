import { SQLite } from 'expo';
import axios from 'axios';
import { URL } from '../../env';
import SqlService from './sqliteService';
import { loadMenusData } from '../actions/menuAction';
import { loadCustomerListDataFromSqlite } from '../actions/customerAction';
import { loadCustomerGroupListDataFromSqlite } from '../actions/customerGroupAction';
import { loadCategoriesDataFromSqlite } from '../actions/categoryActions';
import { loadProductListDataFromSqlite, loadUnits, loadTypeCargo } from '../actions/productActions';
import db from './sqliteConfig';

/*
 Hệ thống sẽ tạo ra các bảng sqlite chứa các dữ liệu thường xuyên sử dụng nhất nhằm tăng
 trải nghiệm của người dùng đối với phẩn mềm
 Khi ứng dụng dc khởi động nó sẽ tự động gửi các version hiện tại của cơ sở dữ liệu đã có trên mobile
 lên server, server sẽ kiểm tra dữ liệu đã mới dc cập nhật chưa, Server chỉ trả về tập dữ liệu cần thiết 
 chứ không trả về toàn bộ dữ liệu
 */
export const resetDatabase = (tx) => {
  tx.executeSql(
    'drop table if exists menus;');
  tx.executeSql(
    'drop table if exists userMenus;');
  tx.executeSql(
    'drop table if exists roles;');
  tx.executeSql(
    'drop table if exists units;');
  tx.executeSql(
    'drop table if exists typeCargoes;');
  tx.executeSql(
    'drop table if exists warehouses;');
  tx.executeSql(
    'drop table if exists categories;');
  tx.executeSql(
    'drop table if exists products;');
  tx.executeSql(
    'drop table if exists customerGroups;');
  tx.executeSql(
    'drop table if exists customers;');
  tx.executeSql(
    'drop table if exists quoctes;');
  tx.executeSql(
    'drop table if exists debtCustomers;');
  tx.executeSql(
    'drop table if exists dataVersions;');
};

export const createDatabaseSqlite = async () => {
  // SqlService.query(
  //   'drop table if exists dataVersions;');
  db.transaction(
    tx => {
      resetDatabase(tx);
      // tx.executeSql('delete from dataVersions where id = 1');
      tx.executeSql(`create table if not exists
         menus (
           id integer primary key not null,
           name text,
           parentId integer
          );`, null,
        null,
        e => console.log('menus error: ', e)
      );
      tx.executeSql(`create table if not exists
         userMenus (
           menuId integer,
           userId integer,
           parentId,
           name text
          );`, null,
        null,
        e => console.log('userMenus error: ', e)
      );
      tx.executeSql(`create table if not exists
         roles (
           id integer primary key not null,
           name text
          );`, null,
        null,
        e => console.log('roles error: ', e)
      );
      tx.executeSql(`create table if not exists
         categories (
           id integer primary key not null,
           name text,
           description text,
           imageUrl text
          );`, null,
        null,
        e => console.log('categories error: ', e)
      );
      tx.executeSql(`create table if not exists
         units (
           id integer primary key not null,
           name text,
           rate real
          );`, null,
        null,
        e => console.log('units error: ', e)
      );
      tx.executeSql(`create table if not exists
         typeCargoes (
           id integer primary key not null,
           name text
          );`, null,
        null,
        e => console.log('typeCargoes error: ', e)
      );
      tx.executeSql(`create table if not exists
         warehouses (
           id integer primary key not null,
           name text,
           description text,
           address text
          );`, null,
        null,
        e => console.log('warehouses error: ', e)
      );
      tx.executeSql(`create table if not exists
         products (
           id integer primary key not null,
           categoryId integer,
           unitId integer,
           typeCargoId integer,
           name text,
           description text,
           imageUrl text,
           isPublic text,
           purchasePrice real,
           salePrice real,
           minQuantity real,
           isAvaiable text
          );`, null,
        null,
        e => console.log('products error: ', e)
      );
      tx.executeSql(`create table if not exists
         customerGroups (
           id integer primary key not null,
           name text,
           description text
          );`, null,
        null,
        e => console.log('customerGroups error: ', e)
      );
      tx.executeSql(`create table if not exists
         quoctes (
           id integer,
           customerId integer,           
           customerGroupId integer,
           date text,
           title text,
           detailId integer,
           unitId integer,
           productId integer,
           price real
          );`, null,
        null,
        e => console.log('quoctes error: ', e)
      );      

      tx.executeSql(`create table if not exists
         customers (
           id integer primary key not null,
           customerGroupId integer,
           name text,
           address text,
           imageUrl text,
           phone text,
           email text,
           overdue integer,
           excessDebt real,
           directorName text,
           bankNumber text,
           bankName text,
           companyName text,
           companyAdress text,
           taxCode text,
           fax text
          );`, null,
        null,
        e => console.log('customers error: ', e)
      );

      tx.executeSql(`create table if not exists
      debtCustomers (
        id integer,
        customerId integer,           
        createdDate text,
        title text,
        newDebt real,
        oldDebt real,
        minus real,
        plus real
       );`, null,
     null,
     e => console.log('quoctes error: ', e)
   );

      tx.executeSql(`create table if not exists
         dataVersions (
           id integer primary key not null,
           menus integer,
           userMenus integer,
           categories integer,
           roles integer,
           units integer,
           typeCargoes integer,
           warehouses integer,
           products integer,
           customerGroups integer,
           customers integer,
           quoctes integer,
           debtCustomers integer
          );`, null,
        null,
        e => console.log('dataVersions error: ', e)
      );
    },
    e => console.log('lỗi tạo các bảng dữ liệu 1 ', e),
    null

  );
};

export const getCurrentDataVersion = async () => await SqlService.select('dataVersions', '*');

export const updateOrInsertDataVersion = async (data) => {
  const avaiabledDataVersion = await SqlService.select('dataVersions', '*', `id = 1`);

  const newDataVersion = [
    data.id, data.menusVersion, data.userMenusVersion, data.categoriesVersion,
    data.rolesVersion, data.unitsVersion, data.typeCargoesVersion, data.warehousesVersion, data.productsVersion,
    data.customerGroupsVersion, data.customersVersion, data.quoctesVersion, data.debtCustomersVersion
  ];

  if (avaiabledDataVersion.length == 0) {
    db.transaction(
      tx => {
        tx.executeSql(`
          insert into dataVersions 
            (id, menus, userMenus, categories, roles, units, typeCargoes, warehouses, products, customerGroups, customers, quoctes, debtCustomers) 
            values (
              '${data.id}', 
              '${data.menusVersion}', 
              '${data.userMenusVersion}', 
              '${data.categoriesVersion}', 
              '${data.rolesVersion}', 
              '${data.unitsVersion}', 
              '${data.typeCargoesVersion}', 
              '${data.warehousesVersion}', 
              '${data.productsVersion}', 
              '${data.customerGroupsVersion}', 
              '${data.customersVersion}',
              '${data.quoctesVersion}',
              '${data.debtCustomersVersion}'
            )
        `);
      },
      (e) => console.log('lỗi lưu dataVersions sqlite: ', e),
      (e) => console.log('success ', e)
    );
  } else {
    if (data != null) {
      let sql = 'UPDATE dataVersions SET ';
      if (data.menusVersion) { sql += `menus = '${data.menusVersion}',`; }
      if (data.userMenusVersion) { sql += `userMenus = '${data.userMenusVersion}',`; }
      if (data.categoriesVersion) { sql += `categories = '${data.categoriesVersion}',`; }
      if (data.rolesVersion) { sql += `roles = '${data.rolesVersion}',`; }
      if (data.unitsVersion) { sql += `units = '${data.unitsVersion}',`; }
      if (data.typeCargoesVersion) { sql += `typeCargoes = '${data.typeCargoesVersion}',`; }
      if (data.warehousesVersion) { sql += `warehouses = '${data.warehousesVersion}',`; }
      if (data.productsVersion) { sql += `products = '${data.productsVersion}',`; }
      if (data.customerGroupsVersion) { sql += `customerGroups = '${data.customerGroupsVersion}',`; }
      if (data.customersVersion) { sql += `customers = '${data.customersVersion}',`; }
      if (data.quoctesVersion) { sql += `quoctes = '${data.quoctesVersion}',`; }
      if (data.debtCustomersVersion) { sql += `debtCustomers = '${data.debtCustomersVersion}',`; }
      console.log('sql = ', sql);
      sql = sql.slice(0, sql.length - 1);
      console.log('sql = ', sql);
      sql += ` WHERE id = 1;`;

      db.transaction(
        tx => {
          tx.executeSql(
            sql
          );
        },
        (e) => console.log('lỗi update dataVersions sqlite: ', e),
        null
      );
    }
  }
  if (data.userMenus && data.userMenus.length > 0) {
    db.transaction(
      tx => {
        tx.executeSql('drop table if exists userMenus;');
        tx.executeSql(`create table if not exists
         userMenus (
           menuId integer,
           userId integer,
           parentId,
           name text
          );`);
        data.userMenus.forEach(async (item) => {
          tx.executeSql(`
            insert into userMenus 
              (userId, menuId, name, parentId) 
              values (
                '${item.userId}',
                '${item.menuId}', 
                '${item.name}', 
                '${item.parentId}'
              )
          `);

        }, this);
      },
      (e) => console.log('lỗi lưu menuUser sqlite: ', e),
      null
    );
  }

  if (data.categories) {
    data.categories.forEach(async (item) => {
      // console.log("categories item = ", item);
      const avaiabledData = await SqlService.select('categories', '*', `id = ${item.id}`);
      if (avaiabledData.length == 0) {
        SqlService.insert('categories', ['id', 'name', 'description', 'imageUrl'],
          [item.id, item.name, item.description, item.imageUrl]);
      } else {
        db.transaction(
          tx => {
            tx.executeSql(`
              update categories 
              set name = ${item.name},
              description = ${item.description},
              imageUrl = ${item.imageUrl}
              where id = ${item.id}
              `);
          },
          null,
          e => console.log('error when update category', e)
        );
      }
    }, this);
  }
  if (data.customerGroups) {
    data.customerGroups.forEach(async (item) => {
      // console.log("categories item = ", item);
      const avaiabledData = await SqlService.select('customerGroups', '*', `id = ${item.id}`);
      if (avaiabledData.length == 0) {
        SqlService.insert('customerGroups', ['id', 'name', 'description'],
          [item.id, item.name, item.description]);
      } else {
        db.transaction(
          tx => {
            tx.executeSql(`
              update customerGroups 
              set name = ${item.name},
              description = ${item.description}
              where id = ${item.id}
              `);
          },
          null,
          e => console.log('error when update customerGroups', e)
        );
      }
    }, this);
  }

  if (data.units) {
    data.units.forEach(async (item) => {
      const avaiabledData = await SqlService.select('units', '*', `id = ${item.id}`);
      if (avaiabledData.length == 0) {
        SqlService.insert('units', ['id', 'name', 'rate'],
          [item.id, item.name, item.rate]);
      } else {
        db.transaction(
          tx => {
            tx.executeSql(`
              update units 
              set name = ${item.name},
              rate = ${item.rate}
              where id = ${item.id} 
              `);
          },
          null,
          e => console.log('error when update units', e)
        );
      }
    }, this);
  }

  if (data.typeCargoes) {
    data.typeCargoes.forEach(async (item) => {
      const avaiabledData = await SqlService.select('typeCargoes', '*', `id = ${item.id}`);
      if (avaiabledData.length == 0) {
        SqlService.insert('typeCargoes', ['id', 'name'],
          [item.id, item.name]);
      } else {
        db.transaction(
          tx => {
            tx.executeSql(`
              update typeCargoes 
              set name = ${item.name}
              where id = ${item.id} 
              `);
          },
          null,
          e => console.log('error when update typeCargoes', e)
        );
      }
    }, this);
  }

  if (data.roles) {
    data.roles.forEach(async (item) => {
      const avaiabledData = await SqlService.select('roles', '*', `id = '${item.id}'`);
      // console.log('avaiabledData in units', avaiabledData)
      if (avaiabledData.length == 0) {
        // console.log("go insert roles");
        SqlService.insert('roles', ['id', 'name'],
          [item.id, item.name]);
      } else {
        db.transaction(
          tx => {
            tx.executeSql(`
              update roles 
              set name = ${item.name} 
              where id = ${item.id} 
              `);
          },
          null,
          e => console.log('error when update roles', e)
        );
      }
    }, this);
  }

  if (data.warehouses) {
    data.warehouses.forEach(async (item) => {
      const avaiabledData = await SqlService.select('warehouses', '*', `id = '${item.id}'`);
      if (avaiabledData.length == 0) {
        SqlService.insert('warehouses', ['id', 'name', 'description', 'address'],
          [item.id, item.name, item.description, item.address]);
      } else {
        db.transaction(
          tx => {
            tx.executeSql(`
              update warehouses 
              set name = ${item.name},
              description = ${item.description},
              address = ${item.address}
              where id = ${item.id} 
              `);
          },
          null,
          e => console.log('error when update warehouses', e)
        );
      }
    }, this);
  }
  if (data.quoctes) {

    data.quoctes.forEach(async (item) => {
      let strSql = "";
      strSql = `detailId = ${item.detailId}`;

      const avaiabledData = await SqlService.select('quoctes', '*', strSql, []);

      db.transaction(
        tx => {

          if (avaiabledData.length === 0) {
            tx.executeSql(`
                insert into quoctes 
                (
                  id,
                  customerId,
                  customerGroupId,
                  title,
                  date,
                  detailId,
                  unitId,
                  productId,
                  price
                ) 
                values (
                  ${item.id},
                  '${item.customerId}',
                  '${item.customerGroupId}',
                  '${item.title}',
                  '${item.date}',
                  ${item.detailId},
                  ${item.unitId},
                  ${item.productId},
                  ${item.price}
                )
              `,
                null,
                null,
                (e) => {
                  console.log('lỗi insert quoctes = ', e);
                }
            );
          } else {
            tx.executeSql(`
              update quoctes 
              set date = '${item.date}',
              title = '${item.title}',
              price = ${item.price},
              customerId = ${item.customerId},
              customerGroupId = ${item.customerGroupId},
              productId = ${item.productId},
              unitId = ${item.unitId}
              where detailId = ${item.detailId}
              `,
                null,
                null,
                (e) => {
                  console.log('lỗi update quoctes = ', e);
                }
              );
          }
        },
        null
      );
    },
      this);
  }


  if (data.customers) {
    data.customers.forEach(async (item) => {
      const avaiabledData = await SqlService.select('customers', '*', `id = '${item.id}'`);
      if (avaiabledData.length == 0) {
        SqlService.insert('customers', [
          'id',
          'customerGroupId',
          'name',
          'address',
          'imageUrl',
          'phone',
          'email',
          'overdue',
          'excessDebt',
          'directorName',
          'bankNumber',
          'bankName',
          'companyName',
          'companyAdress',
          'taxCode',
          'fax'
        ], [
            item.id, item.customerGroupId, item.name, item.address,
            item.imageUrl, item.phone, item.email, item.overdue,
            item.excessDebt, item.directorName, item.bankNumber, item.bankName,
            item.companyName, item.companyAdress, item.taxCode, item.fax
          ]);
      } else {
        db.transaction(
          tx => {
            tx.executeSql(`
              update customers 
              set name = ${item.name},
              customerGroupId = ${item.customerGroupId},
              address = ${item.address},
              imageUrl = ${item.imageUrl},
              phone = ${item.phone},
              email = ${item.email},
              overdue = ${item.overdue},
              excessDebt = ${item.excessDebt},
              directorName = ${item.directorName},
              bankNumber = ${item.bankNumber},
              bankName = ${item.bankName},
              companyName = ${item.companyName},
              companyAdress = ${item.companyAdress},
              taxCode = ${item.taxCode},
              fax = ${item.fax}
              where id = ${item.id} 
              `);
          },
          null,
          e => console.log('error when update customers', e)
        );
      }
    }, this);
  }
  
  if (data.debtCustomers) {
    data.debtCustomers.forEach(async (item) => {
      const avaiabledData = await SqlService.select('debtCustomers', '*', `id = '${item.id}'`);
      if (avaiabledData.length == 0) {
        SqlService.insert('debtCustomers', [
          'id',
          'customerId',
          'createdDate',
          'title',
          'newDebt',
          'oldDebt',
          'minus',
          'plus'
        ], [
            item.id, item.customerId, item.createdDate, item.title,
            item.newDebt, item.oldDebt, item.minus, item.plus
          ]);
      } else {
        db.transaction(
          tx => {
            tx.executeSql(`
              update debtCustomers 
              set customerId = ${item.customerId},
              createdDate = ${item.createdDate},
              title = ${item.title},
              newDebt = ${item.newDebt},
              oldDebt = ${item.oldDebt},
              minus = ${item.minus},
              plus = ${item.plus}
              where id = ${item.id} 
              `);
          },
          null,
          e => console.log('error when update debtCustomers', e)
        );
      }
    }, this);
  }

  if (data.products) {
    data.products.forEach(async (item) => {
      const avaiabledData = await SqlService.select('products', '*', `id = '${item.id}'`);
      if (avaiabledData.length == 0) {
        SqlService.insert('products', [
          'id', 'categoryId', 'unitId', 'typeCargoId', 'name', 'description',
          'imageUrl', 'isPublic', 'purchasePrice', 'salePrice', 'minQuantity', 'isAvaiable'
        ], [
            item.id, item.categoryId, item.unitId, item.typeCargoId, item.name, item.description,
            item.imageUrl, item.isPublic, item.purchasePrice, item.salePrice, item.minQuantity, item.isAvaiable
          ]);
      } else {
        db.transaction(
          tx => {
            tx.executeSql(`
          update products 
          set categoryId = ${item.categoryId},
          unitId = ${item.unitId},
          typeCargoId = ${item.typeCargoId},
          name = ${item.name},
          description = ${item.description},
          isPublic = '${item.isPublic}',
          imageUrl = ${item.imageUrl},
          purchasePrice = ${item.purchasePrice},
          salePrice = ${item.salePrice},
          minQuantity = ${item.minQuantity},
          isAvaiable = '${item.isAvaiable}'
          where id = ${item.id} 
          `);
          },
          null,
          e => console.log('error when update products', e)
        );
      }
    }, this);
  }
};

export const checkDataVersion = async (userId, store) => {
  try {
    await SqlService.select('dataVersions', '*', 'id = 1').then(
      async (currentVersion) => {
        if (!currentVersion[0]) {
          currentVersion[0] = {
            id: 0,
            menus: 0,
            userMenus: 0,
            roles: 0,
            units: 0,
            typeCargoes: 0,
            warehouses: 0,
            categories: 0,
            products: 0,
            customerGroups: 0,
            customers: 0,
            quoctes: 0,
            debtCustomers: 0
          };
        }
        const { id, menus, userMenus,
          roles, units, typeCargoes,
          warehouses, categories,
          products, customerGroups,
          customers, quoctes, debtCustomers } = currentVersion[0];
        const data = await axios.post(`${URL}/api/data/checkDataVersion`, {
          id,
          menus,
          userMenus,
          roles,
          units,
          typeCargoes,
          warehouses,
          products,
          categories,
          customerGroups,
          customers,
          quoctes,
          debtCustomers,
          userId
        }); 
        
        await updateOrInsertDataVersion(data.data);
        await store.dispatch(loadCustomerListDataFromSqlite());
        await store.dispatch(loadCustomerGroupListDataFromSqlite());
        await store.dispatch(loadCategoriesDataFromSqlite());
        await store.dispatch(loadProductListDataFromSqlite());
        await store.dispatch(loadUnits());
        await store.dispatch(loadTypeCargo());
        await store.dispatch(loadMenusData());

        // await getCurrentDataVersion().then(
        //   newData =>
        //     console.log("dataversion after updateOrInsert =", newData)
        // );
        // SqlService.query(`select * from 'quoctes'`, null).then(
        //   result => console.log("quoctes = ", result)
        // );
        // const a = await SqlService.select('quoctes', '*');
        // console.log("a = ", a);

        // SqlService.select('roles', '*').then(
        //   result => console.log("roles = ", result)
        // );
        // SqlService.select('categories', '*').then(
        //   result => console.log('categories = ', result)
        // );
      }
    );
  } catch (err) {
    console.log(err);
  }
};
