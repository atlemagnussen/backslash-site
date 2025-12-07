---
lang: en-US
title: Debian cleanup
description: How to clean up Debian after upgrades
date: 2025-02-14
category:
  - Linux
tag:
  - linux
  - debian
---

# How to clean up Debian after upgrades

Vacuuming system logs

```sh
sudo journalctl --vacuum-size=300M
```

Clean apt cache

```sh
sudo apt-get clean
```

Rotate logs

```sh
sudo logrotate /etc/logrotate.conf
```

## How to adjust power settings

if value is `suspend` it will suspend when idle

```sh
gsettings get org.gnome.settings-daemon.plugins.power sleep-inactive-ac-type
```

adjust it

```sh
gsettings set org.gnome.settings-daemon.plugins.power sleep-inactive-ac-type 'nothing'
```

similar setting for battery
```sh
gsettings set org.gnome.settings-daemon.plugins.power sleep-inactive-battery-type 'nothing'
```