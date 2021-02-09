package com.tournesolapp;

import javax.annotation.Nullable;
import android.os.Bundle;
import android.content.Intent;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.bridge.ReactContext;

public class MainActivity extends ReactActivity {

  // Store the URL we're receiving from the share system
  public static String importUrl;
  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "tournesolApp";
  }

  /**
    * Since MainActivity is our entry Intent, we have to override the default
    * onCreate from ReactActivity and obtain the parameter "importUrl"
    */
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    final Intent intent = this.getIntent();
    final String action = intent.getAction();
    final String type = intent.getType();

    if (Intent.ACTION_SEND.equals(action) && type != null && "text/plain".equals(type)) {
      // Extract the URL from the Intent and set it to our variable
      MainActivity.importUrl = intent.getStringExtra(Intent.EXTRA_TEXT);
    }
    super.onCreate(savedInstanceState);
  }

  /**
    * The magic happens here. getLaunchOptions works on a delegate since version 0.34 of RN
    * Check https://github.com/facebook/react-native/pull/9320 for more information.
    */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new ReactActivityDelegate(this, getMainComponentName()) {
      @Override
      protected Bundle getLaunchOptions() {
        Bundle initialProps = new Bundle();
        // Set the value from our static variable for the app
        initialProps.putString("importUrl", MainActivity.importUrl);
        // Since importUrl is static we have to reset it
        MainActivity.importUrl = null;
        return initialProps;
      }
    };
  }

  @Override
  public void onNewIntent(Intent intent) {
    if(intent.getExtras() != null) {
      ReactContext reactContext = getReactNativeHost().getReactInstanceManager().getCurrentReactContext();
      sendEvent(reactContext, "importUrl", intent.getExtras().getString(Intent.EXTRA_TEXT));
    }
  }
  private void sendEvent(ReactContext reactContext,
                          String eventName,
                          String str) {
    reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
      .emit(eventName, str);
  }
}
