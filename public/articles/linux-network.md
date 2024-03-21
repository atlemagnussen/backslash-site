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
traceroute domain.com
```

Trace route ipv6
```sh
traceroute -6 domain.com
```

## Ports

See bound ports
```sh
netstat -ntlp
```

