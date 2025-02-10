const { model, Schema } = require('mongoose');

const postSchema = new Schema({
  body: String,
  username: String,
  createdAt: { type: Date, default: Date.now },  // Change from String to Date
  comments: [
    {
      body: String,
      username: String,
      createdAt: { type: Date, default: Date.now } // Change to Date
    }
  ],
  likes: [
    {
      username: String,
      createdAt: { type: Date, default: Date.now } // Change to Date
    }
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = model('Post', postSchema);
