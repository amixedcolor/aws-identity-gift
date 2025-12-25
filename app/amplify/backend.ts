import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { bedrockChat } from './functions/bedrock-chat/resource';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

const backend = defineBackend({
  auth,
  data,
  bedrockChat,
});

// Bedrock呼び出し権限を追加
backend.bedrockChat.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: [
      'bedrock:InvokeModel',
      'aws-marketplace:ViewSubscriptions',
      'aws-marketplace:Subscribe'
    ],
    resources: ['*'],
  })
);
