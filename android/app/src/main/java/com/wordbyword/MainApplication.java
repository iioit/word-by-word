package com.wordbyword;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.psykar.cookiemanager.CookieManagerPackage;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.cboy.rn.splashscreen.SplashScreenReactPackage;
import com.auth0.lock.react.LockReactPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.lwansbrough.RCTCamera.*;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new CookieManagerPackage(),
            new ImageResizerPackage(),
            new RCTCameraPackage(),
            new SplashScreenReactPackage(),
            new LockReactPackage(),
            new ReactNativePushNotificationPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
