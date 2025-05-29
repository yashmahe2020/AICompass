# AI Review Summary

A Next.js application that provides AI-generated summaries of product reviews.

## Features

- Browse AI tools with reviews
- View AI-generated summaries of reviews
- Add new reviews for tools
- Responsive design with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm
- Firebase project with Firestore database
- reCAPTCHA Enterprise site key
- OpenAI API key (for generating summaries)

### Environment Setup

1. Copy the example environment file:
   ```bash
   cp config/env.example .env.local
   ```

2. Fill in your environment variables:
   - Firebase configuration (from your Firebase project settings)
   - reCAPTCHA Enterprise site key
   - OpenAI API key
   - Firebase Admin SDK service account (for server-side operations)

### Firebase Setup

1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Firestore database
3. Set up App Check with reCAPTCHA Enterprise:
   - Go to App Check in the Firebase console
   - Register your app
   - Choose reCAPTCHA Enterprise as the provider
   - Get your site key and add it to your environment variables

4. Create a service account for the Admin SDK:
   - Go to Project Settings > Service Accounts
   - Click "Generate New Private Key"
   - Save the JSON file
   - Convert the JSON to a string and add it to your environment variables as `FIREBASE_SERVICE_ACCOUNT`

5. **Firestore Indexes (Important)**:
   The app requires a composite index for optimal review ordering. When you first deploy, you may see an error like:
   ```
   The query requires an index. You can create it here: https://console.firebase.google.com/...
   ```
   
   **Don't worry!** The app has a fallback mechanism that will:
   - Catch the missing index error
   - Fall back to a basic query without ordering
   - Sort reviews client-side to show newest first
   
   To create the required index:
   - Click the link in the error message, or
   - Go to Firestore > Indexes in your Firebase console
   - Create a composite index for the `reviews` collection with fields:
     - `productId` (Ascending)
     - `safe` (Ascending) 
     - `date` (Descending)
     - `__name__` (Ascending)

6. Set up Firestore security rules to allow authenticated access:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read: if request.auth != null || request.app != null;
         allow write: if request.auth != null;
       }
     }
   }
   ```

### Development

1. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Deployment

1. Build the application:
   ```bash
   npm run build
   # or
   pnpm build
   ```

2. Start the production server:
   ```bash
   npm run start
   # or
   pnpm start
   ```

## Troubleshooting

### App Check Issues

If you're getting "Missing or insufficient permissions" errors:

1. Make sure your reCAPTCHA Enterprise site key is correctly set in your environment variables
2. For development, set the `NEXT_PUBLIC_APP_CHECK_DEBUG_TOKEN` environment variable
3. Check that your Firestore security rules allow access from your app

### Server-Side Operations

If server-side operations are failing:

1. Ensure your Firebase Admin SDK service account is correctly set in your environment variables
2. Check that your service account has the necessary permissions in your Firebase project

## License

This project is licensed under the MIT License - see the LICENSE file for details.
