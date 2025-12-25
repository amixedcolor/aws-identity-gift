import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { bedrockChat } from './functions/bedrock-chat/resource';
import { diagnostic } from './functions/diagnostic/resource';
import { giftCard } from './functions/gift-card/resource';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

const backend = defineBackend({
  auth,
  data,
  bedrockChat,
  diagnostic,
  giftCard,
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

// 診断Function用のBedrock権限を追加
backend.diagnostic.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: [
      'bedrock:InvokeModel',
      'aws-marketplace:ViewSubscriptions',
      'aws-marketplace:Subscribe'
    ],
    resources: ['*'],
  })
);

// ギフトカード生成Function用のBedrock権限を追加
backend.giftCard.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: [
      'bedrock:InvokeModel',
      'aws-marketplace:ViewSubscriptions',
      'aws-marketplace:Subscribe'
    ],
    resources: ['*'],
  })
);
