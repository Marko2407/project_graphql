const User = require('../models/User');

const resolvers = {
    Query: {
        getUser: async () => {
            const user = await User.find();
            return user;
          },
    },

    Mutation: {
        createUser: async (_parent, args, _context, _info) => {
            console.log(args)
            const { first, last, weight, height } = args;
            const user = new User({
              firstName: first,
              lastName: last,
              weight: weight,
              height: height
            });
            await user.save();
            return user;
          },
    },
};

module.exports = resolvers;