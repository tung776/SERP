###     Ngày 15/7/2017: ###
Học cách upload ảnh từ react native lên server sử dụng imagepickup của expo, và formidable trên server
Chỉnh sửa app.json để thư nghiệm build ứng dụng từ expo
###     Ngày 14/7/2017: ###
Thiết kế và thực thi chức năng login logout
Sau khi login hệ thống sẽ trả về giá trị token
mobile sẽ lưu lại token này và sử dụng cho lần sau. Nếu có token sẽ dc bỏ qua bước đăng nhập
Ngược lại người dùng sẽ bị yêu cầu đăng nhập lại

Tạo uploadImage picker cho phép người dùng upload ảnh lên server

Lỗi cài RNFetchBlob
error: package com.RNFetchBlob does not exist
import com.RNFetchBlob.RNFetchBlobPackage;

khắc phục bằng cách bổ xung dòng mã 
compile project(':react-native-fetch-blob')

vào trong file: android/app/build.gradle
###     Ngày 13/7/2017: ###
Tiếp tục tái cấu trúc dự án và sửa lỗi
###     Ngày 12/7/2017: ###
Tiếp tục tái cấu trúc dự án:
Thư mục Shared là nơi chữa code chia sẻ xuyên suốt dự án cho mobile, server và trình duyệt
Thư mục Server là nơi chứa code chạy trên Server
Thư mục Server/src là nơi chứa code reactjs chạy trên trình duyệt
Thư mục Mobile là nơi chứa code chạy trên mobile
App.js là file đầu vào khi thực hiện lệnh 
```
npm run mobile
```
index.android.js là file đầu vào khi thực hiện lệnh:
```
react-native run-android
```
Server/index.js là điểm đầu vào khi chạy khởi động server bằng lệnh:
```
npm run server
```

###     Ngày 11/7/2017:     ###
Tái cấu trúc dự án giúp chia sẻ node_modules và giúp chia sẻ mã nguồn của các actions, reducers, validator ... giữa ứng dụng mobile và reactjs cũng như với Server
