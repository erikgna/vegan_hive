import { ogm } from "../..";
import { AuthUtils } from "../../firebase/auth";
import { saveFile } from "../../utils/saveFile";

export class UserResolver {
  saveUserToken = async (_: any, args: any) => {
    const { token, email } = args.input;

    try {
      await ogm.init();
      const User = ogm.model("User");

      const users = await User.update({
        where: { email: email },
        update: { token: token },
      });

      if (users.length === 0) {
        throw new Error("Couldn't authenticate user.");
      }

      return users[0];
    } catch (error) {
      throw new Error("Couldn't authenticate user.");
    }
  };
  getProfileInformation = async (_: any, args: any) => {
    try {
      await ogm.init();
      const User = ogm.model("User");

      const users = await User.find({
        where: { userId: args.userId },
      });

      if (users.length === 0) {
        throw new Error("Couldn't find profile.");
      }

      return users[0];
    } catch (error) {
      throw new Error("An error ocurred while retrieving profile information.");
    }
  };

  getProfile = async (_: any, args: any) => {
    try {
      await ogm.init();
      const User = ogm.model("User");

      const users = await User.find({
        where: { email: args.email },
      });

      if (users.length === 0) {
        throw new Error("Couldn't find profile.");
      }

      return users[0];
    } catch (error) {
      throw new Error("An error ocurred while retrieving profile information.");
    }
  };

  createUser = async (_: any, args: any) => {
    const { username, email } = args.input;

    try {
      await ogm.init();
      const User = ogm.model("User");

      const { users } = await User.create({
        input: [{ username, email }],
      });

      return users[0];
    } catch (error) {
      throw new Error("Couldn't create user.");
    }
  };

  editUser = async (_: any, args: any, context: any) => {
    const { username, description, file } = args.input;

    const userInfo = await AuthUtils.verifyToken(context.firebaseId);
    try {
      await ogm.init();
      const User = ogm.model("User");

      const updateParams: any = {
        username,
        description,
      };

      if (file) {
        const path = `${userInfo.user_id}/icons`;
        const filePath = await saveFile(file, path);
        updateParams["iconPath"] = filePath;
      }

      const { users } = await User.update({
        where: { email: userInfo.email },
        update: updateParams,
      });

      return users[0];
    } catch (error) {
      throw new Error("Couldn't update user.");
    }
  };
}
