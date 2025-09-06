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
