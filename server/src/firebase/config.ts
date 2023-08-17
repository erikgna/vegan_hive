import admin from "firebase-admin";
import dotenv from "dotenv";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";

dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
});

export const verifyToken = async (idToken: string): Promise<DecodedIdToken> => {
  const result = await admin.auth().verifyIdToken(idToken);

  if (result.exp * 1000 < Date.now()) throw new Error("Token expired");

  return result;
};
