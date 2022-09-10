const User = require('../models/User');

const userResolvers = {
  Query: {
    loginUser: async (_parent, { username, password}, _context, _info) => {
      const user = await User.findOne({
        username: username,
        password: password
      });
      return user;
    },
    getUser: async (_parent, { userId }, _context, _info) => {
      const user = await User.findById(userId);
      return user;
    },
  },

  Mutation: {
    createUser: async (_parent, args, _context, _info) => {
      console.log(args);
      const { firstName, lastName, weight, height, username, password } = args;

      const data = await User.exists({username: username})
        if(data != null) {
          return null;
        }
      const user = new User({
        firstName: firstName,
        lastName: lastName,
        weight: weight,
        height: height,
        username: username,
        password: password
      });
      await user.save();
      return user;
    },
    deleteUser: async (_parent, args, _context, _info) => {
      const { id } = args;
      await User.findByIdAndDelete(id);
      return true;
    },
    updateUser: async (_parent, args, _context, _info) => {
      const { id, firstName, lastName, weight, height } = args;

      const updates = {};
      if (firstName !== undefined) {
        updates.firstName = firstName;
      }
      if (lastName !== undefined) {
        updates.lastName = lastName;
      }
      if (weight !== undefined) {
        updates.weight = weight;
      }
      if (height !== undefined) {
        updates.height = height;
      }

      const user = await User.findByIdAndUpdate(id, updates, {
        new: true,
      });
      return user;
    },
  },
};

module.exports = userResolvers;