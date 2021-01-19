# Tournesol app

The mobile application for <tournesol.app>.

### Dev setup

This project uses *React Native*.

React Native applications are written in JS using *React* components, and generate native UI elements at runtime.
It should support *Android* and *iOS*, although **we only support Android until further notice**.

Follow <https://reactnative.dev/docs/environment-setup> to setup the environment, then launch the app :

* Create a `.env` file with configuration at the root of the project (see below)
* Launch a tournesol backend server on your host or change the `BASE_API_URL` accordingly
* Map the `8000` port above with the corresponding port on your device using `adb reverse tcp:8000 tcp:8000`
* Launch *Metro* with `npx react-native start`
* Launch the application using `npx react-native run-android`

### Configuration

Configuration is handled using [react-native-config](https://github.com/luggit/react-native-config).
Create a `.env` file at the root of the project with the following items:

    BASE_API_URL=http://127.0.0.1:8000
    TOURNESOL_YOUTUBE_VIDEO_ID=1J7h3F-nKus
