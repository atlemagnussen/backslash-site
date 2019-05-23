# Travis install

## Ruby
```sh
sudo pacman -S ruby
```

## Travis Cli
```sh
gem install travis
```

## Create firebase token to use in Travis CI
```sh
firebase login:ci
```
✔  Success! Use this token to login on a CI server:

1/***

Example: firebase deploy --token "$FIREBASE_TOKEN"

## Encrypt token and put into .travis.yml, see example for the structure
```sh
travis encrypt "1/***" --add
```
