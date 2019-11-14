# ssh advanced use

## Find host fingerprint

default SHA256 format:

```sh
ssh-keygen -lf /etc/ssh/ssh_host_rsa_key
```

old MD5 format:

```sh
ssh-keygen -lf /etc/ssh/ssh_host_rsa_key -E md5
```
