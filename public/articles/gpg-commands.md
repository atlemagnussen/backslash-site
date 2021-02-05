# GPG encryption commands

<div class="separator" style="clear: both; text-align: center;"><img border="0" src="https://storage.googleapis.com/atle-static/pics/gpg_logo.png"/></div>

## Create

The simple command

```sh
$ gpg --gen-key
```

or the more advanced

```sh
$ gpg --full-generate-key
```

Output will be something like this:
```bash
pub   rsa3072 2019-08-20 [SC] [expires: 2021-08-19]
      XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
      XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
uid                      Me Xxxxxxx <mexxxxxxxxx@gmail.com>
sub   rsa3072 2019-08-20 [E] [expires: 2021-08-19]
```

## Delete

```sh
$ gpg --delete-secret-and-public-keys mexxxxxxxxx@gmail.com
```

## Export

Public key:  
to be sent to your friends so they can encrypt messages only you can decrypt

```sh
$ gpg --armor --output xxxxxxx.public.gpg --export mexxxxxxxxx@gmail.com
```

Private key (only for backup)

```sh
$ gpg --armor --output xxxxxxx.secret.gpg --export-secret-keys mexxxxxxxxx@gmail.com
```

## Import

import public key from a friend

```sh
$ gpg --import friendxxx.public.gpg
```

## Edit trust level on an imported key from a friend

get keyid from `--list-keys`

```sh
$ gpg --edit-key 9A5704E6742C5B32395057FCACB6EE444EE8C7A2 trust
# then select level of trust
gpg> 4
```

output:

```bash
pub  rsa3072/ACB6EE444EE8C7A2
     created: 2021-02-05  expires: 2023-02-05  usage: SC
     trust: full          validity: full
sub  rsa3072/6634A7A0E2024ADE
     created: 2021-02-05  expires: 2023-02-05  usage: E
[  full  ] (1). My Friend
```

Then save and quit:

```sh
gpg> save
```

## Sign an imported key from a friend (validity)

```sh
$ gpg --lsign-key 9A5704E6742C5B32395057FCACB6EE444EE8C7A2
```

## Encrypt

Using public key of your friend:
```sh
$ gpg --output file.txt.gpg --encrypt --recipient friendxxx@gmail.com file.txt
```

## Add signature

To verify you're the sender

```sh
$ sha256sum file.txt | awk '{print $1}' > file.txt.sha256sum
$ gpg --output file.txt.sha256sum.sig --sign file.txt.sha256sum
```

## Decrypt

Decrypt encrypted files sent to you:

```sh
$ gpg --output decrypted.txt --decrypt file.txt.gpg
```

## Verify signature

Verify that your friend created the message

```sh
$ gpg --verify file.txt.sha256sum.sig
```
