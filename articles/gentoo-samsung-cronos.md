# Gentoo Samsung Cronos
Dual boot install from Arch Linux

## Start here
- https://wiki.gentoo.org/wiki/Installation_alternatives#Installing_Gentoo_from_an_existing_Linux_distribution

## Then here if you need to prep partitions, else follow this link anyway to the next
- https://wiki.gentoo.org/wiki/Handbook:AMD64/Installation/Disks

## Stage tarball
- https://wiki.gentoo.org/wiki/Handbook:AMD64/Installation/Stage

```sh
tar xpvf stage3-amd64-20190131T214503Z.tar.xz --xattrs-include='*.*' --numeric-owner
```

### CFLAGS look up Sandy Bridge
- https://wiki.gentoo.org/wiki/Safe_CFLAGS
```sh
# /etc/portage/make.conf
CHOST="x86_64-pc-linux-gnu"
CFLAGS="-march=sandybridge -O2 -pipe"
CXXFLAGS="${CFLAGS}"
```

## Installing base system
- https://wiki.gentoo.org/wiki/Handbook:AMD64/Installation/Base
### Select mirrors
- https://www.gentoo.org/downloads/mirrors/#SE
```sh
# /etc/portage/make.conf
MAKEOPTS="-j2"
GENTOO_MIRRORS="http://mirror.mdfnet.se/gentoo/ https://mirror.bytemark.co.uk/gentoo/"
```

### Follow the wiki slavic:
```sh
mkdir --parents /mnt/gentoo/etc/portage/repos.conf
cp /mnt/gentoo/usr/share/portage/config/repos.conf /mnt/gentoo/etc/portage/repos.conf/gentoo.conf

cp --dereference /etc/resolv.conf /mnt/gentoo/etc/


mount --types proc /proc /mnt/gentoo/proc
mount --rbind /sys /mnt/gentoo/sys
mount --make-rslave /mnt/gentoo/sys
mount --rbind /dev /mnt/gentoo/dev
mount --make-rslave /mnt/gentoo/dev
```

When using non-Gentoo installation media, this might not be sufficient. Some distributions make /dev/shm a symbolic link to /run/shm/ which, after the chroot, becomes invalid. Making /dev/shm/ a proper tmpfs mount up front can fix this:
```sh
test -L /dev/shm && rm /dev/shm && mkdir /dev/shm
mount --types tmpfs --options nosuid,nodev,noexec shm /dev/shm
# Also ensure that mode 1777 is set:

chmod 1777 /dev/shm
```

### chroot
```sh
chroot /mnt/gentoo /bin/bash
source /etc/profile
export PS1="(chroot) ${PS1}"
```

### Boot partition mount
```sh
mkdir /boot
mount /dev/sda1 /boot
```

### Portage
```sh
emerge-webrsync
```
#### news
`eselect news read` and be done with it

### profile
```sh
eselect profile list
eselect profile set 12 (17.0 default *)
```

### update @world set (takes some time, 10 minutes)
```sh
emerge --ask --verbose --update --deep --newuse @world
```

### USE flags
Set for X and i3 https://wiki.gentoo.org/wiki/I3#USE_flags
```sh
nano -w /etc/portage/make.conf:
USE="X acl alsa doc savedconfig xinerama filecaps"
```
### Timezone
```sh
ls /usr/share/zoneinfo
echo "Europe/Oslo" > /etc/timezone
emerge --config sys-libs/timezone-data
```

### Locale
```sh
nano -w /etc/locale.gen:
en_US ISO-8859-1
en_US.UTF-8 UTF-8
locale-gen
eselect locale list
eselect locale set 4 #en_US.utf8

env-update && source /etc/profile && export PS1="(chroot) $PS1"
```
make.conf:
```sh
LINGUAS="en"
```

## Configuring the kernel
- https://wiki.gentoo.org/wiki/Handbook:AMD64/Installation/Kernel

