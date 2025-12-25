import { defineFunction } from '@aws-amplify/backend';

export const giftCard = defineFunction({
  name: 'gift-card',
  timeoutSeconds: 60,
  memoryMB: 1024, // Increased memory for image processing
});
