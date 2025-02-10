const { AuthenticationError, UserInputError } = require('apollo-server');
const Post = require('../../models/Post');
const User = require('../../models/User'); // Import User model
const checkAuth = require('../../util/check-auth');

module.exports = {
  Query: {
    async getPosts() {
      try {
        const tenDaysAgo = new Date();
        tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
    
        const posts = await Post.find({
          createdAt: { $gte: tenDaysAgo }  // Fetch only recent posts
        })
        .populate('user')
        .exec();
    
        return posts;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    async getPost(_, { postId }) {
      try {
        const post = await Post.findOne({ _id: postId }).populate('user').exec();
        if (post) {
          return post;
        } else {
          throw new Error('Post not found');
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    async getFollowedPosts(_, __, context) {
      const { username } = checkAuth(context); // Ensure user is authenticated

      const currentUser = await User.findOne({ username });
      if (!currentUser) throw new Error("User not found");

      // Get posts only from followed users
      const followedPosts = await Post.find({
        "user.username": { $in: currentUser.following }, // Assuming `following` is an array of usernames
      }).sort({ createdAt: -1 });

      return followedPosts;
    }
  },
  Mutation: {
    async createPost(_, { body, imageUrl }, context) {
      const user = checkAuth(context);

      if (body.trim() === '' && !imageUrl) {
        throw new Error('Post must have either text or an image.');
      }

      const newPost = new Post({
        body,
        imageUrl,  // New field for image
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString()
      });

      const post = await newPost.save();
      return post;
    },
    async updatePost(_, { postId, body, imageUrl }, context) {
      const user = checkAuth(context);

      try {
        const post = await Post.findById(postId);

        if (post) {
          post.body = body || post.body;
          post.imageUrl = imageUrl || post.imageUrl; // Allow updating image
          await post.save();
          return post;
        } else {
          throw new UserInputError('Post not found');
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    async deletePost(_, { postId }, context) {
      const user = checkAuth(context);

      try {
        const post = await Post.findById(postId);
        if (user.isAdmin || user.username === post.username) {
          await post.delete();
          return 'Post deleted successfully';
        } else {
          throw new AuthenticationError('Action not allowed');
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    async likePost(_, { postId }, context) {
      const { username } = checkAuth(context);

      const post = await Post.findById(postId);

      if (post) {
        if (post.likes.find((like) => like.username === username)) {
          // Post already liked, unlike it
          post.likes = post.likes.filter((like) => like.username !== username);
        } else {
          // Not liked, like post
          post.likes.push({
            username,
            createdAt: new Date().toISOString()
          });
        }
        await post.save();
        return post;
      } else {
        throw new UserInputError('Post not found');
      }
    }
  }
};
