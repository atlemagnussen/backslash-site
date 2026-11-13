---
lang: en-US
title: GPG Master and Subkeys
description: Set up a master key and subkeys with GPG
date: 2025-06-05
category:
  - Security
tag:
  - cli
  - gpg
  - pgp
  - encryption
  - linux
---

# GPG master and subkeys

The purpose of GPG master and subkey design is to keep a master key locked up, and using subkeys for everyday signing or encryption operations

To check if you have keys already use
```sh
gpg --list-keys
```

Use this command to find ID or email during the process

## Create a master key

Master key will be the offline parent of all your daily usage subkeys  
Ideally created on an offline computer

```sh
gpg --full-generate-key
```

- type ECC (sign only)
- select to not expire

### Generate revocation certificate for master key

This can be used later if you loose the key or it's compromised

```sh
gpg --output master-revocation.asc --gen-revoke (email or ID)
```

### Backup master key

Transfer this to offline safe space along with revocation certificate

```sh
gpg --output master-key-backup.gpg --export-secret-keys (email or ID)
```

## Create subkey

Locate your key and edit it:

```sh
gpg --edit-key (email or ID)
```

Add new subkey

```gpg
addkey
```

- choose ECC (sign only) or ECC (encrypt only)
- select to expire in 1y etc

You will be prompted for master key passphrase

## Export subkey

Export and encrypt with password before transer to online computer

```sh
gpg --output subkeys.gpg --export-secret-subkeys (email or ID)
gpg --symmetric subkeys.gpg
rm subkeys.gpg
```

### Export public key of master key

This will also contain subkeys

```sh
gpg --output public-key.asc --export (email or ID)
```

### Transfer and import subkeys

```sh
gpg --output subkeys.gpg --decrypt subkeys.gpg.gpg

gpg --import subkeys.gpg
```

Verify that master private key is not in the online machine:

```sh
gpg --list-secret-keys
```

The key will list at the top but it will state "sec#" with a hash to confirm there is no actual secret key on the machine

import public keys (not sure if this is needed)

```sh
gpg --import public-key.asc
```

Trust your own keys

```sh
gpg --edit-key (email or ID)
```

# Exporting public subkey for signing in Github

```sh
gpg --armor --export 889167D844EAD4C3
```

## Upload your public master key

```sh
gpg --keyserver hkps://keys.openpgp.org --send-keys 6CE1EA2A5439398B4389A4F8CF44D1B60C2E81E6
```

Verify and check wether you need to update
```sh
gpg --keyserver hkps://keys.openpgp.org --recv-keys 6CE1EA2A5439398B4389A4F8CF44D1B60C2E81E6
```

## Managing keys

So after a while your subkeys will expire. Then you

- create new subkeys
- export and upload your public keys to keyserver

## Edit keys

If you made a mistake or something on master key subkey, you can edit them.

First enter edit mode by master key like when you create new subkey

Then list all

```gpg
list
```

Select key (0 is first key / master)

```gpg
key 1
```

Now selected key will be prefixed by *

Now edit expire date

```gpg
expire
```