import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_CLIENT_EMAIL,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
});
