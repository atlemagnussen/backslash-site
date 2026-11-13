---
lang: en-US
title: TOR for Bitcoin
description: Run TOR with SOCKS proxy
date: 2025-02-08
category:
  - Crypto currencies
tag:
  - crypto
  - bitcoin
  - lightning network
  - linux
---

# TOR with bitcoin

## Config

```sh
SocksPort 0.0.0.0:9050
ControlPort 0.0.0.0:9051

DataDirectory /home/tor/data

## debug
# Log debug stdout
Log notice stdout

NickName TestSmallDocker

SocksPolicy accept 172.24.0.0/24
SocksPolicy reject *

HashedControlPassword 16:2E145AA4CFF0FF4960D9B49DAB4D99ABBA6257FF00C84CE4732C46862D
# CookieAuthentication 1
```

## Test

```sh
torsocks -a 192.168.1.2 -P 9050 curl https://api.ipify.org/?format=json
```