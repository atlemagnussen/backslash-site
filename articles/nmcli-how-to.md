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
```sh
nmcli device wifi connect WhiteHartLane2 password XXX
```

### Create and save a connection
This will also work if you have hidden SSID
```sh
nmcli connection add type wifi con-name con1 ifname wlp3s0 ssid "MyHiddenOrNotSSID"
nmcli connection modify con1 wifi-sec.key-mgmt wpa-psk
nmcli connection modify con1 wifi-sec.psk "XXX"
```

### Connect to a saved connection
```sh
nmcli connection up con1
```
