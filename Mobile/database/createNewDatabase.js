import { SQLite } from 'expo';
import axios from 'axios';
import { URL } from '../../env';
import SqlService from './sqliteService';
import { loadMenusData } from '../actions/menuAction';

/*
 Hệ thống sẽ tạo ra các bảng sqlite chứa các dữ liệu thường xuyên sử dụng nhất nhằm tăng
 trải nghiệm của người dùng đối với phẩn mềm
 Khi ứng dụng dc khởi động nó sẽ tự động gửi các version hiện tại của cơ sở dữ liệu đã có trên mobile
 lên server, server sẽ kiểm tra dữ liệu đã mới dc cập nhật chưa, Server chỉ trả về tập dữ liệu cần thiết 
 chứ không trả về toàn bộ dữ liệu
 */
export const resetDatabase = async () => {
  SqlService.query(
    'drop table if exists menus;');
  SqlService.query(
    'drop table if exists userMenus;');
  SqlService.query(
    'drop table if exists roles;');
  SqlService.query(
    'drop table if exists units;');
  SqlService.query(
    'drop table if exists warehouses;');
  SqlService.query(
    'drop table if exists products;');
  SqlService.query(
    'drop table if exists customerGroups;');
  SqlService.query(
    'drop table if exists customers;');
};