```sh
emerge --ask sys-kernel/gentoo-sources #takes some time, 5 mins

ls -l /usr/src/linux
```

### Manual
```sh
emerge --ask sys-apps/pciutils
lspci
cd /usr/src/linux
make menuconfig
```
#### Wifi
Intel Centrino Advanced-N 6230
- http://atvgm.blogspot.com/2012/03/gentoo-linux-wireless-intel-centrino.html
- https://wiki.gentoo.org/wiki/Iwlwifi#Device_driver_iwlwifi

```sh
<M>     Intel Wireless WiFi Next Gen AGN - Wireless-N/Advanced-N/Ultimate-N (iwlwifi)
<M>       Intel Wireless WiFi DVM Firmware support
<M>       Intel Wireless WiFi MVM Firmware support

```

#### Wired network
Realtek RTL8111/8411 PCI Express Gigabit Ethernet Controller (rev 06)

#### Compile
```sh
make && make modules_install
make install
```

### Initramfs
```sh
emerge --ask sys-kernel/genkernel
genkernel --install initramfs
```

### Kernel modules
```sh
find /lib/modules/<kernel version>/ -type f -iname '*.o' -or -iname '*.ko' | less
# dont know if we need this yet!!

emerge --ask sys-kernel/linux-firmware
```

## Configuring system
### networking
```sh
nano -w /etc/conf.d/hostname
# Set the hostname variable to the selected host name
hostname="atlelaptop"

nano -w /etc/conf.d/net
# Set the dns_domain_lo variable to the selected domain name
dns_domain_lo="homenetwork"

nano -w /etc/hosts
```

### init
```sh
nano -w /etc/rc.conf
```

## Tools
- https://wiki.gentoo.org/wiki/Handbook:AMD64/Installation/Tools
### syslog
```sh
emerge --ask app-admin/sysklogd
rc-update add sysklogd default
```
### crontab
```
emerge --ask sys-process/cronie
rc-update add cronie default
```

### fs tools
```sh
emerge --ask sys-fs/e2fsprogs
emerge --ask sys-fs/dosfstools
```
### networking tools
- https://wiki.gentoo.org/wiki/Wpa_supplicant

```sh
emerge --ask net-misc/dhcpcd
emerge --ask net-wireless/iw net-wireless/wpa_supplicant

rc-update add wpa_supplicant default

nano /etc/wpa_supplicant/wpa_supplicant.conf
```

Config file:
```sh
# The below line not be changed otherwise wpa_supplicant refuses to work
ctrl_interface=/var/run/wpa_supplicant

# Ensure that only root can read the WPA configuration
ctrl_interface_group=0
update_config=1  
# Let wpa_supplicant take care of scanning and AP selection
ap_scan=1

network={
  ssid="WhiteHartLane2"
  scan_ssid=1
  psk="123"
  priority=1
}

```

- https://wiki.gentoo.org/wiki/Handbook:AMD64/Networking/Wireless

# Xorg
- https://wiki.gentoo.org/wiki/Xorg/Guide
```sh
emerge --pretend --verbose x11-base/xorg-drivers
emerge --ask x11-base/xorg-server
env-update
source /etc/profile

emerge --ask x11-apps/xinit

nano /etc/portage/make.conf #Gen 4 through Gen 9+
VIDEO_CARDS="intel i965"
```

## i3
```sh
nano /etc/portage/package.use/i3
enter: "xkb xcb"

emerge --ask x11-wm/i3
emerge --ask x11-misc/dmenu
emerge --ask x11-misc/i3status

emerge --ask x11-misc/compton

emerge --ask app-portage/gentoolkit

emerge --ask x11-terms/xfce4-terminal

equery u urxvt-unicode
emerge --ask x11-terms/rxvt-unicode
emerge --ask rxvt-unicode

emerge --ask nodejs
emerge --ask www-client/chromium

emerge --ask www-client/w3m

emerge --ask x11-apps/setxkbmap

emerge --ask app-editors/vim
```
