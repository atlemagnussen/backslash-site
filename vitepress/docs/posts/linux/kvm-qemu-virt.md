---
lang: en-US
title: KVM Qemu Virt
description: Commands for controlling KVM Qemu VMs
date: 2021-02-05
category:
  - Linux
tag:
  - KVM
  - QEMU
  - linux
  - virt
---

# Manage KVM QEMU virtual machines with virt

## Create

If you want network bridge, add this to interfaces

```sh
auto br0
iface br0 inet dhcp
    bridge_ports enp3s0  # Replace with your actual interface
    bridge_stp off
    bridge_fd 0
```

Or if you are using systemd network. Create these 3 files instead of the one you have

`25-br0.netdev`

```sh
[NetDev]
Name=br0
Kind=bridge
MACAddress=18:31:bf:25:1d:5f
```

`30-enp10s0.network`

```sh
[Match]
Name=enp10s0

[Network]
Bridge=br0
```

`35-br0.network`

```sh
[Match]
Name=br0

[Network]
DHCP=ipv4
IPv6AcceptRA=yes
Address=fda9:9699:faa:cda5::21/64

[IPv6AcceptRA]
UseDNS=yes
UseDomains=yes
```

then run

```sh
sudo systemctl restart systemd-networkd
```

Create file
```xml
<network>
  <name>host-bridge</name>
  <forward mode="bridge"/>
  <bridge name="br0"/>
</network>
```

Run

```sh
sudo virsh net-define host-bridge.xml
sudo virsh net-start host-bridge
sudo virsh net-autostart host-bridge

sudo mkdir -p /etc/qemu
echo "allow br0" | sudo tee /etc/qemu/bridge.conf
sudo chmod 0644 /etc/qemu/bridge.conf

sudo chmod u+s /usr/lib/qemu/qemu-bridge-helper
```

virsh net-destroy host-bridge to restart

Create

```sh
virt-install \
--name k8s-master-01 \
--ram 4096 \
--vcpus 2 \
--disk path=/mnt/ssd1/vms/kvm/k8s-master-01.qcow2,size=20 \
--os-variant debian13 \
--network network=host-bridge \
--graphics vnc \
--location 'https://deb.debian.org/debian/dists/trixie/main/installer-amd64/' \
--virt-type=kvm 
```

then you need something to connect to the session through VNC. Cockpit for example.

After you have contact with the VM, enable console properly:

```sh
sudo systemctl enable serial-getty@ttyS0.service
sudo systemctl start serial-getty@ttyS0.service
```

Then connect from the host with
```sh
virsh console k8s-master-01
```

maybe you need to a Enter-keypress before it launches login prompt

## VM Operations

List all

```sh
sudo virsh list --all
```

Start machine

```sh
sudo virsh start debian12
```

Edit machine
```sh
sudo virsh edit debian12
```

Power off machine

```sh
sudo virsh shutdown debian12
```

Force shut power off

```sh
sudo virsh destroy debian12
```

Clone machine
```sh
virt-clone --original debian12 --name debian12-copy --file /var/lib/libvirt/images/debian12-copy.qcow2
```

## Network

List

```sh
sudo virsh net-list --all
```

Start network, must be done before the VM can start
```sh
sudo virsh net-start default
```

Network info
```sh
virsh net-info default
```

Get VMs IP addresses
```sh
virsh net-dhcp-leases default
```

[Article on how to set up networks in KVM](https://computingforgeeks.com/managing-kvm-network-interfaces-in-linux/?expand_article=1)

## Mount disk shared with host

This is in virt manager gui

- Set up shared memory
- Press "Add hardware", select "Filesystem"
- Select the host folder, and add a name for Target path like this "mount_tag_ssd1"

Typical error message:
`Unable to find a satisfying virtiofsd`

Add the path inside the xml right under driver tag:
```xml
  <binary path="/run/current-system/sw/bin/virtiofsd"/>
```

Inside the host you mount it like this
```sh
#virtiofs
mount_tag_ssd1 /mnt/ssd1 virtiofs rw,relatime       0       0
```