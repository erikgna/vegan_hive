import { driver } from ".";

export const resolvers = {
  Mutation: {
    createComment: async (_: any, args: any) => {
      const { content, authorId } = args.input;
      const session = driver.session();

      try {
        const result = await session.executeWrite((tx: any) =>
          tx.run(
            `
              MATCH (a:User {userId: $authorId})
              CREATE (c:Comment {
                commentId: randomUUID(),
                content: $content
              })-[:AUTHOR]->(a)
              RETURN c
            `,
            {
              content,
              authorId,
            }
          )
        );

        return result.records[0].get("c").properties;
      } finally {
        session.close();
      }
    },

    createPost: async (_: any, args: any) => {
      const { title, content, authorId } = args.input;
      const session = driver.session();

      try {
        const result = await session.executeWrite((tx: any) =>
          tx.run(
            `
                MATCH (a:User {userId: $authorId})
                CREATE (c:Post {
                  commentId: randomUUID(),
                  title: $title
                  content: $content
                })-[:AUTHOR]->(a)
                RETURN c
              `,
            {
              title,
              content,
              authorId,
            }
          )
        );

        return result.records[0].get("c").properties;
      } finally {
        session.close();
      }
    },

    likePost: async (_: any, args: any) => {
      const { postId, userId } = args.input;
      const session = driver.session();

      try {
        const result = await session.executeWrite((tx: any) =>
          tx.run(
            `
                MATCH (a:User {userId: $userId})
                MATCH (b:Post {postId: $postId})
                CREATE (c:Like {
                  likeId: randomUUID()                  
                })-[:USER, :POST]->(a, b)
                RETURN c
              `,
            {
              postId,
            }
          )
        );

        return result.records[0].get("c").properties;
      } finally {
        session.close();
      }
    },
  },
};
