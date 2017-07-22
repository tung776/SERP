import { SQLite } from 'expo';
import axios from 'axios';
import { URL } from '../../env';

const db = SQLite.openDatabase({ name: 'SERP.db' });

/*
 Hệ thống sẽ tạo ra các bảng sqlite chứa các dữ liệu thường xuyên sử dụng nhất nhằm tăng
 trải nghiệm của người dùng đối với phẩn mềm
 Khi ứng dụng dc khởi động nó sẽ tự động gửi các version hiện tại của cơ sở dữ liệu đã có trên mobile
 lên server, server sẽ kiểm tra dữ liệu đã mới dc cập nhật chưa, Server chỉ trả về tập dữ liệu cần thiết 
 chứ không trả về toàn bộ dữ liệu
 */
export const createDatabaseSqlite = () => {
  db.transaction(tx => {
    tx.executeSql(
      `create table if not exists
         dataVersions (
           id integer primary key not null,
           menus int, 
           userMenus int, 
           roles int,
           categories int,
           units int,
           warehouses int,
           products int,
           customerGroups int,
           customers int
          );
          create table if not exists
         menus (
           id integer primary key not null,
           name text
          );
          create table if not exists
         userMenus (
           id integer primary key not null,
           menuId integer,
           userId integer
          );
          create table if not exists
         roles (
           id integer primary key not null,
           name text,
           description text
          );
          create table if not exists
         categories (
           id integer primary key not null,
           name text,
           description text
          );
          create table if not exists
         units (
           id integer primary key not null,
           name text,
           rate real
          );
          create table if not exists
         warehouses (
           id integer primary key not null,
           name text,
           description text,
           address text
          );
          create table if not exists
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
          );
          create table if not exists
         customerGroups (
           id integer primary key not null,
           name text,
           description text
          );
          create table if not exists
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
          );
          `
    );
  });
};

export const getCurrentDataVersion = () => {
  db.transaction(tx => {
    tx.executeSql(
      'select * from dataVersions;',
      [],
      (_, { rows: { _array } }) => {
        console.log("array = ", _array);
        debugger;
        return _array;
      }
    );
  });
};

export const createNewDataVersion = (data) => {
  db.transaction(
    tx => {
      console.log('begin transaction, data = ', data);
      debugger;
      tx.executeSql(`insert into dataVersions (
        id = ${data.id}, menus = ${data.menusVersion}, userMenus = ${data.userMenusVersion}, categories = ${data.categoriesVersion},
        roles = ${data.rolesVersion}, units = ${data.unitsVersion}, warehouses = ${data.warehousesVersion},
        products = ${data.productsVersion}, customerGroups = ${data.customerGroupsVersion}, customers = ${data.customersVersion}`); 

      tx.executeSql('select * from dataVersions', [], (_, { rows }) =>
          console.log(JSON.stringify(rows))
        );     
    },
    null,
    () => true
  );
};

export const checkDataVersion = async (userId) => {
  let currentVersion = await getCurrentDataVersion();
  console.log("currentVersion = ", currentVersion);
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
  let result;
  if (data.data.id !== id) { 
    result = await createNewDataVersion(data.data);
  }
  console.log('result = ', result);
};
