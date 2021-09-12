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
  },
  Mutation: {
    login: async (parent, { email, password }) => {
        const user = await User.findOne({ email });
        if (!user) {
            throw new AuthenticationError("Incorrect Credentials!");
        }
        const correctPw = await user.isCorrectPassword(password);

        if (!correctPw) {
            throw new AuthenticationError("Incorrect Credentials!");
        }
        const token = signToken(user);

        return { token, user };
    },
  }
};

module.exports = resolvers;