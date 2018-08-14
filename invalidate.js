var AWS = require('aws-sdk');
var cloudfront = new AWS.CloudFront({apiVersion: '2017-10-30'});

var params = {
  DistributionId: 'STRING_VALUE', /* required */
  InvalidationBatch: { /* required */
    CallerReference: 'STRING_VALUE', /* required */
    Paths: { /* required */
      Quantity: 0, /* required */
      Items: [
        'STRING_VALUE',
        /* more items */
      ]
    }
  }
};
cloudfront.createInvalidation(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});
