---
lang: en-US
title: Bitcoin LND
description: How to run and operate a Bitcoind LND node
date: 2025-02-05
category:
  - Crypto currencies
tag:
  - crypto
  - bitcoin
  - lightning network
  - linux
---
# Operate a LND node

Show current options

```sh
lncli getdebuginfo
```

```sh
lncli getinfo
```

```sh
lncli newaddress p2tr
```

```sh
lncli walletbalance
# or
lncli wallet addresses list
```

## on chain

lncli sendcoins --addr bc1p7l... --sweepall --label sweeping1

## Peers

lncli listpeers

## Mobile wallet

how to view macaroon:
xxd -p -c2000 admin.macaroon
