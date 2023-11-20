# Manage KVM QEMU virtual machines with virt

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
mount_tag_umbrel /mnt/umbrel virtiofs rw,relatime       0       0
```