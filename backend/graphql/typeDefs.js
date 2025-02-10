const { gql } = require('apollo-server');

module.exports = gql`
  type Post {
    id: ID!
    body: String!
    imageUrl: String
    createdAt: String!
    username: String!
    user: User
    comments: [Comment]!
    likes: [Like]!
    likeCount: Int!
    commentCount: Int!
  }
  type Comment{
    id: ID!
    createdAt: String!
    username: String!
    body: String!
  }
  type Like{
    id: ID!
    createdAt: String!
    username: String!
  }
 
  type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!
    photoURL: String
    isAdmin: Boolean
  }
  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }
  type Query {
    getPosts: [Post]
    getPost(postId: ID!): Post
    getUsers: [User]
    getUser(userId: ID!): User
    
  getFollowedPosts: [Post]!
  }
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    updateUser(userId: ID!, photoURL: String!): User!
    createPost(body: String!, imageUrl: String): Post!
    updatePost(postId: ID!, body: String!, imageUrl: String): Post
    deletePost(postId: ID!): String!
    followUser(userId: ID!): User

    createComment(postId: ID!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    likePost(postId: ID!): Post!
  }
`