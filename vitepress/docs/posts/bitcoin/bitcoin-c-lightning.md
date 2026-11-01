---
lang: en-US
title: Bitcoin C-lightning
description: How to run and operate a C lightning node
date: 2021-02-05
category:
  - Crypto currencies
tag:
  - crypto
  - bitcoin
  - lightning network
  - linux
---
# Operate a C-lightning node

[Core Lightning API Reference (all methods)](https://docs.corelightning.org/reference)

## Prerequisites

- Running a [Bitcoin full node](https://bitcoincore.org/) on the same computer.
- Install [C-lightning](https://github.com/ElementsProject/lightning)

## Config lightningd

Create or open file `~/.lightning/config` 

```bash
bitcoin-datadir=/mnt/Bitcoin/
bitcoin-cli=bitcoin-cli
log-file=log.debug
log-level=debug
daemon
network=bitcoin
rgb=f6ae99
alias=PickAName
bind-addr=LAN ip
announce-addr=WAN ip or dns
```

## Start node

Just start lightning daemon by:

```sh
lightningd
```

## Operations

### Get info

```sh
lightning-cli getinfo
```

gives you number of channels and peers. If 0 you should start by connecting to at least one node

```sh
lightning-cli listaddresses
```


### new address

```sh
lightning-cli newaddr p2tr

```

### Send on-chain
```sh
lightning-cli withdraw bc1... all

```

### on-chain funds

```sh
lightning-cli listfunds
```

### Connect to peer

This is free, it's just the peer and gossip connection kind of like the `bitcoind` does by itself, nothing to do with payments yet

Go to [1ML](https://1ml.com/) and find a suitable node

```sh
lightning-cli connect 0217890e3aad8d35bc054f43acc00084b25229ecff0ab68debd82883ad65ee8266@23.237.77.11:9735
```

### Open channel example

```sh
# connect (this is bitrefill A node)
lightning-cli connect 030bd936b47a53af5eba629529dff8b2222aa9ae0ed2c12476b2bcf28bc996b8a6@54.155.41.207:9735

# verify
lightning-cli listpeers 030bd936b47a53af5eba629529dff8b2222aa9ae0ed2c12476b2bcf28bc996b8a6

# fund

lightning-cli fundchannel id=030bd936b47a53af5eba629529dff8b2222aa9ae0ed2c12476b2bcf28bc996b8a6 amount=3000000sat feerate=normal
```

then take the https://mempool.space/tx/[txid] to follow the tx

### Pay invoice example

Decode the invoice first to check amount, description and destination:

```sh
lightning-cli decode lnbc7416220n1p4w0dfdpp59pgw79q32fdslvqyjrmv784h4slcsed0j2a49qvuyplu88yu0ngsdqu23hhqatsyqmngvfkxgezqumpw3escqzpgxqrpcgrzjq25carzepgd4vqsyn44jrk85ezrpju92xyrk9apw4cdjh6yrwt5jgqqqqzxh5cwmduqqqqqqqqqqqqqq9qrzjqwghf7zxvfkxq5a6sr65g0gdkv768p83mhsnt0msszapamzx2qvuxqqqqzxh5cwmduqqqqqqqqqqqqqq9qsp5t4dprlucnvvayqt5xv86xy6u0070zaatt5ntmu9zte52jpv6h9cs9qxpqysgqa02995dyuq55jes47sees3eg95fsle99rvl54w9h8tpt6ewnk5mjneynqekjrdwdkdjf6xtdx4ydlcyw00pygktrsnr0ruaqnlyse3cp6wvv7x
```

If it looks right, pay it:

```sh
lightning-cli pay lnbc7416220n1p4w0dfdpp59pgw79q32fdslvqyjrmv784h4slcsed0j2a49qvuyplu88yu0ngsdqu23hhqatsyqmngvfkxgezqumpw3escqzpgxqrpcgrzjq25carzepgd4vqsyn44jrk85ezrpju92xyrk9apw4cdjh6yrwt5jgqqqqzxh5cwmduqqqqqqqqqqqqqq9qrzjqwghf7zxvfkxq5a6sr65g0gdkv768p83mhsnt0msszapamzx2qvuxqqqqzxh5cwmduqqqqqqqqqqqqqq9qsp5t4dprlucnvvayqt5xv86xy6u0070zaatt5ntmu9zte52jpv6h9cs9qxpqysgqa02995dyuq55jes47sees3eg95fsle99rvl54w9h8tpt6ewnk5mjneynqekjrdwdkdjf6xtdx4ydlcyw00pygktrsnr0ruaqnlyse3cp6wvv7x
```


### List peers

```sh
lightning-cli listpeers
```

### List channels

This might give you shit loads of channels, but it verifies that you are online

```sh
lightning-cli listchannels
```

### Close channel

Will become a unilateral close after the timeout

Example for 10 minutes timeout
```sh
lightning-cli close 976bbeb5f244cbc9b9669dc97620b459444f3712b8eebca0309c7292bfa5add7 600 
```



## Enable REST API

Add this to config

```sh
clnrest-port=9738
clnrest-host=172.24.0.5
```

[Official docs](https://docs.corelightning.org/docs/rest)

then
[create rune](https://docs.corelightning.org/reference/createrune)
