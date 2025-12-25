import { defineFunction } from '@aws-amplify/backend';

export const diagnostic = defineFunction({
  name: 'diagnostic',
  timeoutSeconds: 60,
});
