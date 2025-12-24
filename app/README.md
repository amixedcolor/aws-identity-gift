# Amplify Gen2 with Next.js

This is a Next.js application integrated with AWS Amplify Gen2 for backend services.

## Features

- **Authentication**: Email-based authentication with AWS Cognito
- **Data**: Real-time Todo list with GraphQL API
- **Authorization**: Owner-based access control for todos

## Prerequisites

- Node.js v14.x or later
- npm v6.14.4 or later
- AWS Account with appropriate permissions
- AWS CLI configured with credentials

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure AWS Credentials

Make sure you have AWS credentials configured locally. You need the `AmplifyBackendDeployFullAccess` permission.

For detailed setup instructions, visit: https://docs.amplify.aws/nextjs/start/account-setup/

### 3. Start Cloud Sandbox

The cloud sandbox provides a personal development environment:

```bash
npm run amplify:sandbox
```

This will:
- Deploy your backend to AWS
- Generate `amplify_outputs.json` with connection details
- Watch for backend changes and auto-deploy

### 4. Run Development Server

In a separate terminal:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

## Project Structure

```
amplify-nextjs-app/
├── amplify/
│   ├── auth/
│   │   └── resource.ts       # Authentication configuration
│   ├── data/
│   │   └── resource.ts       # Data model and API schema
│   ├── backend.ts            # Backend definition
│   ├── package.json          # Backend dependencies
│   └── tsconfig.json         # TypeScript config for backend
├── app/
│   ├── AuthenticatorWrapper.tsx  # Client-side auth wrapper
│   ├── layout.tsx            # Root layout with Amplify config
│   └── page.tsx              # Main todo app page
└── amplify_outputs.json      # Generated backend config (gitignored)
```

## Deployment

### Deploy to Amplify Hosting

1. Push your code to GitHub
2. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/create/repo-branch)
3. Select "Start with an existing app" > "GitHub"
4. Choose your repository and branch
5. Click "Save and deploy"

Amplify will automatically:
- Deploy your frontend
- Deploy your backend
- Set up CI/CD for future commits

## Key Concepts

### Data Model

The Todo model in `amplify/data/resource.ts` uses:
- **Owner-based authorization**: Each user can only access their own todos
- **Real-time subscriptions**: Changes sync automatically across clients

### Authentication

Configured in `amplify/auth/resource.ts`:
- Email-based login
- Automatic user management with Cognito
- Integrated with Amplify UI Authenticator component

## Learn More

- [Amplify Gen2 Documentation](https://docs.amplify.aws/nextjs/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Amplify UI Components](https://ui.docs.amplify.aws/)

## Troubleshooting

### amplify_outputs.json not found

Run `npm run amplify:sandbox` first to generate the backend configuration.

### Authentication errors

Make sure your cloud sandbox is running and the `amplify_outputs.json` file is in the project root.

### Permission errors

Ensure your AWS credentials have the `AmplifyBackendDeployFullAccess` policy attached.
