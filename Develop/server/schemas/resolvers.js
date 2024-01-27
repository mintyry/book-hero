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

    }
}