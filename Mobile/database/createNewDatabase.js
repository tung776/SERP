import { SQLite } from 'expo';
import axios from 'axios';
import { URL } from '../../env';
import SqlService from './sqliteService';

const db = SQLite.openDatabase({ name: 'SERP.db' });

/*
 Hệ thống sẽ tạo ra các bảng sqlite chứa các dữ liệu thường xuyên sử dụng nhất nhằm tăng
 trải nghiệm của người dùng đối với phẩn mềm
 Khi ứng dụng dc khởi động nó sẽ tự động gửi các version hiện tại của cơ sở dữ liệu đã có trên mobile
 lên server, server sẽ kiểm tra dữ liệu đã mới dc cập nhật chưa, Server chỉ trả về tập dữ liệu cần thiết 
 chứ không trả về toàn bộ dữ liệu
 */
export const createDatabaseSqlite = async () => {

  db.transaction(tx => {
    tx.executeSql(
      `create table if not exists
         menus (
           id integer primary key not null,
           name text
          );`);
    tx.executeSql(`create table if not exists
         userMenus (
           id integer primary key not null,
           menuId integer,
           userId integer
          );`);

    tx.executeSql(`create table if not exists
         roles (
           id integer primary key not null,
           name text,
           description text
          );`);
    tx.executeSql(`create table if not exists
         categories (
           id integer primary key not null,
           name text,
           description text
          );`);
    tx.executeSql(`create table if not exists
         units (
           id integer primary key not null,
           name text,
           rate real
          );`);
    tx.executeSql(`create table if not exists
         warehouses (
           id integer primary key not null,
           name text,
           description text,
           address text
          );`);
    tx.executeSql(`create table if not exists
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
    tx.executeSql(`create table if not exists
         customerGroups (
           id integer primary key not null,
           name text,
           description text
          );`);
    tx.executeSql(`create table if not exists
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
  })


  // ).then(function (res) {
  //   debugger;
  //   console.log(res);
  // });
};

export const getCurrentDataVersion = () => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM dataVersions;',
      [],
      (_, { rows: { _array } }) => {
        console.log("CurrentDataVersion = ", _array);
        debugger;
        return _array;
      }
    );
  });
};

export const createNewDataVersion = (data) => {
  try {
    // return SqlService.insert("dataVersionsdfgdfh", [
    //   "id", "menus", "userMenus", "categories", "roles", "units", "warehouses", "products", "customerGroups", "customers"
    // ], [
    //     data.id, data.menusVersion, data.userMenusVersion, data.categoriesVersion,
    //     data.rolesVersion, data.unitsVersion, data.warehousesVersion, data.productsVersion,
    //     data.customersVersion
    //   ])
    debugger;
    db.transaction(tx => {
      // debugger;
      tx.executeSql(
        `INSERT INTO dataVersions (
          id, menus, userMenus, categories, roles, units, warehouses, 
          products, customerGroups, customers
        ) VALUES(
          ?, ?, ?,?, ?, ?,?, ?, ?, ?
        )`,
        [
          data.id, data.menusVersion, data.userMenusVersion, data.categoriesVersion,
          data.rolesVersion, data.unitsVersion, data.warehousesVersion, data.productsVersion,
          data.customersVersion
        ]);
      tx.executeSql(
        `SELECT * FROM dataVersions`,
        [],
        (_, { rows: { _array } }) => {
          debugger;
          console.log("CurrentDataVersion dataVersions = ", _array);
        })
    });

  }
  catch (err) {
    return err;
  }
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
    console.log("currentVersion = ", JSON.stringify(currentVersion));
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
      console.log("begin create new data version");
      createNewDataVersion({
        id: data.data.id,
         menus: data.data.menus,
        userMenus: data.data.userMenusVersion,
        roles: data.data.rolesVersion,
        units: data.data.unitsVersion,
        warehouses: data.data.warehousesVersion,
        products: data.data.productsVersion,
        categories: data.data.categoriesVersion,
        customerGroups: data.data.customerGroups,
        customers: data.data.customersVersion,
        userId: userId
      });
    }

  }
  catch (err) {
    console.log(err);
  }
};
