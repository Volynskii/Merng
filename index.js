const { ApolloServer } = require('apollo-server');
const gql = require('graphql-tag');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Post = require('./models/Post');

dotenv.config();

 const PORT = process.env.PORT;
 const CONNECTION_URL = process.env.CONNECTION_URL;
const typeDefs = gql`
type Post {
id: ID!
body: String!,
createdAt: String!,
username: String!
}
  type Query{
  getPosts: [Post]
  }
`;

const resolvers = {
  Query: {
     async getPosts() {
          try{
              const posts = await Post.find();
              return posts;
          } catch (err) {
              throw new Error(err);
          }
      }
  }
};

const server = new ApolloServer({
    typeDefs,
    resolvers
});

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => server.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)))
    .catch((error) => console.log(`${error} did not connect`));
