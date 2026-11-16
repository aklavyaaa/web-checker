# CloudVault signed Cloudinary uploads

CloudVault now uses Cloudinary **signed uploads**. The browser asks the Firebase callable
function `createCloudinarySignature` for a short-lived signature, then uploads the file
directly to Cloudinary. No unsigned upload preset is used.

## Important: rotate the exposed API secret first

The old Cloudinary API secret was included in a browser-side code sample. Treat it as
compromised: rotate/regenerate it in the Cloudinary dashboard. Do not paste the new
secret into `Sharable.html`, GitHub source, or chat.

## Deploy the signing function

1. Install Node.js 20+ and the Firebase CLI.
2. Open a terminal in this repository and run:

   ```bash
   npm install -g firebase-tools
   firebase login
   firebase use sanchitution
   ```

3. Set the **newly rotated** Cloudinary API secret. The CLI prompts for it securely:

   ```bash
   firebase functions:secrets:set CLOUDINARY_API_SECRET
   ```

4. Deploy the backend:

   ```bash
   cd functions
   npm install
   cd ..
   firebase deploy --only functions
   ```

5. Reload the website and test an upload. The frontend calls the deployed
   `createCloudinarySignature` Firebase callable function. The Cloudinary cloud name
   and API key are already configured in the project code.

## Billing and security notes

- Deploying Firebase Cloud Functions generally requires the Firebase project to use the
  Blaze (pay-as-you-go) plan. Review Firebase pricing and set budget alerts first.
- The current six-digit locker code is an app-level access code, not Firebase
  Authentication. This function validates the code format but does not prove ownership
  of a locker. Keep this project in testing use until proper authentication, database
  rules, App Check, and abuse/rate limits are configured.
- The Cloudinary API secret stays in Firebase Secret Manager; it is not exposed to
  website visitors.
