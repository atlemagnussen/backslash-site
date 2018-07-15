# Try make a static site on AWS S3 bucket with custom domain name and deploy with aws sdk

## Create Bucket on amazon
- Use the excact name as the dns record you plan to forward. www.backslash.site in this case
- Set up static web hosting on the bucket
- Set up Permissions -> Bucket policy as follows
````json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::www.backslash.site/*"
        }
    ]
}
````
- Set up dns CNAME record: www.backslash.site -> www.backslash.site.s3-website-eu-west-1.amazonaws.com

- nest use this thing to get HTTPS TLS with lets encrypt [S3 Letsencrypt plugin](https://github.com/dlapiduz/certbot-s3front)

# Make cloudfront point to S3 and point DNS to Cloudfront instead

- Origins - Origin Domain Name: www.backslash.site.s3-website-eu-west-1 (use the endpoint url from S3 static web hosting options page)
