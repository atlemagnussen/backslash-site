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
$ lightningd
```

## Operations

### Get info

```sh
$ lightning-cli getinfo
```

gives you number of channels and peers. If 0 you should start by connecting to at least one node

### on-chain funds

```sh
$ lightning-cli listfunds
```

### Connect to peer

This is free, it's just the peer and gossip connection kind of like the `bitcoind` does by itself, nothing to do with payments yet

Go to [1ML](https://1ml.com/) and find a suitable node

```sh
$ lightning-cli connect 0217890e3aad8d35bc054f43acc00084b25229ecff0ab68debd82883ad65ee8266@23.237.77.11:9735
```

### List peers

```sh
$ lightning-cli listpeers
```

### List channels

This might give you shit loads of channels, but it verifies that you are online

```sh
$ lightning-cli listchannels
```

### Close channel

Will become a unilateral close after the timeout

Example for 10 minutes timeout
```sh
$ lightning-cli close 976bbeb5f244cbc9b9669dc97620b459444f3712b8eebca0309c7292bfa5add7 600 
```