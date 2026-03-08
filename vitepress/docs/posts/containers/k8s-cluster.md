---
lang: en-US
title: K8s Cluster
description: Set up a K8s cluster on VMs
date: 2026-03-08
category:
  - kubernetes
tag:
  - linux
  - k8s
  - containers
---


# K8s cluster

Create a cluster on VMs using virt. See article on that. 


## Spawning VMs

This article assumes you have a clean Debian VM that will serve eventually as one of 3 nodes. So we start here by cloning them.

Create the clone

```sh
virt-clone --original k8s-master-01 --name k8s-worker-01 --file /mnt/ssd1/vms/kvm/k8s-worker-01.qcow2
```

Start it up and then do this

1. Change the Hostname
```sh
sudo hostnamectl set-hostname k8s-worker-01
sudo sed -i "s/k8s-master-01/k8s-worker-01/g" /etc/hosts
```

reboot

2. Reset the Machine ID (Crucial for K8s)
```sh
sudo rm -f /etc/machine-id /var/lib/dbus/machine-id
sudo systemd-machine-id-setup
sudo dbus-uuidgen --ensure
```
