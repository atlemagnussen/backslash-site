# Linux mount smb

## Set up
### Config file
Set up file smb.conf
```sh
[global]
workgroup = WORKGROUP
server string = Samba Server %v
netbios name = debian
security = user
map to guest = bad user
dns proxy = no

[Media]
  comment = Media
  path = /mnt/md0/Media
  valid users = nas atle
  force group = nas
  create mask = 0660
  directory mask = 0771
  writable = yes
```

### Users
Need to set smb password:
```sh
$ sudo smbpasswd -a nas
```

## Mount
mounting is a way of testing if the share works
```sh
mount -t cifs //SERVER/sharename /mnt/mountpoint -o username=username,password=password,iocharset=utf8,vers=3.1.1
```