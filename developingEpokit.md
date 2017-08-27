Developing With ExpoKit
ExpoKit is an Objective-C and Java library that allows you to use the Expo platform with a native iOS/Android project.

Before you read this guide

There are two ways to get an ExpoKit project:

Create a pure-JS project in XDE, then use exp detach to add ExpoKit.
Create an app with create-react-native-app, then choose “eject with ExpoKit”.
Make sure you follow one of the above paths before continuing in this guide. The remainder of the guide will assume you have created an ExpoKit project.

Setting up your project

By this point you should have a JS app which additionally contains ios and android directories.

1. Check JS dependencies
Your project’s package.json should contain a react-native dependency pointing at Expo’s fork of React Native. This should already be configured for you.
Your JS dependencies should already be installed (via npm install or yarn).
2. Run the project in XDE or exp
Open the project in XDE. If you were already running this project in XDE, press Restart.

If you prefer exp, run exp start from the project directory.

This step ensures that the React Native packager is running and serving your app’s JS bundle for development. Leave this running and continue with the following steps.

3. iOS: Configure, build and run
This step ensures the native iOS project is correctly configured and ready for development.

Make sure you have the latest Xcode.
If you don’t have it already, install CocoaPods, which is a native dependency manager for iOS.
Run pod install from your project’s ios directory.
Open your project’s xcworkspace file in Xcode.
Use Xcode to build, install and run the project on your test device or simulator. (this will happen by default if you click the big “Play” button in Xcode.)
Once it’s running, the iOS app should automatically request your JS bundle from the project you’re serving from XDE or exp.

4. Android: Build and run
Open the android directory in Android Studio, then build and run the project on an Android device or a Genymotion emulator.

Once the Android project is running, it should automatically request your development url from XDE or exp. You can develop your project normally from here.

Continuing with development

Every time you want to develop, ensure your project’s JS is being served by XDE (step 2), then run the native code from Xcode or Android Studio respectively.

Your ExpoKit project is configured to load your app’s published url when you build it for release. So when you want to release it, don’t forget to publish, like with any normal (non-ExpoKit) project.

Changing Native Dependencies

iOS
Your ExpoKit project manages its dependencies with CocoaPods. If you encounter third-party libraries with CocoaPods instructions, those instructions should apply.

Many libraries in the React Native ecosystem include instructions to run react-native link. These are supported with ExpoKit for iOS, but because react-native link is not aware of CocoaPods, it may not do a complete job installing your dependency. If you encounter build issues locating the <React/*> headers, you may need to manually add Pods/Headers/Public to the Header Search Paths configuration for your native dependency in Xcode.

If you’re not familiar with Xcode, search Xcode help for “configure build settings” to get an idea of how those work. Header Search Paths is one such build setting. The target you care to configure is the one created by react-native link inside your Xcode project. You’ll want to determine the relative path from your library to Pods/Headers/Public.

Android
Many libraries in the React Native ecosystem include instructions to run react-native link. These are supported with ExpoKit for Android.

Upgrading ExpoKit

ExpoKit’s release cycle follows the Expo SDK release cycle. When a new version of the Expo SDK comes out, the release notes include upgrade instructions for the normal, JS-only part of your project. Additionally, you’ll need to update the native ExpoKit code.

Note: Please make sure you’ve already updated your JS dependencies before proceeding with the following instructions. Additionally, there may be version-specific breaking changes not covered here.
iOS
Open up ios/Podfile in your project, and update the ExpoKit tag to point at the release corresponding to your SDK version. Re-run pod install.
Open ios/your-project/Supporting/EXSDKVersions.plist in your project and change all the values to the new SDK version.
Android
Go to https://expo.io/—/api/v2/versions and find the androidExpoViewUrl key under sdkVersions.[NEW SDK VERSION].
Download that .tar.gz file and extract it.
Go to your project’s .expo-source/android directory and replace it with the android directory from the file you downloaded.
Go to MainActivity.java and replace Arrays.asList("[OLD SDK VERSION]") with Arrays.asList("[NEW SDK VERSION]").
Go to build.gradle and replace compile('host.exp.exponent:expoview:[OLD SDK VERSION]@aar') { with compile('host.exp.exponent:expoview:[NEW SDK VERSION]@aar') {.








react-native bundle --platform android --dev false --entry-file index.android.js --bundle-output android/app/src/main/assets/main.bundle --assets-dest android/app/src/main/res/