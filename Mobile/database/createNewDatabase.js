import { SQLite } from 'expo';
import axios from 'axios';
import { URL } from '../../env';
import SqlService from './sqliteService';


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



};

export const getCurrentDataVersion = async () => {
  return await SqlService.query(
    'SELECT * FROM dataVersions;');
};

export const updateOrInsertDataVersion = async (data) => {
  debugger;

  avaiabledDataVersion = await SqlService.select('dataVersions', '*', `id = ${data.id}`);
  if (avaiabledDataVersion.length > 0) {
    await SqlService.insert('dataVersions', [
      'id', 'menus', 'userMenus', 'categories', 'roles', 'units', 'warehouses',
      'products', 'customerGroups', 'customers'
    ], [
        data.id, data.menusVersion, data.userMenusVersion, data.categoriesVersion,
        data.rolesVersion, data.unitsVersion, data.warehousesVersion, data.productsVersion,
        data.customersVersion
      ]);
  } else {
    await SqlService.update('dataVersions', [
      'menus', 'userMenus', 'categories', 'roles', 'units', 'warehouses',
      'products', 'customerGroups', 'customers'
    ], [
        data.menusVersion, data.userMenusVersion, data.categoriesVersion,
        data.rolesVersion, data.unitsVersion, data.warehousesVersion, data.productsVersion,
        data.customersVersion
      ], `id = ${data.id}`);
  }

  data.userMenus.forEach(async (item) => {
    debugger;
    avaiabledData = await SqlService.select('userMenus', '*', `userId = ${item.userId}, menuId = ${item.menuId}`);
    if (avaiabledData.length > 0) {
      await SqlService.insert('userMenus', ['userId', 'menuId', 'name'], [item.userId, item.menuId, item.name]);
    } else {
      await SqlService.update('userMenus', ['userId', 'menuId', 'name'], [item.menuId, item.name], `userId = ${item.userId}, menuId = ${item.menuId}`);
    }
  }, this);

  data.categories.forEach(async (item) => {
    debugger;
    avaiabledData = await SqlService.select('categories', '*', `id = ${item.id}`);
    if (avaiabledData.length > 0) {
      await SqlService.insert('categories', ['id', 'name', 'description'],
        [item.id, item.name, item.description]);
    } else {
      await SqlService.update('categories', ['name', 'description'],
        [item.name, item.description], `id = ${item.id}`);
    }
  }, this);

  data.units.forEach(async (item) => {
    debugger;
    avaiabledData = await SqlService.select('units', '*', `id = ${item.id}`);
    if (avaiabledData.length > 0) {
      await SqlService.insert('units', ['id', 'name', 'rate'],
        [item.id, item.name, item.rate]);
    } else {
      await SqlService.update('units', ['name', 'rate'],
        [item.name, item.rate], `id = ${item.id}`);
    }
  }, this);

  data.warehouses.forEach(async (item) => {
    debugger;
    avaiabledData = await SqlService.select('warehouses', '*', `id = ${item.id}`);
    if (avaiabledData.length > 0) {
      await SqlService.insert('warehouses', ['id', 'name', 'description', 'address'],
        [item.id, item.name, item.description, item.address]);
    } else {
      await SqlService.update('warehouses', ['name', 'description', 'address'],
        [item.name, item.description, item.address], `id = ${item.id}`);
    }
  }, this);

  data.customers.forEach(async (item) => {
    debugger;
    avaiabledData = await SqlService.select('customers', '*', `id = ${item.id}`);
    if (avaiabledData.length > 0) {
      await SqlService.insert('customers', [
        'id', 'customerGroupId',
        'name', 'bankId', 'companyId', 'address',
        'imageUrl', 'phone', 'email', 'overdue', 'excessDebt'
      ], [
          item.id, item.customerGroupId, item.name, item.bankId, item.companyId, item.address,
          item.imageUrl, item.phone, item.email, item.overdue, item.excessDebt
        ]);
    } else {
      await SqlService.update('customers', [
        'customerGroupId',
        'name', 'bankId', 'companyId', 'address',
        'imageUrl', 'phone', 'email', 'overdue', 'excessDebt'
      ], [
          item.customerGroupId, item.name, item.bankId, item.companyId, item.address,
          item.imageUrl, item.phone, item.email, item.overdue, item.excessDebt
        ], `id = ${item.id}`);
    }
  }, this);

  data.products.forEach(async (item) => {
    debugger;
    avaiabledData = await SqlService.select('products', '*', `id = ${item.id}`);
    if (avaiabledData.length > 0) {
      await SqlService.insert('products', [
        'id', 'categoryId', 'unitId', 'typeCargoId', 'name', 'description',
        'imageUrl', 'isPublic', 'purchasePrice', 'salePrice', 'minQuantity', 'isAvaiable'
      ], [
          item.id, item.categoryId, item.unitId, item.typeCargoId, item.name, item.description,
          item.imageUrl, item.imageUrl, item.isPublic, item.purchasePrice, item.salePrice, item.minQuantity, item.isAvaiable
        ]);
    } else {
      await SqlService.update('products', [
        'categoryId', 'unitId', 'typeCargoId', 'name', 'description',
        'imageUrl', 'isPublic', 'purchasePrice', 'salePrice', 'minQuantity', 'isAvaiable'
      ], [
          item.categoryId, item.unitId, item.typeCargoId, item.name, item.description,
          item.imageUrl, item.imageUrl, item.isPublic, item.purchasePrice, item.salePrice, item.minQuantity, item.isAvaiable
        ], `id = ${item.id}`);
    }
  }, this);

};

export const checkDataVersion = async (userId) => {
  try {
    let currentVersion = await getCurrentDataVersion();
    console.log('currentVersion = ', JSON.stringify(currentVersion));
    if (!currentVersion) currentVersion = { id: 0, menus: 0, userMenus: 0, roles: 0, units: 0, warehouses: 0, categories: 0, products: 0, customerGroups: 0, customers: 0 };
    const { id, menus, userMenus, roles, units, warehouses, categories,
      products, customerGroups, customers } = currentVersion;

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


    console.log('begin create new data version');
    await updateOrInsertDataVersion(data.data);
    getCurrentDataVersion().then(
      newData =>
        console.log("dataversion after updateOrInsert =", newData)
    );
    SqlService.select('userMenus', '*').then(
      result => console.log("userMenus = ", result)
    );
    SqlService.select('units', '*').then(
      result => console.log("units = ", result)
    );
    SqlService.select('categories', '*').then(
      result => console.log("categories = ", result)
    );

  } catch (err) {
    console.log(err);
  }
};
