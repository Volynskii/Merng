const {gql} = require('apollo-server');

module.exports = gql`
type Post {
id: ID!
body: String!,
test: String,
createdAt: String!,
username: String!
comments: [Comment]!
likes: [Like]!
likeCount: Int!
commentCount:  Int!
replies: [String]
}

type Comment{
id: ID!
createdAt: String!
username: String!
body: String!
replies: [String]
}
type Like{
id: ID!
createdAt: String!
username: String!
}
type User{
id: ID!
email: String!
token: String!
username: String!
createdAt: String!
}
input RegisterInput{
username: String!,
password: String!,
confirmPassword: String!,
email: String!
}
  type Query{
  getPosts: [Post]
  getPost(postId: ID!): Post
  replyComment(newReply: String!,postId: ID!,commentId: ID!): Post
  }
  type Mutation{
  register(registerInput: RegisterInput): User!
  login(username: String!,password: String!): User!
  createPost(body: String!): Post!
  replyComment(newReply: String!,postId: ID!,commentId: ID!): Post
  deletePost(postId: ID!): String!
  createComment(postId: String!, body: String!): Post!
  deleteComment(postId: ID!,commentId: ID!): Post!
  likePost(postId: ID!): Post!
  }
  type Subscription{
  newPost: Post!
  }
`;
