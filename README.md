# Tournesol app

The mobile application for <https://tournesol.app>.

### Dev setup

This project uses *React Native*.

React Native applications are written in JS using *React* components, and generate native UI elements at runtime.
It should support *Android* and *iOS*, although **we only support Android until further notice**.

Follow <https://reactnative.dev/docs/environment-setup> to setup the environment, then launch the app :

* Create a `.env` file with configuration at the root of the project (see below)
* Launch a tournesol backend server on your host or change the `BASE_API_URL` accordingly
* If you run the server locally, map the `8000` port above with the corresponding port on your device using `adb reverse tcp:8000 tcp:8000`
* Launch *Metro* with `npx react-native start`
* Launch the application using `npx react-native run-android`

### Configuration

Configuration is handled using [react-native-config](https://github.com/luggit/react-native-config).
Create a `.env` file at the root of the project with the following items:

    # Use https://staging.tournesol.app in dev
    BASE_API_URL=https://tournesol.app
    # Tournesol introduction video
    TOURNESOL_YOUTUBE_VIDEO_ID=xSqqXN0D4fY

### Android Application

The Android application is available on the Play Store: <https://play.google.com/store/apps/details?id=com.tournesolapp>.

To release a new version, you can [generate a signed AAB bundle](https://reactnative.dev/docs/signed-apk-android#generating-the-release-aab) and then upload it using the [Google Play Console](https://play.google.com/console) (you need access to the Tournesol account).

##### Generating a signed AAB bundle

This bundle needs to be signed with a local key, although the final APK released on the Play Store will be automatically signed using the Play Console and the dedicated Tournesol account.

    export ORG_GRADLE_PROJECT_TOURNESOL_UPLOAD_KEY_ALIAS=XXX
    export ORG_GRADLE_PROJECT_TOURNESOL_UPLOAD_KEY_PASSWORD=XXX
    cd android/ && ./gradlew bundleRelease
