import { driver } from "../..";
import { AuthUtils } from "../../firebase/auth";
import { saveFile } from "../../utils/saveFile";

export class UserResolver {
  getProfileInformation = async (_: any, args: any) => {
    const { email } = args;

    const session = driver.session();
    try {
      const user = await session.executeRead(async (tx) => {
        const query = `
          MATCH (u:User)
          WHERE u.email = $email
          RETURN u.username AS username, u.iconPath AS iconPath, u.description AS description
        `;

        const result = await tx.run(query, { email });

        if (result.records.length === 0) {
          return null; // Return null if user not found
        }

        const record = result.records[0];
        const user = {
          iconPath: record.get("iconPath"),
          username: record.get("username"),
          description: record.get("description"),
        };

        return user;
      });

      return user;
    } catch (error) {
      console.log(error);
    }
  };

  createUser = async (_: any, args: any, context: any) => {
    const { username, email } = args.input;

    const session = driver.session();
    try {
      const result = await session.executeWrite(async (tx: any) => {
        const query = `            
          CREATE (c:User {
            userId: randomUUID(),
            username: $username,
            email: $email
          })
          RETURN c
        `;

        const params = {
          username,
          email,
        };

        const result = await tx.run(query, params);

        return result.records[0].get("c").properties;
      });

      return result;
    } catch (error) {
      if (
        (error as any).code ===
        "Neo.ClientError.Schema.ConstraintValidationFailed"
      ) {
        // Verifique se o erro é relacionado à violação de uma restrição única (email duplicado)
        throw new Error(
          "Email is already in use. Please choose a different email."
        );
      }

      // Se não for um erro de email duplicado, envie uma mensagem genérica
      throw new Error("Could not create user. Please try again later.");
    } finally {
      session.close();
    }
  };

  editUser = async (_: any, args: any, context: any) => {
    const { email, username, description, file } = args.input;

    const userInfo = await AuthUtils.verifyToken(context.firebaseId);
    const session = driver.session();

    try {
      const params: any = {
        email,
        username,
        description,
      };
      var pathQuery = "";

      if (file) {
        const path = `${userInfo.user_id}/icons`;
        const filePath = await saveFile(file, path);
        params["iconPath"] = filePath;
        pathQuery = ", a.iconPath = $iconPath";
      }

      const result = await session.executeWrite(async (tx: any) => {
        const query = `
          MATCH (a:User {email: $email})
          SET a.username = $username, a.description = $description${pathQuery}
          RETURN a
        `;

        const result = await tx.run(query, params);
        const updatedUser = result.records[0].get("a").properties;

        return updatedUser;
      });

      return result;
    } catch (e) {
      session.close();
    } finally {
      session.close();
    }
  };
}
