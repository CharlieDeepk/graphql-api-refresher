import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

// db
import db from "./_db.js";

// types
import { typeDefs } from "./schema.js";

// "Query" name should be same as in schema.js
// all the below listed is resolver func
const resolvers = {
  Query: {
    games() {
      return db.games;
    },
    game(_, args, context) {
      return db.games.find((game) => game.id === args.id);
    },
    authors() {
      return db.authors;
    },
    author(_, args, context) {
      return db.authors.find((author) => author.id === args.id);
    },
    reviews() {
      return db.reviews;
    },
    review(_, arg, context) {
      return db.reviews.find((review) => review.id === arg.id);
    },
  },
  Game: {
    reviews(parent) {
      return db.reviews.filter((review) => review.game_id === parent.id);
    },
  },
  Author: {
    reviews(parent) {
      return db.reviews.filter((review) => review.author_id === parent.id);
    },
  },
  Review: {
    author(parent) {
      return db.authors.find((author) => author.id === parent.author_id);
    },
    game(parent) {
      return db.games.find((game) => game.id === parent.game_id);
    },
  },

  Mutation: {
    addGame(_, args, context) {
      let newGame = { ...args.game, id: Math.floor(Math.random() * 10000) };
      db.games.push(newGame);
      return newGame;
    },
    deleteGame(_, args, context) {
      return db.games.filter((game) => game.id !== args.id);
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log("server is ready at port", 4000);
