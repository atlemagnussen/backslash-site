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

## Create a master key

```sh
gpg --full-generate-key
```

- type ECC (sign only)
- select to not expire

### Generate revocation certificate for master key

```sh
gpg --output master-revocation.asc --gen-revoke (email or ID)
```

### Backup master key

```sh
gpg --output master-key-backup.gpg --export-secret-keys (email or ID)
```

## Create subkey

```sh
gpg --list-keys --with-subkey-fingerprints
```

Locate your key and edit it:

```
gpg --edit-key (email or ID)
```

Add new subkey

```sh
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

import public keys (not sure if this is needed)

```sh
gpg --import public-key.asc
```

Trust your own keys

```sh
gpg --edit-key (email or ID)
```