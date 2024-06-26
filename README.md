# Backslash-site
[![Build Status](https://travis-ci.org/atlemagnussen/backslash-site.svg?branch=master)](https://travis-ci.org/atlemagnussen/backslash-site)

## Credits
- [Simpleicons](https://simpleicons.org) for clean svg icon

Source code for my [kind of blog](https://www.backslash.site)

## Dependencies

```sh
npm install
```

## Start debug
```sh
npm start
```

## Deployment CI with Travis
[Travis install and setup](./TRAVIS.md)

## Deploy AWS
requires AWS SDK and aws init with IAM user, rights to S3 and keys  
see [S3-SSL](./S3SSL.md) for how to use letsencrypt certbot with S3 and CloudFront
```sh
npm run build

aws s3 sync dist/ s3://www.backslash.site

aws cloudfront create-invalidation --distribution-id E1P60CBE5Z918O  --paths /index.html /bundle.js
```

## AWS SDK setup first time
```sh
npm install aws-sdk -g
```

## Deploy Firebase
```sh
firebase deploy
```


background:

https://codepen.io/agoodwin/pen/NMJoER
https://codepen.io/shubniggurath/pen/oPGyQw
https://codepen.io/tonkotsuboy/pen/zJbKNN
https://codepen.io/hylobates-lar/pen/bGEQXgm
https://codepen.io/sarazond/pen/LYGbwj
https://codepen.io/hylobates-lar/pen/qBbQeON