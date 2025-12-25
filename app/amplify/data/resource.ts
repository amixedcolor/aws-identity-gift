import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { bedrockChat } from '../functions/bedrock-chat/resource';
import { diagnostic } from '../functions/diagnostic/resource';
import { giftCard } from '../functions/gift-card/resource';

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
  
  diagnostic: a
    .query()
    .arguments({
      mode: a.string().required(),
      responses: a.string().required(), // JSON string of UserResponse[]
      services: a.string().required(),  // JSON string of AWSService[]
    })
    .returns(
      a.customType({
        result: a.string(), // JSON string of DiagnosticResult
        error: a.string(),
      })
    )
    .authorization((allow) => [allow.publicApiKey()])
    .handler(a.handler.function(diagnostic)),
  
  giftCard: a
    .query()
    .arguments({
      resultData: a.string().required(), // JSON string of DiagnosticResult
      userName: a.string(),              // Optional user name
    })
    .returns(
      a.customType({
        imageData: a.string(), // Base64 encoded image
        error: a.string(),
      })
    )
    .authorization((allow) => [allow.publicApiKey()])
    .handler(a.handler.function(giftCard)),
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
