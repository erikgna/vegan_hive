import admin from "firebase-admin";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";

export class AuthUtils {
  static verifyToken = async (idToken: string): Promise<DecodedIdToken> => {
    const result = await admin.auth().verifyIdToken(idToken);

    if (result.exp * 1000 < Date.now()) throw new Error("Token expired");

    return result;
  };
}
