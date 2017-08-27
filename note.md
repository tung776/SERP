### triển khai ứng dụng android không cần development server ###
1. Gõ lệnh sau:
```
react-native bundle --platform android --dev false --entry-file index.android.js --bundle-output android/app/src/main/assets/main.bundle --assets-dest android/app/src/main/res/
```
Câu lệnh trên sẽ thực hiện bundle javascript thành main.bundle
2. Tạo file my-release-key.keystore
thêm đường dẫn vào biến môi trường window Path chỏ tới: C:\Program Files\Java\jdkx.x.x_x\bin

gõ lệnh sau trong cmd:

```
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

nhập mật khẩu (tung1982) để tạo ra file my-release-key.keystore
3. Sửa lại file SERP\android\gradle.properties:
```
MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=my-key-alias
MYAPP_RELEASE_STORE_PASSWORD=tung1982
MYAPP_RELEASE_KEY_PASSWORD=tung1982
```
4. Sửa file SERP\android\app\build.gradle:
```
...
android {
    ...
    defaultConfig { ... }
    signingConfigs {
        release {
            if (project.hasProperty('MYAPP_RELEASE_STORE_FILE')) {
                storeFile file(MYAPP_RELEASE_STORE_FILE)
                storePassword MYAPP_RELEASE_STORE_PASSWORD
                keyAlias MYAPP_RELEASE_KEY_ALIAS
                keyPassword MYAPP_RELEASE_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            ...
            signingConfig signingConfigs.release
        }
    }
}
...
```
5. coppy file my-release-key.keystore vào thư mục android\app:
6. gõ lệnh sau trong cmd: 
```
cd android && ./gradlew assembleRelease
```
file apk sẽ năm trong thư mục android/app/build/outputs/apk/app-release.apk
7. Chi thiết thao khảo tại:
https://facebook.github.io/react-native/docs/signed-apk-android.html


###     Ngày 16/7/2017: ###
#### Sử dụng react-native-popup-menu ####
```
import { MenuContext } from 'react-native-popup-menu';

export const App = () => (
  <MenuContext>
    <YourApp />
  </MenuContext>
);

// somewhere in your app
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

export const YourComponent = () => (
  <View>
    <Text>Hello world!</Text>
    <Menu>
      <MenuTrigger text='Select action' />
      <MenuOptions>
        <MenuOption onSelect={() => alert(`Save`)} text='Save' />
        <MenuOption onSelect={() => alert(`Delete`)} >
          <Text style={{color: 'red'}}>Delete</Text>
        </MenuOption>
        <MenuOption onSelect={() => alert(`Not called`)} disabled={true} text='Disabled' />
      </MenuOptions>
    </Menu>
  </View>
);
```
#### Cách sử dụng react-native-communications  như sau: ####
```
import Communications from 'react-native-communications';

                <View style={styles.container}>
                    <TouchableOpacity onPress={() => Communications.phonecall('0916678845', true)}>
                        <View style={styles.holder}>
                            <Text style={styles.text}>Make phonecall</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => Communications.text('0916678845', "Thanh tung")}>
                        <View style={styles.holder}>
                            <Text style={styles.text}>Send a text/iMessage</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => Communications.email(['thanhtung776@gmail.com', 'thanhtung776@hotmal.com'], null, null, 'My Subject', 'My body text')}>
                        <View style={styles.holder}>
                            <Text style={styles.text}>Send an email</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => Communications.web('https://github.com/facebook/react-native')}>
                        <View style={styles.holder}>
                            <Text style={styles.text}>Open react-native repo on Github</Text>
                        </View>
                    </TouchableOpacity>
                </View>


```

Tách function takePhoto(), takeImage(), uploadImageAsync() thành file mới uploadImage.js
trong quá trình phát triển, thử nghiệm chức năng upload image nên tắt chức năng enable hot Reloading
vì khi upload ảnh lên server sẽ tạo thành file mới. Làm hệ thống kích hoạt hot-Reloading gây thông báo lỗi

#### Cách sử dụng uploadImage  ####
```
    handleImagePicked = async () => {
        let uploadResponse, uploadResult;
        
        try {
            const pickerResult = await takeImage();

            this.setState({ uploading: true });

            if (!pickerResult.cancelled) {
                const apiUrl = URL + "/api/users/upload";
                
                uploadImageAsync(pickerResult.uri, apiUrl).then(
                    res => {
                        console.log("res = ", res);
                        const url = URL + res.data.url;
                        this.setState({ imageUrl: url });
                        console.log("state.imageUrl = ", this.state.imageUrl);
                    }
                )
            }
        } catch (e) {
            // console.log({ uploadResult });
            console.log({ e });
            alert("Tải ảnh lên máy chủ thất bại");
        } finally {
            this.setState({ uploading: false });
        }
    }
```
###     Ngày 15/7/2017: ###
Học cách upload ảnh từ react native lên server sử dụng imagepickup của expo, và multer trên server
Chỉnh sửa app.json để thư nghiệm build ứng dụng từ expo
Học cách gửi sms, gọi điện, mở liên kết website bằng cách sử dụng react-native-communications
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
