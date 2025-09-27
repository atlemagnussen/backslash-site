---
lang: en-US
title: OpenVPN Server
description: How to set up OpenVPN Server with easy-rsa
date: 2025-09-26
category:
  - Audio
tag:
  - linux
  - vpn
  - openVPN
  - Android
---
# OpenVPN Server

So just a guide based on explanations from Google Gemini

The following would be a set of commands and expected responses

## Step 1 Install

```sh
sudo apt install openvpn easy-rsa -y
```

## Step 2 Initialize the PKI Directory

Recommended: Create and secure a new directory for your CA

```sh
make-cadir ~/openvpn-pki
cd ~/openvpn-pki
```

## Step 3 Create the Certificate Authority (CA)

```sh
# Initialize the PKI environment
./easyrsa init-pki
```

Response

```sh
init-pki' complete; you may now create a CA or requests.

Your newly created PKI dir is:
* /home/atle/openvpn-pki/pki

Using Easy-RSA configuration:
* /home/atle/openvpn-pki/vars

```

Build the CA. You will be prompted to enter a **CA Passphrase**.
Make this secure and write it down.

```sh
./easyrsa build-ca
```

Response

```sh
CA creation complete. Your new CA certificate is at:
* /home/atle/openvpn-pki/pki/ca.crt
```

## Step 4 Generate Server Keys and Certificate

Generate the server key and CSR. 'server' is the Common Name (CN).
./easyrsa gen-req server nopass

```sh
Private-Key and Public-Certificate-Request files created.
Your files are:
* req: /home/atle/openvpn-pki/pki/reqs/server.req
* key: /home/atle/openvpn-pki/pki/private/server.ke
```

Sign the server certificate using the CA. You will be prompted for the CA Passphrase.
```sh
./easyrsa sign-req server server
```

Response

```sh
* /home/atle/openvpn-pki/vars
Please check over the details shown below for accuracy. Note that this request
has not been cryptographically verified. Please be sure it came from a trusted
source or that you have verified the request checksum with the sender.
You are about to sign the following certificate:

  Requested CN:     'small'
  Requested type:   'server'
  Valid for:        '825' days


subject=
    commonName                = small

Type the word 'yes' to continue, or any other input to abort.
  Confirm requested details: yes

Using configuration from /home/atle/openvpn-pki/pki/1fa12698/temp.1.1
Enter pass phrase for /home/atle/openvpn-pki/pki/private/ca.key:
Check that the request matches the signature
Signature ok
The Subject's Distinguished Name is as follows
commonName            :ASN.1 12:'small'
Certificate is to be certified until Dec 30 21:42:44 2027 GMT (825 days)

Write out database with 1 new entries
Database updated

Notice
------
Inline file created:
* /home/atle/openvpn-pki/pki/inline/private/server.inline


Notice
------
Certificate created at:
* /home/atle/openvpn-pki/pki/issued/server.crt
```

## Step 5 Generate Diffie-Hellman (DH) Parameters and TLS Auth Key

```sh
./easyrsa gen-dh
```

Response

```sh
DH parameters of size 2048 created at:
* /home/atle/openvpn-pki/pki/dh.pem
```

 Generate the shared TLS Authorization key (for HMAC protection)
```sh
/usr/sbin/openvpn --genkey --secret ta.key

Seems to must be run like sudo

```

## Step 6 Move Keys to OpenVPN Directory

```sh
sudo cp pki/ca.crt /etc/openvpn/
sudo cp pki/private/server.key /etc/openvpn/
sudo cp pki/issued/server.crt /etc/openvpn/
sudo cp pki/dh.pem /etc/openvpn/
sudo cp ta.key /etc/openvpn/
```

# Phase 2: Server Configuration

## Step 7: Create the Server Configuration File

Create and edit the server configuration file (/etc/openvpn/server.conf). This file is commented heavily in the official examples, but the core settings are:

```toml
# /etc/openvpn/server.conf
port 1194
proto udp
dev tun

# PKI Configuration
ca ca.crt
cert server.crt
key server.key  # This is the server private key
dh dh.pem
tls-auth ta.key 0  # 0 indicates server

# VPN Subnet: The VPN's private IP range (e.g., 10.8.0.0/24)
server 10.8.0.0 255.255.255.0

# Push client settings (modify to match your internal network)
push "redirect-gateway def1 bypass-dhcp"  # Route all traffic through the VPN
push "dhcp-option DNS 192.168.1.1" # Push your internal BIND server IP (replace 192.168.1.1 with your router/BIND IP)

# Security and Stability
user nobody
group nogroup
persist-key
persist-tun
status openvpn-status.log
verb 3
explicit-exit-notify 1
```

