# Backslash-site

## Dependencies

```sh
npm install
git clone git@github.com:atlemagnussen/ez-tree.git (on the same level as backslash repo)
```

## Start debug
```sh
npm start
```

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