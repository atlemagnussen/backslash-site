---
lang: en-US
title: CUPS configure
description: How to set up CUPS on Unix based systems
date: 2020-12-25
category:
  - unix
tag:
  - unix
  - printer
  - cli
  - linux
---

# CUPS configure printer server for LAN

If you want printing in Linux, MacOS or BSD you probably rely on CUPS somehow. On MacOS this might be already set up for you, this might also be the case in Ubuntu. But for Debian or Arch Linux i.e. this is not the case.  
The advantage by setting it up yourself is that you only need to set it up once, on one machine - and all the others can use this as a printer server.

## Install
Just install the package `cups` from package manager

Then enable the service and start it
```sh
sudo systemctl enable cups
sudo systemctl start cups
```
If you have access to web browser on this machine you can test it initially by going to
```bash
http://localhost:631
```

## Initial configuration
We want our server to be accessible from other computers in the network  

1. First off you need to remove the localhost contraint

Edit `/etc/cups/cupsd.conf`  
and locate the line `Listen localhost:631` remove that line and replace it with:
```bash
#Listen localhost:631
Port 631
```

2. Then allow ip address of the computers in the built in firewall ish thing.  
Locate the line `# Restrict access to the server...` and add to the section like this:
```bash
<Location />
  Order allow,deny
  Allow 192.168.1.16
  Allow 192.168.1.9
</Location>
```
Restart cups to make sure the changes are applied:
```sh
sudo systemctl restart cups
```
## User access group
User access is using local users on the server  
user must be member of lpadmin, create group if not exist
```sh
sudo groupadd lpadmin
sudo usermod -a -G lpadmin pi
```
You usually need to log out of the session for the group change to be effected

## Add the printer
Add the printer to the server like you normally do with CUPS first.  
Go to `https://192.168.1.3:631/admin` and then add printer

I'll skip this part for now and assume you have added the printer which is called "printer"

Add another printer that points to the same printer, which is accessible by all machines on the LAN
```sh
sudo lpadmin -p printer-on-server -E -v ipp://192.168.1.3/printers/printer -m everywhere
```
