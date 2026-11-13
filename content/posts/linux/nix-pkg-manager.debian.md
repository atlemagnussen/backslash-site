---
lang: en-US
title: nix pkg manager debian
description: use Nix package manager on Debian
date: 2025-12-07
category:
  - Linux
tag:
  - linux
  - nix
  - pkg
  - dotnet
---

# Nix package manager

## Install On Debian 

```sh
curl -L https://nixos.org/nix/install | sh
```

## Add channel

```sh
nix-channel --add https://nixos.org/channels/nixpkgs-unstable
nix-channel --update
```

## Test shell

```sh
nix-shell -p dotnet-sdk_10
```

When opened the prompt will be `[nix-shell:~]$`

Then see if dotnet actually is there

```sh
dotnet --list-sdks
```