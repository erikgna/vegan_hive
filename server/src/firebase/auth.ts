import admin from "firebase-admin";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { ogm } from "..";

export class AuthUtils {
  static verifyToken = async (idToken: string): Promise<DecodedIdToken> => {
    const result = await admin.auth().verifyIdToken(idToken);

    if (result.exp * 1000 < Date.now()) {
      throw new Error("Token is expired.");
    } else {
      await ogm.init();
      const User = ogm.model("User");

      const user = await User.find({
        where: { email: result.email },
      });

      if (user[0].token !== idToken) {
        await User.update({
          where: { email: result.email },
          update: { token: idToken },
        });
      }
    }

    return result;
  };
}
