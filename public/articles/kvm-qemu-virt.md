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

[Article on how to set up networks in KVM](https://computingforgeeks.com/managing-kvm-network-interfaces-in-linux/?expand_article=1
)