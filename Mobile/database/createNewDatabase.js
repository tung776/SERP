import { SQLite } from 'expo';
import axios from 'axios';
import { URL } from '../../env';
import SqlService from './sqliteService';

// import { db } from './sqliteService';

/*
 Hệ thống sẽ tạo ra các bảng sqlite chứa các dữ liệu thường xuyên sử dụng nhất nhằm tăng
 trải nghiệm của người dùng đối với phẩn mềm
 Khi ứng dụng dc khởi động nó sẽ tự động gửi các version hiện tại của cơ sở dữ liệu đã có trên mobile
 lên server, server sẽ kiểm tra dữ liệu đã mới dc cập nhật chưa, Server chỉ trả về tập dữ liệu cần thiết 
 chứ không trả về toàn bộ dữ liệu
 */
export const createDatabaseSqlite = async () => {
  await SqlService.query(
    `create table if not exists
         menus (
           id integer primary key not null,
           name text
          );`);
  await SqlService.query(`create table if not exists
         userMenus (
           id integer primary key not null,
           menuId integer,
           userId integer
          );`);

  await SqlService.query(`create table if not exists
         roles (
           id integer primary key not null,
           name text,
           description text
          );`);
  await SqlService.query(`create table if not exists
         categories (
           id integer primary key not null,
           name text,
           description text
          );`);
  await SqlService.query(`create table if not exists
         units (
           id integer primary key not null,
           name text,
           rate real
          );`);
  await SqlService.query(`create table if not exists
         warehouses (
           id integer primary key not null,
           name text,
           description text,
           address text
          );`);
  await SqlService.query(`create table if not exists
         products (
           id integer primary key not null,
           categoryId integer,
           unitId integer,
           typeCargoId integer,
           name text,
           description text,
           imageUrl text,
           isPublic integer,
           purchasePrice real,
           salePrice real,
           minQuantity real,
           isAvaiable integer
          );`);
  await SqlService.query(`create table if not exists
         customerGroups (
           id integer primary key not null,
           name text,
           description text
          );`);
  await SqlService.query(`create table if not exists
         customers (
           id integer primary key not null,
           customerGroupId integer,
           bankId integer,
           companyId integer,
           name text,
           address text,
           imageUrl text,
           phone text,
           email text,
           overdue integer,
           minQuantity real
          );`);
  await SqlService.query(`create table if not exists
         dataVersions (
           id integer primary key not null,
           menus integer,
           userMenus integer,
           categories integer,
           roles integer,
           units integer,
           warehouses integer,
           products integer,
           customerGroups integer,
           customers integer
          );`);



  // ).then(function (res) {
  //   debugger;
  //   console.log(res);
  // });
};

export const getCurrentDataVersion = async () => {
  return await SqlService.query(
    'SELECT * FROM dataVersions;');
};

