const aws = require('aws-sdk');
const s3 = new aws.S3();

var bucketParams = {Bucket: "backslash-site"};

s3.getBucketWebsite(bucketParams, function(err, data) {
    if (err) {
      console.log("Error", err);
    } else if (data) {
      console.log("Success", JSON.stringify(data));
    }
  });

console.log('aws');
