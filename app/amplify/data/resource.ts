import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  // Placeholder model - service is closed, no AI functions
  Placeholder: a
    .model({
      id: a.id(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
