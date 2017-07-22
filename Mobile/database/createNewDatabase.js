import Expo, { SQLite } from 'expo';
const db = SQLite.openDatabase({ name: 'SERP.db' });

 /*
  Hệ thống sẽ tạo ra các bảng sqlite chứa các dữ liệu thường xuyên sử dụng nhất nhằm tăng
  trải nghiệm của người dùng đối với phẩn mềm
  Khi ứng dụng dc khởi động nó sẽ tự động gửi các version hiện tại của cơ sở dữ liệu đã có trên mobile
  lên server, server sẽ kiểm tra dữ liệu đã mới dc cập nhật chưa, Server chỉ trả về tập dữ liệu cần thiết 
  chứ không trả về toàn bộ dữ liệu
  */
export default () => {
 
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
          );`
    )
      .executeSql(
      `create table if not exists
         menus (
           id integer primary key not null,
           name text
          );`
      )
      .executeSql(
      `create table if not exists
         userMenus (
           id integer primary key not null,
           menuId integer,
           userId integer
          );`
      )      
      .executeSql(
      `create table if not exists
         roles (
           id integer primary key not null,
           name text,
           description text
          );`
      )
      .executeSql(
      `create table if not exists
         categories (
           id integer primary key not null,
           name text,
           description text
          );`
      )
      .executeSql(
      `create table if not exists
         units (
           id integer primary key not null,
           name text,
           rate real
          );`
      )
      .executeSql(
      `create table if not exists
         warehouses (
           id integer primary key not null,
           name text,
           description text,
           address text
          );`
      )
      .executeSql(
      `create table if not exists
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
          );`
      )
      .executeSql(
      `create table if not exists
         customerGroups (
           id integer primary key not null,
           name text,
           description text
          );`
      )
      .executeSql(
      `create table if not exists
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
          );`
      );
  });
};
