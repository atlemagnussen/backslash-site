# Bitcoin recover keys

## Bitcoin Wallet (Android)

Good old "Bitcoin Wallet" is not syncing with servers anymore. So you will not be able to broadcast TX from that app.

[Link to Google Play app](https://play.google.com/store/apps/details?id=de.schildbach.wallet)

Luckily the app is open source and they have provided [hints to uncover the keys from backup file](https://github.com/bitcoin-wallet/bitcoin-wallet/blob/main/wallet/README.recover.md).

Just adding my experience on top of it..


### Decrypt backup
```sh
# will prompt for backup password
openssl enc -d -aes-256-cbc -md md5 -a -in bitcoin-wallet-backup-testnet-2014-11-01 > bitcoin-wallet-decrypted-backup

cat bitcoin-wallet-decrypted-backup | tr -cd "[:print:]" | awk '{print $1}'
```

If it prints "org.bitcoin.production", you got the right password and the backup file uses the bitcoinj protobuf format

### Open the wallet with bitcoinj and extract key

After cloning `git clone -b release-0.15 https://github.com/bitcoinj/bitcoinj.git`

I also installed Java 11, cause the build would not work

```sh
sudo apt install openjdk-11-jdk

export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
```

Then the wallet builds
```sh
cd bitcoinj/tools
./wallet-tool
```

Reset and sync

```sh
./wallet-tool reset --wallet=/home/atle/bitcoin/decrypted-backup

```

Dump priv keys

```sh
./wallet-tool dump --wallet=/home/atle/bitcoin/decrypted-backup --password={pincode}
```