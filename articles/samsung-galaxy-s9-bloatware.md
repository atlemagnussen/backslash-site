# Samsung Galaxy S9 bloatware

<div class="separator" style="clear: both; text-align: center;"><img border="0" src="https://storage.googleapis.com/atle-static/pics/android_robot.png"/></div>

This is a list of packages I remove using [XDA developers debloat guide](https://www.xda-developers.com/uninstall-carrier-oem-bloatware-without-root-access/) using adb to connect to the phone via usb and opening a shell

## Facebook
List all packages containing facebook
```sh
pm list packages | grep facebook
```

Should output
```bash
package:com.facebook.katana
package:com.facebook.system
package:com.facebook.services
package:com.facebook.appmanager
```

If you have installed other facebook apps like `messenger lite` you will see this package in addition. You might don't want to uninstall that
```bash
package:com.facebook.mlite
```

Uninstall preinstalled facebook packages
```sh
pm uninstall -k --user 0 com.facebook.katana
pm uninstall -k --user 0 com.facebook.system
pm uninstall -k --user 0 com.facebook.appmanager
pm uninstall -k --user 0 com.facebook.services
```