---
lang: en-US
title: KVM Qemu Windows 11
description: How to install Windows 11 in KVM QEMU
date: 2025-11-18
category:
  - Linux
tag:
  - KVM
  - QEMU
  - linux
  - virt
  - windows
---

# Links

[How to Properly Install a Windows 11 Virtual Machine on KVM](https://sysguides.com/install-a-windows-11-virtual-machine-on-kvm)

## Add new VM

After you have downloaded a Win 11 ISO image just follow the wizard as far as auto detecting OS and whatever you decide to do with the disk and stuff

After going through the wizard you might not be able to boot it on the first attempt. Try add manually mount a 2nd CDROM with the same Win 11 image and it might just work.


## Without network

Smart to install it without network so you get a local user easier.

You might get stuck on "let's connect to a network"

[W11 install, stuck in "let's connect to a network" but there are no networks](https://www.reddit.com/r/buildapc/comments/143i3m1/w11_install_stuck_in_lets_connect_to_a_network/)

Hit shift + F10 > then type/write OOBE\BYPASSNRO and hit enter.

It'll restart and you have to select language and country again, then you should be able to select "I don't have internet"

## Guest tools

Downlod virtio-win.iso

```sh
wget https://fedorapeople.org/groups/virt/virtio-win/direct-downloads/latest-virtio/virtio-win.iso
```

Mount it to CD-ROM

Then open `virtio-win-guest-tools` inside Windows 11

After this have been installed you should be able to Auto scale

On the top menu of the guest window

View -> Scale Display -> Auto resize VM with window