export const createDatabaseSqlite = async () => {
  // resetDatabase();
  // SqlService.query(
  //   'drop table if exists dataVersions;');

  SqlService.query(
    `create table if not exists
         menus (
           id integer primary key not null,
           name text,
           parentId integer
          );`);
  SqlService.query(`create table if not exists
         userMenus (
           menuId integer,
           userId integer,
           parentId,
           name text
          );`);
  SqlService.query(`create table if not exists
         roles (
           id integer primary key not null,
           name text
          );`);
  SqlService.query(`create table if not exists
         categories (
           id integer primary key not null,
           name text,
           description text
          );`);
  SqlService.query(`create table if not exists
         units (
           id integer primary key not null,
           name text,
           rate real
          );`);
  SqlService.query(`create table if not exists
         warehouses (
           id integer primary key not null,
           name text,
           description text,
           address text
          );`);
  SqlService.query(`create table if not exists
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
  SqlService.query(`create table if not exists
         customerGroups (
           id integer primary key not null,
           name text,
           description text
          );`);
  SqlService.query(`create table if not exists
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
  SqlService.query(`create table if not exists
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

export const getCurrentDataVersion = async () => await SqlService.select('dataVersions', '*');

export const updateOrInsertDataVersion = async (data) => {
  const avaiabledDataVersion = await SqlService.select('dataVersions', '*', `id = ${data.id}`);

  const newDataVersion = [
    data.id, data.menusVersion, data.userMenusVersion, data.categoriesVersion,
    data.rolesVersion, data.unitsVersion, data.warehousesVersion, data.productsVersion,
    data.customerGroupsVersion, data.customersVersion
  ];
  if (avaiabledDataVersion.length == 0) {
    // console.log("go insert");
    SqlService.insert('dataVersions', [
      'id', 'menus', 'userMenus', 'categories', 'roles', 'units', 'warehouses',
      'products', 'customerGroups', 'customers'
    ], newDataVersion);
  } else {
    // console.log('go update');
    // console.log(JSON.stringify(avaiabledDataVersion));

    // SqlService.update('dataVersions', [
    //   'menus', 'userMenus', 'categories', 'roles', 'units', 'warehouses',
    //   'products', 'customerGroups', 'customers'
    // ], [
    //     data.menusVersion, data.userMenusVersion, data.categoriesVersion,
    //     data.rolesVersion, data.unitsVersion, data.warehousesVersion, data.productsVersion,
    //     data.customersVersion, data.customersVersion
    //   ], `id = ${data.id}`);
  }
  // console.log("data.userMenus = ", data.userMenus);

  data.userMenus.forEach(async (item) => {
    const avaiabledData = await SqlService.select('userMenus', '*', `userId = ${item.userId} AND menuId = ${item.menuId}`);
    // console.log("avaiableUserMenus",JSON.stringify(avaiabledData));
    if (avaiabledData.length == 0) {
      // console.log('go insert userMenus');
      SqlService.insert('userMenus', ['userId', 'menuId', 'name', 'parentId'], [item.userId, item.menuId, item.name, item.parentId]);
    } else {
      // console.log('go update userMenus');
      // SqlService.update('userMenus', ['name', 'parentId'], [item.name, item.parentId], `userId = ${item.userId} AND menuId = ${item.menuId}`);
    }
  }, this);
  console.log("categories from server= ", data.categories);
  data.categories.forEach(async (item) => {
    const avaiabledData = await SqlService.select('categories', '*', `id = ${item.id}`);
    if (avaiabledData.length == 0) {
      SqlService.insert('categories', ['id', 'name', 'description'],
        [item.id, item.name, item.description]);
    } else {
      SqlService.query(`UPDATE categories SET name = '${item.name}', description = '${item.description}' WHERE id = ${item.id};`);

    }
  }, this);

  data.units.forEach(async (item) => {
    const avaiabledData = await SqlService.select('units', '*', `id = ${item.id}`);
    // console.log('avaiabledData in units', avaiabledData)
    if (avaiabledData.length == 0) {
      // console.log("go insert units");
      SqlService.insert('units', ['id', 'name', 'rate'],
        [item.id, item.name, item.rate]);
    } else {
      // console.log("go update units");
      // SqlService.update('units', ['name', 'rate'],
      //   [item.name, item.rate], `id = ${item.id}`);
    }
  }, this);
  data.roles.forEach(async (item) => {
    const avaiabledData = await SqlService.select('roles', '*', `id = ${item.id}`);
    // console.log('avaiabledData in units', avaiabledData)
    if (avaiabledData.length == 0) {
      // console.log("go insert roles");
      SqlService.insert('roles', ['id', 'name'],
        [item.id, item.name]);
    } else {
      // console.log("go update roles");
      // SqlService.update('roles', ['name'],
      //   [item.name], `id = ${item.id}`);
    }
  }, this);

  data.warehouses.forEach(async (item) => {
    const avaiabledData = await SqlService.select('warehouses', '*', `id = ${item.id}`);
    if (avaiabledData.length == 0) {
      SqlService.insert('warehouses', ['id', 'name', 'description', 'address'],
        [item.id, item.name, item.description, item.address]);
    } else {
      // SqlService.update('warehouses', ['name', 'description', 'address'],
      //   [item.name, item.description, item.address], `id = ${item.id}`);
    }
  }, this);

  data.customers.forEach(async (item) => {
    const avaiabledData = await SqlService.select('customers', '*', `id = ${item.id}`);
    if (avaiabledData.length == 0) {
      SqlService.insert('customers', [
        'id', 'customerGroupId',
        'name', 'bankId', 'companyId', 'address',
        'imageUrl', 'phone', 'email', 'overdue', 'excessDebt'
      ], [
          item.id, item.customerGroupId, item.name, item.bankId, item.companyId, item.address,
          item.imageUrl, item.phone, item.email, item.overdue, item.excessDebt
        ]);
    } else {
      // SqlService.update('customers', [
      //   'customerGroupId',
      //   'name', 'bankId', 'companyId', 'address',
      //   'imageUrl', 'phone', 'email', 'overdue', 'excessDebt'
      // ], [
      //     item.customerGroupId, item.name, item.bankId, item.companyId, item.address,
      //     item.imageUrl, item.phone, item.email, item.overdue, item.excessDebt
      //   ], `id = ${item.id}`);
    }
  }, this);

  data.products.forEach(async (item) => {
    const avaiabledData = await SqlService.select('products', '*', `id = ${item.id}`);
    if (avaiabledData.length == 0) {
      SqlService.insert('products', [
        'id', 'categoryId', 'unitId', 'typeCargoId', 'name', 'description',
        'imageUrl', 'isPublic', 'purchasePrice', 'salePrice', 'minQuantity', 'isAvaiable'
      ], [
          item.id, item.categoryId, item.unitId, item.typeCargoId, item.name, item.description,
          item.imageUrl,  item.isPublic, item.purchasePrice, item.salePrice, item.minQuantity, item.isAvaiable
        ]);
    } else {
      SqlService.query(
        `UPDATE products 
        SET categoryId = '${item.categoryId}',
         unitId = '${item.unitId}',
         typeCargoId = '${item.typeCargoId}',
         name = '${item.name}',
         description = '${item.description}',
         isPublic = '${item.isPublic}',
         imageUrl = '${item.imageUrl}',
         purchasePrice = '${item.purchasePrice}',
         salePrice = '${item.salePrice}',
         minQuantity = '${item.minQuantity}',
         isAvaiable = '${item.isAvaiable}'
         WHERE id = ${item.id};`
        );

      // SqlService.update('products', [
      //   'categoryId', 'unitId', 'typeCargoId', 'name', 'description',
      //   'imageUrl', 'isPublic', 'purchasePrice', 'salePrice', 'minQuantity', 'isAvaiable'
      // ], [
      //     item.categoryId, item.unitId, item.typeCargoId, item.name, item.description,
      //     item.imageUrl, item.imageUrl, item.isPublic, item.purchasePrice, item.salePrice, item.minQuantity, item.isAvaiable
      //   ], `id = ${item.id}`);
    }
  }, this);
};

export const checkDataVersion = async (userId, store) => {
  // console.log("go checkDataVersion");

  try {
    await SqlService.select('dataVersions', '*').then(
      async (currentVersion) => {
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
        // console.log('data = ', data);

        await updateOrInsertDataVersion(data.data);
        console.log('begin dispatch menuActions');
        store.dispatch(loadMenusData());

        // await getCurrentDataVersion().then(
        //   newData =>
        //     console.log("dataversion after updateOrInsert =", newData)
        // );
        // SqlService.select('userMenus', '*').then(
        //   result => console.log("userMenus = ", result)
        // );
        // SqlService.select('units', '*').then(
        //   result => console.log("units = ", result)
        // );
        // SqlService.select('roles', '*').then(
        //   result => console.log("roles = ", result)
        // );
        SqlService.select('categories', '*').then(
          result => console.log('categories = ', result)
        );
      }
    );
  } catch (err) {
    console.log(err);
  }
};
