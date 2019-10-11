# Linux users and groups
## Create simple user with default shell and home folder

### useradd
[man page useradd](https://linux.die.net/man/8/useradd)  
here you need specify:
- create home folder `-m`
- assign to a main group `-g`
- bash as default shell for user `-s` - or else it might be `/bin/sh`

and then set password in second command
```sh
useradd -m -g users -s /bin/bash testuser
passwd testuser
```

### adduser
[man page adduser](https://linux.die.net/man/8/adduser)  
this command will prompt you for password and fullname and some other stuff  
it will create a group with same name as user and assign the OS default shell
```
adduser testuser
```

## Delete user
### userdel
[man page userdel](https://linux.die.net/man/8/userdel)
specify `-r` to remove users home directory and mail spool
```sh
userdel -r testuser
```