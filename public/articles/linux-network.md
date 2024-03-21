# Linux Network 

## IP addresses

List all interfaces with IPs

```sh
ip a
```

Show routing information

```sh
# ipv4
ip route show
# ipv6
ip -6 route show
```

Trace route ipv4
```sh
traceroute domain.com
```

Trace route ipv6
```sh
traceroute -6 domain.com
```

## See bound ports
```sh
netstat -ntlp
```

