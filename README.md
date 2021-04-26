# Tournesol app

The mobile application for [Tournesol](https://tournesol.app).

See the wiki page [Contribute to Tournesol](https://wiki.tournesol.app/index.php/Contribute_to_Tournesol) for details.

### Dev setup

This project uses [React Native](https://reactnative.dev/).

React Native applications are written in *JavaScript* using *React* components, and generate native UI elements at runtime.

It should support *Android* and *iOS*, although **we only support Android until further notice**.

Follow <https://reactnative.dev/docs/environment-setup> to setup the environment, then launch the application :

* Create a `.env` file with configuration at the root of the project (see below)
* **If you run a server locally** (see `BASE_API_URL` in configuration), map the `8000` port to the one on your device using `adb reverse tcp:8000 tcp:8000`
* Launch [Metro](https://facebook.github.io/metro/) with `npx react-native start`
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

To release a new version, you can [generate a signed AAB bundle](https://reactnative.dev/docs/signed-apk-android#generating-the-release-aab) (see below) and then upload it using the [Google Play Console](https://play.google.com/console) (you need access to the Tournesol account).

##### Generating a signed AAB bundle

This bundle needs to be signed with a local key, although the final APK released on the Play Store will be automatically signed using the Play Console and the dedicated Tournesol account.

    export ORG_GRADLE_PROJECT_TOURNESOL_UPLOAD_KEY_ALIAS=XXX
    export ORG_GRADLE_PROJECT_TOURNESOL_UPLOAD_KEY_PASSWORD=XXX
    cd android/ && ./gradlew bundleRelease
