# Articles repository

# Plans
- about client side routing
- aws serverless and s3
- nodejs systemd
- nginx

## Upload to s3
```sh
aws s3 cp arch-linux-macbook-air.md s3://www.backslash.site/articles/

# invalidate cache on updates
aws cloudfront create-invalidation --distribution-id E1P60CBE5Z918O  --paths /articles/arch-linux-macbook-air.md
```