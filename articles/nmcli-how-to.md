# nmcli - network manager command line interface - how to

## Wireless

### Check if wifi is enabled
```sh
nmcli radio
```
Will respond like this if it's ok
```sh
WIFI-HW  WIFI     WWAN-HW  WWAN
enabled  enabled  enabled  enabled
```

### List devices to see wifi device name
```sh
nmcli device
```
Will respond something like this
```sh
DEVICE  TYPE      STATE         CONNECTION
wlp3s0  wifi      disconnected  --
lo      loopback  unmanaged     --
```
So wlp3s0 is the device name that we will use later


### List all wifi networks available
```sh
nmcli device wifi rescan
nmcli device wifi list
```

### Simple connect to wifi network
This option does not save the connection for later

```sh
nmcli device wifi connect MyVisibleSSID password MySuperSecretPassword
```

### Create a saved connection
This will save a connection that you can connect to later without prompting the password each time  
This will also work if you have hidden SSID
```sh
nmcli connection add type wifi con-name con1 ifname wlp3s0 ssid "MyHiddenOrNotSSID"
nmcli connection modify con1 wifi-sec.key-mgmt wpa-psk
nmcli connection modify con1 wifi-sec.psk "MySuperSecretPassword"
```

### Connect to a saved connection
```sh
nmcli connection up con1
```
