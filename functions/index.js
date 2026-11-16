const crypto = require("node:crypto");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");

// Public Cloudinary identifiers are safe to keep here. The API secret is stored
// in Firebase Secret Manager and is never sent to the browser.
const CLOUDINARY_CLOUD_NAME = "dl1ishrkv";
const CLOUDINARY_API_KEY = "433163499287729";
const CLOUDINARY_API_SECRET = defineSecret("CLOUDINARY_API_SECRET");

exports.createCloudinarySignature = onCall(
  { secrets: [CLOUDINARY_API_SECRET] },
  async (request) => {
    const lockerCode = request.data && request.data.lockerCode;

    // Only allow this app's expected folder format.
    if (typeof lockerCode !== "string" || !/^\d{6}$/.test(lockerCode)) {
      throw new HttpsError("invalid-argument", "A valid six-digit locker code is required.");
    }

    const folder = "vault_" + lockerCode;
    const timestamp = Math.floor(Date.now() / 1000);

    // Cloudinary signs the alphabetically sorted upload parameters.
    const stringToSign =
      "folder=" + folder +
      "&timestamp=" + timestamp +
      CLOUDINARY_API_SECRET.value();

    const signature = crypto
      .createHash("sha1")
      .update(stringToSign, "utf8")
      .digest("hex");

    return {
      cloudName: CLOUDINARY_CLOUD_NAME,
      apiKey: CLOUDINARY_API_KEY,
      folder,
      timestamp,
      signature
    };
  }
);
