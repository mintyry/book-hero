const { User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

module.exports = {
    // get data, context is payload
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
        // login mutation takes in two arguments, email & password
        login: async (_, { email, password }) => {
            // find user by email and put into variable
            const user = await User.findOne({ email });
            if (!user) {
                throw AuthenticationError;
            }

            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw AuthenticationError;
            }

            // when password is correct, sign token with user information, thus logging them in
            const token = signToken(user);

            return { token, user }
        },

        createUser: async (_, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            // logs them in
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