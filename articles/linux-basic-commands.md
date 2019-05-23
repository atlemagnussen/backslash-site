# Linux basic commands

## User

### Create new user
With home folder
```sh
sudo useradd -m username
```

### Delete user
```sh
sudo userdel username
```

### List user's groups
```sh
sudo groups username
```

### Add user to group
```sh
sudo usermod -aG groupname username
```

### Remove user from group
```sh
sudo gpasswd -d username groupname
```