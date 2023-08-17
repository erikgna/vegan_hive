import { driver, ogm } from "../..";
import { AuthUtils } from "../../firebase/auth";
import { saveFile } from "../../utils/saveFile";

export class PostResolver {
  getUserPosts = async (_: any, args: any) => {
    try {
      await ogm.init();
      const Post = ogm.model("Post");

      const posts = await Post.find({
        where: {
          author: {
            email: args.authorEmail,
          },
        },
      });

      return posts;
    } catch (error) {
      throw new Error("An error ocurred while retrieving user posts.");
    }
    //   const { authorEmail } = args;

    //   const session = driver.session();
    //   try {
    //     const recentPosts = await session.executeRead(async (tx) => {
    //       const query = `
    //           MATCH (p:Post)-[:AUTHOR]->(u:User)
    //           WHERE u.email = $authorEmail
    // RETURN p.postId AS postId, p.content AS content, p.imagePath AS imagePath,
    //        u.userId AS authorId, u.username AS authorUsername, u.email AS authorEmail,
    //        p.likes AS likes, p.comments AS comments, p.allLikes AS allLikes,
    //        p.date AS date
    //           ORDER BY date DESC
    //             `;

    //       const result = await tx.run(query, { authorEmail });
    //       const recentPosts = [];

    //       for (const record of result.records) {
    //         const post = {
    //           postId: record.get("postId"),
    //           content: record.get("content"),
    //           imagePath: record.get("imagePath"),
    //           likes: record.get("likes"),
    //           comments: record.get("comments") ?? [],
    //           allLikes: record.get("allLikes") ?? [],
    //           date: record.get("date"),
    //           author: {
    //             userId: record.get("authorId"),
    //             username: record.get("authorUsername"),
    //             email: record.get("authorEmail"),
    //           },
    //         };
    //         recentPosts.push(post);
    //       }

    //       return recentPosts;
    //     });

    //     return recentPosts;
    //   } catch (error) {
    //     console.log(error);
    //   }
  };
  getRecentPosts = async (_: any, args: any) => {
    const { page } = args;
    const size = 2;
    const skip = page * size;

    const session = driver.session();
    try {
      const recentPosts = await session.executeRead(async (tx) => {
        const query = `
          MATCH (p:Post)-[:AUTHOR]->(u:User)
          RETURN p.postId AS postId, p.content AS content, p.imagePath AS imagePath, p.date AS date, p.likes as likes,
                u.username AS authorUsername, u.email AS authorEmail, u.iconPath as iconPath            
          ORDER BY date DESC
          SKIP ${skip}
          LIMIT ${size}
        `;

        const result = await tx.run(query);
        const recentPosts = [];

        for (const record of result.records) {
          const comments = await tx.run(
            `
              MATCH (p:Post)--(m:Comment)-[:AUTHOR]->(u:User)
              WHERE p.postId = '${record.get("postId")}'
              RETURN m.date as date, m.content as content, u.username as username, u.email as email, u.iconPath as iconPath
            `
          );

          const post = {
            postId: record.get("postId"),
            content: record.get("content"),
            imagePath: record.get("imagePath"),
            likes: record.get("likes"),
            comments: comments.records.map((comment) => ({
              content: comment.get("content"),
              date: comment.get("date"),
              author: {
                username: comment.get("username"),
                email: comment.get("email"),
                iconPath: comment.get("iconPath"),
              },
            })),
            date: record.get("date"),
            author: {
              username: record.get("authorUsername"),
              email: record.get("authorEmail"),
              iconPath: record.get("iconPath"),
            },
          };
          recentPosts.push(post);
        }

        return recentPosts;
      });

      return recentPosts;
    } catch (error) {
      console.log(error);
    }
  };
  createPost = async (_: any, args: any, context: any) => {
    const { content, authorEmail, file } = args.input;

    const userInfo = await AuthUtils.verifyToken(context.firebaseId);
    const session = driver.session();

    try {
      const result = await session.executeWrite(async (tx: any) => {
        const date = new Date().toISOString();
        const query = `
          MATCH (a:User {email: $authorEmail})
          CREATE (c:Post {
            postId: randomUUID(),
            imagePath: '',
            content: $content,
            likes: 0,
            date: $date
          })-[:AUTHOR]->(a)
          RETURN c
        `;

        const params = {
          content,
          authorEmail,
          date,
        };

        const result = await tx.run(query, params);
        const properties = result.records[0].get("c").properties;

        const path = `${userInfo.user_id}/posts/${properties.postId}`;
        const filePath = await saveFile(file, path);

        const updateQuery = `
          MATCH (p:Post {postId: $postId})
          SET p.imagePath = $imagePath
          RETURN p
        `;

        const updateParams = {
          postId: properties.postId,
          imagePath: filePath,
        };

        await tx.run(updateQuery, updateParams);
        console.log(properties);
        return properties;
      });

      return result;
    } catch (e) {
      session.close();
    } finally {
      session.close();
    }
  };
}
