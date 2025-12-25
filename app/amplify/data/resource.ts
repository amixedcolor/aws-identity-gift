import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { bedrockChat } from '../functions/bedrock-chat/resource';

const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
      isDone: a.boolean(),
    })
    .authorization((allow) => [allow.owner()]),
  
  chat: a
    .query()
    .arguments({
      prompt: a.string().required(),
    })
    .returns(
      a.customType({
        response: a.string(),
        error: a.string(),
      })
    )
    .authorization((allow) => [allow.publicApiKey()])
    .handler(a.handler.function(bedrockChat)),
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
