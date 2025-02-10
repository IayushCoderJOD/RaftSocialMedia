const mongoose = require("mongoose");
const Post = require("./models/Post"); // Adjust the path based on your structure

const MONGO_URI = "mongodb+srv://ayushtyagi4810poco:Igot93percent@@cluster0.nysxkws.mongodb.net/";

const deleteOldPosts = async () => {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    const cutoffDate = new Date();
    cutoffDate.setFullYear(cutoffDate.getFullYear() - 1); // 1 year ago

    const result = await Post.deleteMany({ createdAt: { $lt: cutoffDate } });

    console.log(`✅ Deleted ${result.deletedCount} old posts!`);
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error deleting old posts:", error);
    mongoose.connection.close();
  }
};

deleteOldPosts();
