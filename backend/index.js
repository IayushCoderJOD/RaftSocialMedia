const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const dotenv = require('dotenv');
dotenv.config();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req })
});

const PORT = process.env.port || 8080;

mongoose
  .connect(process.env.MONGODB, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  })
  .then(() => {
    console.log('MongoDB Connected')
    return server.listen({ port: PORT })
  })
  .then(res => {
    console.log(`Server running at ${res.url}`)
  })
  .catch(err => {
    console.error(err)
  })


  const deleteOldPosts = async () => {
    try {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
      const result = await Post.deleteMany({ createdAt: { $lt: sixMonthsAgo } });
      console.log(result); // Logs deleted count
  
      mongoose.connection.close();
    } catch (error) {
      console.error(error);
    }
  };
  
  deleteOldPosts();