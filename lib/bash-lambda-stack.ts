import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as child_process from 'child_process'
import * as iam from 'aws-cdk-lib/aws-iam'

export class BashLambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const handler = new lambda.Function(this, 'bash-lambda', {
      functionName: 'bash-lambda',
      runtime: lambda.Runtime.PROVIDED_AL2,
      code: lambda.Code.fromAsset('', {
        bundling: {
          image: lambda.Runtime.PROVIDED_AL2.bundlingImage,
          local: {
            tryBundle: (outputDir) => {
              child_process.execSync(`cp ./functions/bootstrap ${outputDir}`)
              return true
            }
          }
        }
      }),
      architecture: lambda.Architecture.ARM_64,
      handler: 'n/a'
    })

    new cdk.CfnOutput(this, 'function-id', {
      value: handler.functionName
    })
  }
}
