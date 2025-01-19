import { Bucket, Function, StackContext } from 'sst/constructs';

export function StorageStack({ stack }: StackContext) {
  // Create the Lambda function
  const notificationFunction = new Function(stack, 'NotificationFunctionPY', {
    handler: 'packages/functions/src/extractFunction.handler',
    timeout: 900,
    runtime: "python3.9", // Ensure runtime is specified
    permissions: [
      "textract:AmazonTextractFullAccess",
      "s3:GetObject",
      "textract:StartDocumentAnalysis",
      "textract:GetDocumentAnalysis",
      "s3:PutObject",
    ],
  });

  // Create the S3 bucket and disable public access block settings
  const bucket = new Bucket(stack, 'BucketTextract', {
    notifications: {
      myNotification: {
        function: notificationFunction,
        events: ['s3:ObjectCreated:*'], // Correct event name
      },
    },
    cdk: {
      bucket: {
        publicAccessBlockConfiguration: undefined, // Disable public access block
      },
    },
  });

  // Create another bucket for extracted text with public access block disabled
  const bucket2 = new Bucket(stack, "ExtractedTXT", {
    cdk: {
      bucket: {
        publicAccessBlockConfiguration: undefined, // Disable public access block
      },
    },
  });

  // Bind the second bucket to the Lambda function
  notificationFunction.bind([bucket2]);

  // Outputs
  stack.addOutputs({
    BucketName: bucket.bucketName,
    LambdaFunctionName: notificationFunction.functionName,
  });

  return { bucket, notificationFunction, bucket2 };
}