## Step 8: Enable IP Forwarding on the Server

add content

```sh
net.ipv4.ip_forward = 1
net.ipv6.conf.all.forwarding = 1
```

into 

```sh
sudo vim /etc/sysctl.d/99-openvpn.conf

# Apply the change
sudo sysctl --system


```

## Step 9: Configure NAT/Masquerading
On the Application Server, use nftables to allow traffic coming from the VPN subnet (10.8.0.0/24)
to exit to your main LAN interface (e.g., enp1s0).

```sh
# 1. Create the 'ip' family table named 'nat'
sudo nft add table ip nat

# 2. Add the 'postrouting' chain to the 'nat' table
#    - type nat: Specifies this chain handles NAT translation.
#    - hook postrouting: Ensures the rule runs just before the packet leaves the box.
#    - priority 100: Standard priority for NAT source translation.
sudo nft add chain ip nat postrouting { type nat hook postrouting priority 100 \; policy accept \; }

# 3. Add the Masquerade rule:
#    - ip saddr 10.8.0.0/24: Matches traffic coming from the VPN tunnel subnet.
#    - oifname "enp1s0": Matches packets exiting through your physical LAN interface.
#    - masquerade: Changes the source IP address (saddr) to the IP of the "enp1s0" interface.
sudo nft add rule ip nat postrouting ip saddr 10.8.0.0/24 oifname "enp1s0" masquerade

# 4. Add the 'forward' chain to the 'filter' table (if it doesn't exist)
sudo nft add chain ip filter forward { type filter hook forward priority 0 \; policy drop \; }

# 5. Allow established/related traffic back through the main network interface
sudo nft add rule ip filter forward iifname "enp1s0" oifname "tun0" ct state related,established accept

# 6. Allow new traffic to flow from the VPN tunnel to the LAN
sudo nft add rule ip filter forward iifname "tun0" oifname "enp1s0" accept
```

Or the outcome of rules that can be put into nftables.conf

```conf
table ip filter {
        chain forward {
                type filter hook forward priority filter; policy drop;
                iifname "enp1s0" oifname "tun0" ct state established,related accept
                iifname "tun0" oifname "enp1s0" accept
        }
}

table ip nat {
        chain postrouting {
                type nat hook postrouting priority srcnat; policy accept;
                ip saddr 10.8.0.0/24 oifname "enp1s0" masquerade
        }
}

```

### On your router

You need to open 1194 from the WAN and NAT into Application server

And probable create a route

```sh
sudo ip route add 10.8.0.0/24 via 192.168.1.2
```

If you have DNS bind9 you might need to fiddle some here as well

# Phase 3: Client Key Generation

For every mobile device, you need a unique key pair.

Step 10: Generate Client Keys
Run these steps back in your ~/openvpn-pki directory. Use a unique name for the client (e.g., mobile_phone).

```sh
cd ~/openvpn-pki
# Generate the client key and CSR (no passphrase for mobile simplicity)
./easyrsa gen-req mobile_phone nopass

# Sign the client certificate (requires CA passphrase)
./easyrsa sign-req client mobile_phone
```

## Step 11: Create the .ovpn Configuration File

This is the file you put on your Android phone. You must bundle the client's key, certificate, and the CA file into a single, cohesive file.

1. Create a base config file (start with the sample client.conf and modify the remote directive to your router's public IP).

```conf
client
dev tun
proto udp
remote srv.atle.guru 1194
resolv-retry infinite
nobind
persist-key
persist-tun

remote-cert-tls server
key-direction 1

verb 3

<ca>
</ca>
<cert>
</cert>
<key>
</key>
<tls-auth>
</tls-auth>
```

2. Embed the Certificates: Copy the contents of the following files and paste them directly into the client's .ovpn file between the appropriate tags:

 - `~./openvpn-pki/pki/ca.crt` → between <ca>...</ca>
 - `~./openvpn-pki/pki/issued/mobile_phone.crt` → between <cert>...</cert>
 - `~./openvpn-pki/pki/private/mobile_phone.key` → between <key>...</key>
 - `~./openvpn-pki/ta.key` → between <tls-auth>...</tls-auth>

2. Securely transfer the final .ovpn file to your Android phone.


Android Client App
You will use the official OpenVPN Connect app (available on the Google Play Store). Just import the .ovpn file into the app, and you'll be ready to connect.


