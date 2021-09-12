const { AuthenticationError } = require("apollo-server-express");
const { User, Book } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findOne({ _id: context.user._id })
          .select("-__v -password")
          .populate("savedBooks");
        return user;
      }
      throw new AuthenticationError("Not Logged In!");
    },
    users: async (parent, args, context) => {
      return User.find({})
        .select("-__v -password")
        .populate("savedBooks");
    },
  }
};

module.exports = resolvers;