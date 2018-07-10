AWS_ACCESS_KEY_ID="REPLACE_WITH_YOUR_KEY" \
AWS_SECRET_ACCESS_KEY="REPLACE_WITH_YOUR_SECRET" \
certbot --agree-tos -a certbot-s3front:auth \
--certbot-s3front:auth-s3-bucket www.backslash.site \
[ --certbot-s3front:auth-s3-region eu-west-1 ]
[ --certbot-s3front:auth-s3-directory "" ]
-i certbot-s3front:installer \
--certbot-s3front:installer-cf-distribution-id E1P60CBE5Z918O \
-d www.backslash.site
