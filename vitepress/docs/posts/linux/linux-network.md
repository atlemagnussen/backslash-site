---
lang: en-US
title: Linux Network
description: Commands and recipes for network operations
date: 2021-02-05
category:
  - Linux
tag:
  - dns
  - linux
  - network
---

# Linux Network 

## IP addresses

List all interfaces with IPs

```sh
ip a
```

## Routing

show

```sh
ip route show
```

show ipv6
```sh
ip -6 route show
```

Trace route ipv4
```sh
traceroute google.com
```

Trace route ipv6
```sh
traceroute -6 google.com
```

## Ports

See listening ports
```sh
ss -l
netstat -ntlp
```

Check if port is open from another machine
```sh
nc -zv 192.168.1.1 80
```

## Firewall rules

See current iptables rules

```sh
sudo iptables-save
```

See current nftables rules

```sh
sudo nft list ruleset
```