export const createNewDataVersion = (data) => {
  debugger;
  // return SqlService.insert("dataVersionsdfgdfh", [
  //   "id", "menus", "userMenus", "categories", "roles", "units", "warehouses", "products", "customerGroups", "customers"
  // ], [
  //     data.id, data.menusVersion, data.userMenusVersion, data.categoriesVersion,
  //     data.rolesVersion, data.unitsVersion, data.warehousesVersion, data.productsVersion,
  //     data.customersVersion
  //   ])
  // debugger;
  SqlService.insert('dataVersions', ['id', 'menus', 'userMenus', 'categories', 'roles', 'units', 'warehouses',
    'products', 'customerGroups', 'customers'], [data.id, data.menusVersion, data.userMenusVersion, data.categoriesVersion,
    data.rolesVersion, data.unitsVersion, data.warehousesVersion, data.productsVersion,
    data.customersVersion]);


  // debugger;
  // tx.executeSql(
  //   `INSERT INTO dataVersions (
  //     id, menus, userMenus, categories, roles, units, warehouses, 
  //     products, customerGroups, customers
  //   ) VALUES(
  //     ?, ?, ?,?, ?, ?,?, ?, ?, ?
  //   )`,
  //   [
  //     data.id, data.menusVersion, data.userMenusVersion, data.categoriesVersion,
  //     data.rolesVersion, data.unitsVersion, data.warehousesVersion, data.productsVersion,
  //     data.customersVersion
  //   ]);
  data.userMenus.forEach((item) => {
    SqlService.insert('userMenus', ['menuId', 'name'], [item.menuId, item.name]);
  }, this);
  data.categories.forEach((item) => {
    SqlService.insert('categories', ['id', 'name', 'description'], [item.id, item.name, item.description]);
  }, this);
  data.units.forEach((item) => {
    SqlService.insert('units', ['id', 'name', 'rate'], [item.id, item.name, item.rate]);
  }, this);
  data.warehouses.forEach((item) => {
    SqlService.insert('warehouses', ['id', 'name', 'description', 'address'], [item.id, item.name, item.description, item.address]);
  }, this);
  data.customers.forEach((item) => {
    SqlService.insert('customers', [
      'id', 'customerGroupId',
      'name', 'bankId', 'companyId', 'address',
      'imageUrl', 'phone', 'email', 'overdue', 'excessDebt'
    ], [item.id, item.customerGroupId, item.name, item.bankId, item.companyId, item.address,
    item.imageUrl, item.phone, item.email, item.overdue, item.excessDebt
      ]);
  }, this);
  data.products.forEach((item) => {
    SqlService.insert('products', [
      'id', 'categoryId', 'unitId', 'typeCargoId', 'name', 'description',
      'imageUrl', 'isPublic', 'purchasePrice', 'salePrice', 'minQuantity', 'isAvaiable'
    ], [item.id, item.customerGroupId, item.unitId, item.typeCargoId, item.name, item.description,
    item.imageUrl, item.imageUrl, item.isPublic, item.purchasePrice, item.salePrice, item.minQuantity, item.isAvaiable]);
  }, this);
  data.customerGroups.forEach((item) => {
    SqlService.insert('customerGroups', ['id', 'name', 'description'], [item.id, item.name, item.description]);
  }, this);

  // tx.executeSql(
  //   'SELECT * FROM dataVersions',
  //   [],
  //   (_, { rows: { _array } }) => {
  //     debugger;
  //     console.log('CurrentDataVersion dataVersions = ', _array);
  //   });

  // db.transaction(
  //   tx => {
  //     console.log('begin transaction, data = ', data);
  //     debugger;
  //     tx.executeSql(`insert into dataVersions (
  //       id = ${data.id}, menus = ${data.menusVersion}, userMenus = ${data.userMenusVersion}, categories = ${data.categoriesVersion},
  //       roles = ${data.rolesVersion}, units = ${data.unitsVersion}, warehouses = ${data.warehousesVersion},
  //       products = ${data.productsVersion}, customerGroups = ${data.customerGroupsVersion}, customers = ${data.customersVersion}`); 

  //     tx.executeSql('select * from dataVersions', [], (_, { rows }) =>
  //         console.log(JSON.stringify(rows))
  //       );     
  //   },
  //   null,
  //   () => true
  // );
};

export const checkDataVersion = async (userId) => {
  try {
    let currentVersion = getCurrentDataVersion();
    console.log('currentVersion = ', JSON.stringify(currentVersion));
    if (!currentVersion) currentVersion = { id: 0, menus: 0, userMenus: 0, roles: 0, units: 0, warehouses: 0, categories: 0, products: 0, customerGroups: 0, customers: 0 };
    const { id, menus, userMenus, roles, units, warehouses, categories,
      products, customerGroups, customers } = currentVersion;

    // if (!id) id = 0;
    // if (!menus) menus = 0;
    // if (!userMenus) userMenus = 0;
    // if (!roles) roles = 0;
    // if (!units) units = 0;
    // if (!warehouses) warehouses = 0;
    // if (!products) products = 0;
    // if (!customerGroups) customerGroups = 0;
    // if (!customers) customers = 0;
    const data = await axios.post(`${URL}/api/data/checkDataVersion`, {
      id,
      menus,
      userMenus,
      roles,
      units,
      warehouses,
      products,
      categories,
      customerGroups,
      customers,
      userId
    });
    console.log('data = ', data);

    if (data.data.id !== id) {
      console.log('begin create new data version');
      createNewDataVersion(data.data);
    }
  } catch (err) {
    console.log(err);
  }
};
