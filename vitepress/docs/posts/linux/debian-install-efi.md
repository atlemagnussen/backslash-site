---
lang: en-US
title: Debian Install with EFI
description: How to install Debian Trixie with secure boot partition
date: 2025-09-06
category:
  - Linux
tag:
  - linux
  - debian
---


# Debian Trixie

So in order to install Debian on a completely separate disk, meaning that you have another bootable disk with for example Windows, you must create a proper boot partition in the start of it

There is no need to turn off secure boot and stuff like many would tell you

## EFI partition

EFI System Partition - esp

I have found out that [parted](https://www.gnu.org/software/parted/) works well for creating the boot partition, but not the rest (swap, root)

So create this with parted as FAT32 and then quit

```sh
parted /dev/nvme1n1
```

```parted
mkpart boot fat32 0% 512M
toggle 1 esp
quit
```

```sh
mkfs.fat -F32 /dev/sda1
```

Then you should create the swap and root with a graphical tool as they will help you get the sizes and placement correct and not having to calculate like with parted

So boot up with [Debian Live CD](https://www.debian.org/CD/live/) and use [KDE partition manager](https://apps.kde.org/partitionmanager/) etc

## Installation

When you have all your partitions go ahead and when you come to partitioning select "Manual partitioning"

Then you need to set the boot partition to mount point `/boot/efi`

This means that the rest of `/boot` is in root partition, which is better since the Linux kernels then can use ext file system


# LUKS

Encrypting a partition

install `cryptsetup`

## Encrypt partition before filesystem

```sh
sudo cryptsetup luksFormat /dev/nvme1n1p4
```

Then open

```sh
sudo cryptsetup luksOpen /dev/nvme1n1p4 data_crypt
```

Then make file system

```sh
sudo mkfs.btrfs /dev/mapper/data_crypt
```

Now mount temporary it to work with it

```sh
mount /dev/mapper/data_crypt /mnt/shared/
```

```sh
cd /mnt/shared
sudo btrfs subvolume create @data
sudo btrfs subvolume create @home

etc...
```

Then unmount temporary mount 

```sh
sudo umount /mnt/shared
```

Find uid
```sh
sudo blkid /dev/nvme1n1p4
```

edit `/etc/crypttab`

```config
data_crypt      UUID=f3aae62d-32f7-4119-97c9-e23403cb37ba       none    luks,discard
```

Create folder `/data``

Edit `/etc/fstab`

```
/dev/mapper/data_crypt   /data   btrfs   defaults,nofail,x-systemd.automount,compress=zstd,subvol=@data     0       0
```


Inspect

```sh
cryptsetup luksDump /dev/nvme1n1p4
```

Backup / restore header files
```sh
cryptsetup luksHeaderBackup /dev/nvme1n1p4 --header-backup-file luksHeader.bin
#cryptsetup luksHeaderRestore /dev/nvme1n1p4 --header-backup-file luksHeader.bin
```