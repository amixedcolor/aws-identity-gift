import { defineFunction } from '@aws-amplify/backend';

export const bedrockChat = defineFunction({
  name: 'bedrock-chat',
  timeoutSeconds: 60,
});
