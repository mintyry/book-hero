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
        // TODO: incorporate auth stuff/token?
        createUser: async (_, { username, email, password }) => {
            const newUser = await User.create({ username, email, password });
            const token = signToken(newUser);
            return {token, newUser};
        },
        //
        saveBook: async (_, { user, input }) => {
           return await User.findOneAndUpdate(
            {_id: user, $addToSet: { savedBooks: input}}
           )
        },
        deleteBook: async (_, { user, bookId }) => {
            return await User.findOneAndUpdate(
                {_id: user, $pull: { bookId } }
            )
        }
       
    } //ends mutation
}