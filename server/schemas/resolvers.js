const { User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

module.exports = {
    Query: {
        // context is data that got added to token (ie: username, email, _id)
        me: async (_, args, context) => {
            if (context.user) {
                return User.findOne({ _id: context.user._id });
            }
            throw AuthenticationError;
        }
    },

    Mutation: {
        login: async (_, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw AuthenticationError;
            }

            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw AuthenticationError;
            }

            const token = signToken(user);

            return { token, user }
        },
        createUser: async (_, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
        },
        //
        saveBook: async (_, { input }, context) => {
            if (context.user) {
                // findoneupdate, which one am i looking up, how should i update/whats the action, options
                return await User.findOneAndUpdate(
                    { _id: context.user._id}, {$addToSet: { savedBooks: input } }, {new:true, runValidators: true}
                )
            }
            throw AuthenticationError;
        },
        deleteBook: async (_, { bookId }, context) => {
            if (context.user) {
                return await User.findOneAndUpdate(
                    { _id: context.user._id}, {$pull: { savedBooks: {bookId} } }, {new:true, runValidators: true}
                )
            }
            throw AuthenticationError;
        }
    } //ends mutation
};